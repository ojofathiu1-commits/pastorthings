-- order_code is sequential and guessable; confirmation_token is the opaque
-- key used to access the post-checkout confirmation page so orders can't be
-- enumerated by walking ILLM-0001, ILLM-0002, ...
alter table orders
  add column confirmation_token uuid not null default gen_random_uuid();

create unique index orders_confirmation_token_idx on orders (confirmation_token);
