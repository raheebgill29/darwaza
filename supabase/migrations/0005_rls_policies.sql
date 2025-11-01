-- Enable RLS and add policies for admin/product tables and storage bucket
-- Apply this in the Supabase SQL editor or your migration runner.

-- Products
alter table public.products enable row level security;
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select to public using (true);
drop policy if exists "public insert products" on public.products;
create policy "public insert products" on public.products
  for insert to public with check (true);
drop policy if exists "public delete products" on public.products;
create policy "public delete products" on public.products
  for delete to public using (true);

-- Product sizes
alter table public.product_sizes enable row level security;
drop policy if exists "public read product_sizes" on public.product_sizes;
create policy "public read product_sizes" on public.product_sizes
  for select to public using (true);
drop policy if exists "public insert product_sizes" on public.product_sizes;
create policy "public insert product_sizes" on public.product_sizes
  for insert to public with check (true);
drop policy if exists "public delete product_sizes" on public.product_sizes;
create policy "public delete product_sizes" on public.product_sizes
  for delete to public using (true);

-- Product property values
alter table public.product_property_values enable row level security;
drop policy if exists "public read product_property_values" on public.product_property_values;
create policy "public read product_property_values" on public.product_property_values
  for select to public using (true);
drop policy if exists "public insert product_property_values" on public.product_property_values;
create policy "public insert product_property_values" on public.product_property_values
  for insert to public with check (true);
drop policy if exists "public delete product_property_values" on public.product_property_values;
create policy "public delete product_property_values" on public.product_property_values
  for delete to public using (true);

-- Product images
alter table public.product_images enable row level security;
drop policy if exists "public read product_images" on public.product_images;
create policy "public read product_images" on public.product_images
  for select to public using (true);
drop policy if exists "public insert product_images" on public.product_images;
create policy "public insert product_images" on public.product_images
  for insert to public with check (true);
drop policy if exists "public delete product_images" on public.product_images;
create policy "public delete product_images" on public.product_images
  for delete to public using (true);

-- Storage policies for bucket 'images'
-- Allow public read and authenticated uploads to the 'images' bucket.
alter table storage.objects enable row level security;
drop policy if exists "public read images bucket" on storage.objects;
create policy "public read images bucket" on storage.objects
  for select to public using (
    bucket_id = 'images'
  );
drop policy if exists "public upload images bucket" on storage.objects;
create policy "public upload images bucket" on storage.objects
  for insert to public with check (
    bucket_id = 'images'
  );
-- Optional (uncomment if you want authenticated users to delete images)
-- create policy if not exists "authenticated delete images bucket" on storage.objects
--   for delete to authenticated using (
--     bucket_id = (select id from storage.buckets where name = 'images')
--   );