alter table products
  add column initial_stock integer not null default 0 check (initial_stock >= 0);
