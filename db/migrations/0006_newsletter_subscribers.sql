-- General mailing list (early access / drop announcements) -- distinct from
-- the per-product "notify me" signups in `subscribers`, which are tied to a
-- specific coming-soon item.
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create unique index newsletter_subscribers_unsubscribe_token_idx on newsletter_subscribers (unsubscribe_token);
