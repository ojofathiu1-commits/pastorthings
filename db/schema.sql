-- ILL MEMBER store schema
-- Anonymous storefront: no fan accounts. Contact info is only collected at
-- checkout and on coming-soon "notify me" signups.

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_kobo integer check (price_kobo >= 0), -- null while a coming-soon product has no price yet
  status text not null default 'coming_soon'
    check (status in ('available', 'coming_soon', 'sold_out')),
  stock_count integer not null default 0 check (stock_count >= 0),
  initial_stock integer not null default 0 check (initial_stock >= 0),
  stock_reserved integer not null default 0 check (stock_reserved >= 0),
  sort_order integer not null default 0,
  -- made-to-order items (e.g. the chain) skip stock tracking entirely --
  -- the manufacturer produces them after payment clears, so there's no
  -- fixed inventory count to check or display.
  made_to_order boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_available_needs_price check (status <> 'available' or price_kobo is not null)
);

create index products_status_idx on products (status);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_images_product_id_idx on product_images (product_id);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigserial not null,
  order_code text generated always as ('ILLM-' || lpad(order_number::text, 4, '0')) stored,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  delivery_address text not null,
  payment_method text not null check (payment_method in ('naira', 'crypto')),
  payment_provider text,
  payment_reference text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  status text not null default 'placed'
    check (status in ('placed', 'payment_confirmed', 'preparing', 'packed', 'shipped', 'delivered', 'cancelled')),
  courier_name text,
  tracking_number text,
  subtotal_kobo integer not null,
  total_kobo integer not null,
  -- order_code is sequential/guessable; this is the opaque key for the
  -- post-checkout confirmation page so orders can't be enumerated.
  confirmation_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_contact_required check (customer_email is not null or customer_phone is not null)
);

create unique index orders_order_code_idx on orders (order_code);
create unique index orders_confirmation_token_idx on orders (confirmation_token);
create index orders_status_idx on orders (status);
create index orders_payment_status_idx on orders (payment_status);
create index orders_customer_email_idx on orders (customer_email);
create index orders_customer_phone_idx on orders (customer_phone);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price_kobo integer not null check (unit_price_kobo >= 0),
  quantity integer not null check (quantity > 0),
  subtotal_kobo integer not null check (subtotal_kobo >= 0)
);

create index order_items_order_id_idx on order_items (order_id);

-- Fan-facing timeline + internal audit trail
create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create index order_status_history_order_id_idx on order_status_history (order_id);

-- ---------------------------------------------------------------------------
-- stock reservations (soft-hold during checkout, released if unpaid)
-- ---------------------------------------------------------------------------
create table stock_reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  expires_at timestamptz not null,
  released boolean not null default false,
  created_at timestamptz not null default now()
);

create index stock_reservations_product_id_idx on stock_reservations (product_id) where not released;
create index stock_reservations_expires_at_idx on stock_reservations (expires_at) where not released;

-- ---------------------------------------------------------------------------
-- coming-soon notify-me signups (per product, no account)
-- ---------------------------------------------------------------------------
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  email text,
  whatsapp_number text,
  notified_at timestamptz,
  created_at timestamptz not null default now(),
  constraint subscribers_contact_required check (email is not null or whatsapp_number is not null)
);

create index subscribers_product_id_idx on subscribers (product_id);

-- ---------------------------------------------------------------------------
-- general mailing list (early access / drop announcements) -- distinct from
-- the per-product "notify me" signups above, which are tied to a specific
-- coming-soon item.
-- ---------------------------------------------------------------------------
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create unique index newsletter_subscribers_unsubscribe_token_idx on newsletter_subscribers (unsubscribe_token);

-- ---------------------------------------------------------------------------
-- admin (the artist, password-protected)
-- ---------------------------------------------------------------------------
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);
