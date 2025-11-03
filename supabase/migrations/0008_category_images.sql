-- Add image support to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS image_alt text;