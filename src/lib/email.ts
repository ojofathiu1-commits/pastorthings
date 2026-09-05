import { Resend } from "resend";

const FROM = "ILL MEMBER <orders@illmember.com>";

function client() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  name: string;
  orderCode: string;
  confirmationToken: string;
}) {
  const resend = client();
  if (!resend) return; // email not configured yet -- order still succeeds

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Order ${params.orderCode} confirmed`,
    text: [
      `Hi ${params.name},`,
      "",
      `Your order ${params.orderCode} is confirmed and being prepared.`,
      `Receipt: ${siteUrl}/checkout/success/${params.confirmationToken}`,
      `Track it anytime with your order code: ${siteUrl}/track-order`,
      "",
      "— ILL MEMBER",
    ].join("\n"),
  });
}
