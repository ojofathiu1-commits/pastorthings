import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

const bodySchema = z.object({
  orderCode: z.string().min(1),
  contact: z.string().min(3),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your order code and email or phone." }, { status: 400 });
  }
  const { orderCode, contact } = parsed.data;

  const orders = await query<{
    id: string;
    order_code: string;
    status: string;
    payment_status: string;
    courier_name: string | null;
    tracking_number: string | null;
    total_kobo: number;
    created_at: string;
  }>(
    `select id, order_code, status, payment_status, courier_name, tracking_number, total_kobo, created_at
     from orders
     where lower(order_code) = lower($1)
       and (lower(customer_email) = lower($2) or customer_phone = $2)`,
    [orderCode.trim(), contact.trim()],
  );

  const order = orders[0];
  if (!order) {
    return NextResponse.json(
      { error: "No order found with that code and contact info. Double-check and try again." },
      { status: 404 },
    );
  }

  const history = await query<{ status: string; note: string | null; created_at: string }>(
    `select status, note, created_at from order_status_history where order_id = $1 order by created_at asc`,
    [order.id],
  );

  return NextResponse.json({
    order_code: order.order_code,
    status: order.status,
    payment_status: order.payment_status,
    courier_name: order.courier_name,
    tracking_number: order.tracking_number,
    total_kobo: order.total_kobo,
    created_at: order.created_at,
    history,
  });
}
