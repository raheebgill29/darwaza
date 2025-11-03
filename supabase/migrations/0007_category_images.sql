-- Add image support to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Create RLS policy for read access
CREATE POLICY "Enable read access for all users" ON public.categories
FOR SELECT USING (true);

-- Comment on the new columns
COMMENT ON COLUMN public.categories.image_url IS 'URL to the category image';
COMMENT ON COLUMN public.categories.image_alt IS 'Alt text for the category image';