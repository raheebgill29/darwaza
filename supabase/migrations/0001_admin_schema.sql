-- Admin schema for categories, properties, products
-- Run this in Supabase SQL editor, then keep this file as source of truth.

-- Enable uuid generation
create extension if not exists pgcrypto;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Category properties (e.g., Size, Color)
create table if not exists public.category_properties (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, name)
);

create index if not exists category_properties_category_id_idx on public.category_properties(category_id);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  description text,
  stock int not null default 0 check (stock >= 0),
  price numeric(10,2) not null check (price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);

-- Product property values
create table if not exists public.product_property_values (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  property_id uuid not null references public.category_properties(id) on delete cascade,
  value text,
  created_at timestamptz not null default now(),
  unique (product_id, property_id)
);

create index if not exists product_property_values_product_id_idx on public.product_property_values(product_id);
create index if not exists product_property_values_property_id_idx on public.product_property_values(property_id);

-- Optional: seed example category and properties
-- insert into public.categories(name) values ('Dresses') on conflict do nothing;
-- with c as (select id from public.categories where name = 'Dresses')
-- insert into public.category_properties (category_id, name, order_index)
-- select c.id, p.name, p.order_index from c, (values ('Size',0),('Color',1)) as p(name, order_index)
-- on conflict do nothing;