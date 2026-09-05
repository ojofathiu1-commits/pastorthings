import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

const bodySchema = z
  .object({
    productId: z.string().uuid(),
    email: z.string().email().optional(),
    whatsapp: z.string().min(7).optional(),
  })
  .refine((v) => v.email || v.whatsapp, { message: "email or whatsapp is required" });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { productId, email, whatsapp } = parsed.data;

  const product = await query<{ id: string }>(
    `select id from products where id = $1 and status = 'coming_soon'`,
    [productId],
  );
  if (product.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await query(
    `insert into subscribers (product_id, email, whatsapp_number) values ($1, $2, $3)`,
    [productId, email ?? null, whatsapp ?? null],
  );

  return NextResponse.json({ ok: true });
}
