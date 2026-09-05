import { query } from "./db";
import type { Product } from "./types";

const PRODUCT_SELECT = `
  select
    p.id,
    p.slug,
    p.name,
    p.description,
    p.price_kobo,
    p.status,
    p.stock_count,
    p.initial_stock,
    p.made_to_order,
    p.sort_order,
    coalesce(r.reserved, 0)::int as reserved_count,
    coalesce(
      (select json_agg(i.url order by i.sort_order)
       from product_images i
       where i.product_id = p.id),
      '[]'
    ) as images
  from products p
  left join (
    select product_id, sum(quantity) as reserved
    from stock_reservations
    where not released and expires_at > now()
    group by product_id
  ) r on r.product_id = p.id
`;

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string | null,
    price_kobo: row.price_kobo as number,
    status: row.status as Product["status"],
    stock_count: row.stock_count as number,
    initial_stock: row.initial_stock as number,
    reserved_count: row.reserved_count as number,
    made_to_order: row.made_to_order as boolean,
    sort_order: row.sort_order as number,
    images: row.images as string[],
  };
}

export async function getShopProducts(): Promise<{
  available: Product[];
  comingSoon: Product[];
}> {
  const rows = await query(
    `${PRODUCT_SELECT}
     where p.status in ('available', 'coming_soon')
     order by p.sort_order asc, p.created_at asc`,
  );
  const products = rows.map(mapRow);
  return {
    available: products.filter((p) => p.status === "available"),
    comingSoon: products.filter((p) => p.status === "coming_soon"),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await query(`${PRODUCT_SELECT} where p.slug = $1`, [slug]);
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export async function searchProducts(term: string): Promise<Product[]> {
  const rows = await query(
    `${PRODUCT_SELECT}
     where p.status in ('available', 'coming_soon')
       and (p.name ilike $1 or p.description ilike $1)
     order by p.sort_order asc`,
    [`%${term}%`],
  );
  return rows.map(mapRow);
}

/** Marks expired, unpaid soft-reservations as released so their stock frees up. */
export async function releaseExpiredReservations() {
  await query(
    `update stock_reservations
     set released = true
     where not released and expires_at <= now()`,
  );
}
