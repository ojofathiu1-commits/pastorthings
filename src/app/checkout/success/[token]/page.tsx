import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { formatNaira } from "@/lib/money";
import { paystackConfigured, verifyTransaction } from "@/lib/paystack";
import { confirmPayment } from "@/lib/order-fulfillment";
import styles from "./page.module.css";

type OrderRow = {
  order_code: string;
  payment_status: string;
  payment_reference: string | null;
  total_kobo: number;
};

async function getOrder(token: string) {
  const rows = await query<OrderRow>(
    `select order_code, payment_status, payment_reference, total_kobo
     from orders where confirmation_token = $1`,
    [token],
  );
  return rows[0] ?? null;
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: PageProps<"/checkout/success/[token]">) {
  const { token } = await params;
  const sp = await searchParams;
  const reference = typeof sp.reference === "string" ? sp.reference : null;

  let order = await getOrder(token);
  if (!order) notFound();

  // Fallback in case the webhook hasn't landed yet by the time Paystack redirects back.
  if (order.payment_status === "pending" && reference && paystackConfigured()) {
    try {
      const verified = await verifyTransaction(reference);
      if (verified.status === "success") {
        await confirmPayment(reference);
        order = await getOrder(token);
      }
    } catch (err) {
      console.error("fallback verify failed", err);
    }
  }

  if (!order) notFound();

  const paid = order.payment_status === "paid";

  return (
    <div className={styles.wrap}>
      <div className={styles.badge}>{paid ? "✓" : "…"}</div>
      <h1 className={styles.title}>{paid ? "Order Confirmed" : "Order Placed"}</h1>
      <p className={styles.orderCode}>{order.order_code}</p>
      <p className={styles.status}>
        {paid
          ? `Payment received — ${formatNaira(order.total_kobo)}`
          : "We're confirming your payment — this can take a minute."}
      </p>
      <p className={styles.note}>
        Save your order code above. You can check delivery status anytime on the Track Order page.
      </p>
      <a className={styles.link} href="/track-order">
        Track Order
      </a>
    </div>
  );
}
