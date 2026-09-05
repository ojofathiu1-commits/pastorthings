import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { confirmPayment } from "@/lib/order-fulfillment";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    await confirmPayment(event.data.reference as string);
  }

  return NextResponse.json({ received: true });
}
