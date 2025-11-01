-- Create table to store per-size stock for products
-- Apply in Supabase SQL editor or via migration runner

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, size)
);

create index if not exists product_sizes_product_id_idx on public.product_sizes(product_id);

-- Optional: keep product stock aligned with sum of sizes
-- update public.products p
-- set stock = s.total_stock
-- from (
--   select product_id, coalesce(sum(stock), 0) as total_stock
--   from public.product_sizes
--   group by product_id
-- ) s
-- where p.id = s.product_id;