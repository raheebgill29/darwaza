-- Create a public storage bucket for product images
-- Run this in Supabase SQL editor (or migration runner)

select storage.create_bucket('product-images',
  public => true,
  file_size_limit => 5242880 -- 5 MB per file limit (adjust as needed)
);

-- If bucket already exists, ensure public access
update storage.buckets set public = true where name = 'product-images';