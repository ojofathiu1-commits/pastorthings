import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  await query(
    `update newsletter_subscribers set unsubscribed_at = now() where unsubscribe_token = $1`,
    [token],
  );

  const origin = new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/unsubscribed`);
}
