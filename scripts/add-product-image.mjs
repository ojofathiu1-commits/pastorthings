// Uploads a local photo to the Railway bucket and attaches it to a product.
//
// Usage:
//   node --env-file=.env.local scripts/add-product-image.mjs <product-slug> <path-to-image> [more images...]
//
// Images are served back through /api/media/... (see src/app/api/media/[...key]/route.ts)
// rather than directly from the bucket, so this works regardless of the bucket's
// public-access configuration.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pg from "pg";

const [slug, ...filePaths] = process.argv.slice(2);

if (!slug || filePaths.length === 0) {
  console.error("Usage: node --env-file=.env.local scripts/add-product-image.mjs <product-slug> <image...>");
  process.exit(1);
}

const CONTENT_TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

const s3 = new S3Client({
  endpoint: process.env.STORAGE_BUCKET_ENDPOINT,
  region: process.env.STORAGE_BUCKET_REGION ?? "auto",
  credentials: {
    accessKeyId: process.env.STORAGE_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_BUCKET_SECRET_KEY,
  },
  forcePathStyle: true,
});

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const { rows } = await pool.query("select id from products where slug = $1", [slug]);
if (rows.length === 0) {
  console.error(`No product with slug "${slug}"`);
  process.exit(1);
}
const productId = rows[0].id;

const { rows: countRows } = await pool.query(
  "select coalesce(max(sort_order), -1) as max_sort from product_images where product_id = $1",
  [productId],
);
let sortOrder = countRows[0].max_sort + 1;

for (const filePath of filePaths) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    console.error(`Skipping ${filePath} — unsupported extension ${ext}`);
    continue;
  }

  const buffer = await readFile(filePath);
  const key = `products/${slug}/${Date.now()}-${path.basename(filePath)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  const url = `/api/media/${key}`;
  await pool.query(
    "insert into product_images (product_id, url, sort_order) values ($1, $2, $3)",
    [productId, url, sortOrder],
  );

  console.log(`Uploaded ${filePath} -> ${url}`);
  sortOrder += 1;
}

await pool.end();
