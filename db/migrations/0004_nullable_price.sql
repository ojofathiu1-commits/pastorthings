-- Coming-soon products may not have a price set yet.
alter table products alter column price_kobo drop not null;
