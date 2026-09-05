import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/lib/db";
import { initializeTransaction, paystackConfigured } from "@/lib/paystack";

const RESERVATION_MINUTES = 20;

const bodySchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
    address: z.string().min(5),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { customer, items } = parsed.data;

  const client = await pool.connect();
  try {
    await client.query("begin");

    let subtotalKobo = 0;
    const lineItems: {
      productId: string;
      name: string;
      unitPriceKobo: number;
      quantity: number;
      madeToOrder: boolean;
    }[] = [];

    for (const item of items) {
      const { rows } = await client.query(
        `select id, name, price_kobo, status, stock_count, made_to_order,
                coalesce((
                  select sum(quantity) from stock_reservations
                  where product_id = products.id and not released and expires_at > now()
                ), 0)::int as reserved
         from products
         where id = $1
         for update`,
        [item.productId],
      );

      const product = rows[0];
      if (!product) {
        await client.query("rollback");
        return NextResponse.json({ error: "One of the items in your cart no longer exists." }, { status: 409 });
      }

      if (product.status !== "available") {
        await client.query("rollback");
        return NextResponse.json({ error: `${product.name} is no longer available.` }, { status: 409 });
      }

      if (!product.made_to_order) {
        const available = product.stock_count - product.reserved;
        if (available < item.quantity) {
          await client.query("rollback");
          return NextResponse.json(
            { error: `${product.name} — only ${Math.max(0, available)} left in stock.` },
            { status: 409 },
          );
        }
      }

      const unitPriceKobo = product.price_kobo as number;
      subtotalKobo += unitPriceKobo * item.quantity;
      lineItems.push({
        productId: item.productId,
        name: product.name,
        unitPriceKobo,
        quantity: item.quantity,
        madeToOrder: product.made_to_order,
      });
    }

    const orderResult = await client.query(
      `insert into orders (customer_name, customer_email, customer_phone, delivery_address,
                            payment_method, subtotal_kobo, total_kobo)
       values ($1, $2, $3, $4, 'naira', $5, $5)
       returning id, order_code, confirmation_token`,
      [customer.name, customer.email, customer.phone, customer.address, subtotalKobo],
    );
    const order = orderResult.rows[0];

    for (const li of lineItems) {
      await client.query(
        `insert into order_items (order_id, product_id, product_name, unit_price_kobo, quantity, subtotal_kobo)
         values ($1, $2, $3, $4, $5, $6)`,
        [order.id, li.productId, li.name, li.unitPriceKobo, li.quantity, li.unitPriceKobo * li.quantity],
      );
      // Made-to-order items aren't tracked as inventory, so there's nothing to reserve.
      if (!li.madeToOrder) {
        await client.query(
          `insert into stock_reservations (product_id, order_id, quantity, expires_at)
           values ($1, $2, $3, now() + interval '${RESERVATION_MINUTES} minutes')`,
          [li.productId, order.id, li.quantity],
        );
      }
    }

    await client.query(
      `insert into order_status_history (order_id, status) values ($1, 'placed')`,
      [order.id],
    );

    await client.query("commit");

    if (!paystackConfigured()) {
      return NextResponse.json({ confirmationToken: order.confirmation_token, checkoutUrl: null });
    }

    try {
      const origin = new URL(req.url).origin;
      const tx = await initializeTransaction({
        email: customer.email,
        amountKobo: subtotalKobo,
        callbackUrl: `${origin}/checkout/success/${order.confirmation_token}`,
        metadata: { order_id: order.id, order_code: order.order_code },
      });
      await pool.query(
        `update orders set payment_provider = 'paystack', payment_reference = $1 where id = $2`,
        [tx.reference, order.id],
      );
      return NextResponse.json({ confirmationToken: order.confirmation_token, checkoutUrl: tx.authorization_url });
    } catch {
      return NextResponse.json(
        { error: "Couldn't start payment. Please try again in a moment." },
        { status: 502 },
      );
    }
  } catch (err) {
    await client.query("rollback").catch(() => {});
    console.error("checkout failed", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
}
