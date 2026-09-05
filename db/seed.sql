insert into products (slug, name, description, price_kobo, status, stock_count, initial_stock, made_to_order, sort_order)
values
  (
    'ill-chain',
    'ILL Chain',
    'A signature piece from ILL MEMBER''s first drop.',
    20000000,
    'available',
    0,
    0,
    true,
    1
  ),
  (
    -- placeholder demo item -- replace or remove once there's a real coming-soon drop to announce
    'vol-2-hoodie',
    'Vol. 2 Hoodie',
    'Next drop. Details soon.',
    null,
    'coming_soon',
    0,
    0,
    false,
    2
  )
on conflict (slug) do nothing;
