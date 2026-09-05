import { pool } from "./db";
import { sendOrderConfirmationEmail } from "./email";

/** Idempotent: safe to call from both the Paystack webhook and the success-page fallback verify. */
export async function confirmPayment(reference: string) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    const { rows } = await client.query(
      `select id, order_code, payment_status, customer_email, customer_name, confirmation_token
       from orders where payment_reference = $1 for update`,
      [reference],
    );
    const order = rows[0];
    if (!order || order.payment_status === "paid") {
      await client.query("rollback");
      return;
    }

    await client.query(
      `update orders set payment_status = 'paid', status = 'payment_confirmed' where id = $1`,
      [order.id],
    );

    const { rows: items } = await client.query(
      `select product_id, quantity from order_items where order_id = $1`,
      [order.id],
    );
    for (const item of items) {
      // Made-to-order items aren't tracked as inventory -- nothing to decrement.
      await client.query(
        `update products set stock_count = stock_count - $1
         where id = $2 and not made_to_order`,
        [item.quantity, item.product_id],
      );
    }

    await client.query(`update stock_reservations set released = true where order_id = $1`, [order.id]);

    await client.query(
      `insert into order_status_history (order_id, status, note) values ($1, 'payment_confirmed', 'Payment received via Paystack')`,
      [order.id],
    );

    await client.query("commit");

    if (order.customer_email) {
      await sendOrderConfirmationEmail({
        to: order.customer_email,
        name: order.customer_name,
        orderCode: order.order_code,
        confirmationToken: order.confirmation_token,
      }).catch((err) => console.error("failed to send confirmation email", err));
    }
  } catch (err) {
    await client.query("rollback").catch(() => {});
    console.error("failed to confirm payment", err);
    throw err;
  } finally {
    client.release();
  }
}
