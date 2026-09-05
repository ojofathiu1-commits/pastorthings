-- Some products (e.g. the chain) aren't held in stock -- the manufacturer
-- makes them to order once payment clears. These skip stock tracking and
-- availability display entirely.
alter table products add column made_to_order boolean not null default false;
