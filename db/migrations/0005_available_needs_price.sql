alter table products
  add constraint products_available_needs_price
  check (status <> 'available' or price_kobo is not null);
