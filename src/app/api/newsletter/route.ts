import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  await query(
    `insert into newsletter_subscribers (email) values ($1)
     on conflict (email) do update set unsubscribed_at = null`,
    [parsed.data.email],
  );

  return NextResponse.json({ ok: true });
}
