# ILL MEMBER — Store

Official merch store: anonymous browse-and-buy, no fan accounts. Contact info
is only collected at checkout and on coming-soon "notify me" signups.

## Stack

- **Frontend/backend:** Next.js (App Router, TypeScript), API routes
- **Database:** Postgres on Railway
- **Object storage:** Railway bucket (S3-compatible), for product images
- **Payments:** Paystack (Naira — card/bank transfer/USSD). Crypto is phase 2.
- **Email:** Resend, for order confirmations and notify-me blasts

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in real values. `DATABASE_URL`
should point at the Railway Postgres public proxy (`railway tcp-proxy list
--service Postgres`) — the internal `postgres.railway.internal` host only
resolves from inside Railway's network, not from a laptop.

## Database

Schema lives in `db/schema.sql` (full baseline) with incremental changes in
`db/migrations/*.sql`, applied in order. Apply a file with:

```bash
psql "$DATABASE_URL" -f db/schema.sql -v ON_ERROR_STOP=1
```

`db/seed.sql` inserts one sample product for local testing.

## How ordering works

1. **Cart** is client-side only (`localStorage`, see `CartProvider`) — no
   accounts, so nothing server-side until checkout.
2. **Checkout** (`POST /api/checkout`) validates stock inside a DB
   transaction (`select ... for update`), creates the order + order_items,
   and soft-reserves stock for 20 minutes via `stock_reservations` — long
   enough to complete payment, short enough that an abandoned checkout
   doesn't lock up limited-drop inventory. Reservations expire on their own;
   nothing needs to actively release them (`expires_at > now()` in every
   availability check already excludes them).
3. If `PAYSTACK_SECRET_KEY` is set, checkout initializes a Paystack
   transaction and redirects to it. Without a key (no merchant account yet),
   it skips straight to the confirmation page with the order left `pending`
   — the whole flow is testable end-to-end before real payments exist.
4. **`POST /api/webhooks/paystack`** verifies the `x-paystack-signature`
   HMAC and marks the order paid, decrements real stock, and emails a
   confirmation. The confirmation page (`/checkout/success/[token]`) also
   verifies directly with Paystack as a fallback in case the webhook is
   delayed past the redirect.
5. **Order codes** (`ILLM-0001`, ...) are sequential and guessable by design
   (they're meant to be read over the phone), so the confirmation page is
   keyed on a separate random `confirmation_token`, not the order code —
   otherwise anyone could page through `ILLM-0001`, `ILLM-0002`, ... and read
   other fans' orders. **Track Order** requires the order code *and* the
   email/phone used at checkout for the same reason.

## Adding real photos

- **Homepage hero:** drop a file at `public/brand/hero.jpg` (or `.png`/`.webp`)
  — the homepage (`src/components/Hero.tsx`) picks it up automatically. No
  file yet, and it shows a placeholder instead of a broken image.
- **Product photos:** uploaded to the Railway bucket and served through our
  own `/api/media/...` proxy route (not directly from the bucket), so display
  doesn't depend on the bucket's public-access settings:

  ```bash
  node --env-file=.env.local scripts/add-product-image.mjs member-tee-vol-1 ~/Desktop/tee-front.jpg
  ```

  Run it once per photo, in the order they should appear on the product page.

## Not built yet

- Crypto payments (phase 2)
- Admin dashboard (product/order management, shipping, notify-me blasts) —
  right now `db/seed.sql` is the only way to add products
- Deploying the app itself to Railway (Postgres + bucket are already live)
# pastorthings
