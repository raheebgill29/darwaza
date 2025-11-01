import { supabase } from '@/lib/supabaseClient'
import type { ImageUploadRow } from '@/components/admin/ProductImagesUpload'

// Upload product image files to Supabase Storage and return DB rows
export async function uploadProductImages(
  productId: string,
  rows: Array<{ file?: File | null; alt?: string }>
) {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_IMAGES_BUCKET ?? 'images'

  const uploads = rows
    .map((r, idx) => ({ file: r.file, alt: (r.alt ?? '').trim(), order_index: idx }))
    .filter((r) => r.file)

  const results: { image_url: string; alt: string | null; order_index: number }[] = []
  for (const u of uploads) {
    const file = u.file as File
    const path = `${productId}/${Date.now()}-${sanitizeFilename(file.name)}`
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type || 'image/*',
      upsert: false,
    })
    if (upErr) throw upErr
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    results.push({ image_url: data.publicUrl, alt: u.alt || null, order_index: u.order_index })
  }
  return results
}

function sanitizeFilename(name: string) {
  // Replace spaces and illegal chars, collapse repeats, trim dashes
  return name
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}