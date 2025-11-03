'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ProductImagesUpload, { ImageUploadRow } from './ProductImagesUpload'
import ProductSizesInput, { SizeRow } from './ProductSizesInput'
import { uploadProductImages } from '@/lib/uploadProductImages'

type Category = { id: string; name: string }
type CategoryProperty = { id: string; name: string }
type ExistingImage = { id: string; image_url: string; alt: string | null }

export default function EditProductModal({ open, productId, onClose, onSaved }: {
  open: boolean
  productId: string
  onClose: () => void
  onSaved: (updated: { id: string; name: string; price: number; description: string; category_id: string }) => void
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [properties, setProperties] = useState<CategoryProperty[]>([])
  const [propValues, setPropValues] = useState<Record<string, string>>({})
  const [name, setName] = useState(''), [description, setDescription] = useState('')
  const [stock, setStock] = useState(0), [price, setPrice] = useState(0)
  const [useSizes, setUseSizes] = useState(false), [sizes, setSizes] = useState<SizeRow[]>([])
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [imageUploads, setImageUploads] = useState<ImageUploadRow[]>([])

  const canSubmit = useMemo(() => {
    if (!categoryId || !name || price < 0) return false
    return useSizes ? sizes.length > 0 && sizes.every((s) => s.size.trim().length > 0 && s.stock >= 0) : stock >= 0
  }, [categoryId, name, price, stock, useSizes, sizes])

  useEffect(() => {
    if (!open || !productId) return
    ;(async () => {
      setLoading(true)
      setMessage(null)
      try {
        const { data: cats, error: catsErr } = await supabase.from('categories').select('id,name').order('name')
        if (catsErr) throw catsErr
        setCategories(cats ?? [])

        const { data: product, error: pErr } = await supabase
          .from('products')
          .select('id, category_id, name, description, stock, price')
          .eq('id', productId)
          .single()
        if (pErr) throw pErr
        setCategoryId(product.category_id)
        setName(product.name)
        setDescription(product.description ?? '')
        setPrice(Number(product.price) || 0)
        setStock(product.stock ?? 0)

        const { data: propsData, error: propsErr } = await supabase
          .from('category_properties')
          .select('id,name')
          .eq('category_id', product.category_id)
          .order('order_index')
        if (propsErr) throw propsErr
        setProperties(propsData ?? [])

        const { data: pvData, error: pvErr } = await supabase
          .from('product_property_values')
          .select('property_id,value')
          .eq('product_id', productId)
        if (pvErr) throw pvErr
        const pvMap: Record<string, string> = {}
        for (const p of propsData ?? []) {
          const found = (pvData ?? []).find((r) => r.property_id === p.id)
          pvMap[p.name] = (found?.value ?? '') || ''
        }
        setPropValues(pvMap)

        const { data: szData, error: szErr } = await supabase
          .from('product_sizes')
          .select('size,stock')
          .eq('product_id', productId)
          .order('size')
        if (szErr) throw szErr
        const szRows: SizeRow[] = (szData ?? []).map((r) => ({ size: r.size, stock: r.stock }))
        setSizes(szRows)
        setUseSizes(szRows.length > 0)

        const { data: imgData, error: imgErr } = await supabase
          .from('product_images')
          .select('id,image_url,alt,order_index')
          .eq('product_id', productId)
          .order('order_index')
        if (imgErr) throw imgErr
        setExistingImages((imgData ?? []).map((r) => ({ id: r.id, image_url: r.image_url, alt: r.alt ?? null })))
      } catch (err: any) {
        setMessage(err?.message || 'Failed to load product for editing.')
      } finally {
        setLoading(false)
      }
    })()
  }, [open, productId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!canSubmit) { setMessage('Please fill the required fields correctly.'); return }
    setLoading(true)
    try {
      const cleanSizes = useSizes
        ? Object.values(
            sizes.reduce((acc, { size, stock }) => {
              const s = (size ?? '').trim()
              if (!s) return acc
              const prev = acc[s]
              acc[s] = { size: s, stock: (prev?.stock ?? 0) + (Number.isFinite(stock) ? stock : 0) }
              return acc
            }, {} as Record<string, { size: string; stock: number }>)
          )
        : []
      const totalStock = useSizes ? cleanSizes.reduce((sum, r) => sum + (r.stock || 0), 0) : stock

      const { error: upErr } = await supabase
        .from('products')
        .update({ category_id: categoryId, name, description, stock: totalStock, price })
        .eq('id', productId)
      if (upErr) throw upErr

      if (properties.length) {
        const propRows = properties.map((p) => ({ product_id: productId, property_id: p.id, value: (propValues[p.name] ?? '').trim() || null }))
        const { error: pvErr } = await supabase.from('product_property_values').upsert(propRows)
        if (pvErr) throw pvErr
      }

      await supabase.from('product_sizes').delete().eq('product_id', productId)
      if (useSizes && cleanSizes.length) {
        const sizeRows = cleanSizes.map((r) => ({ product_id: productId, size: r.size, stock: r.stock }))
        const { error: sErr } = await supabase.from('product_sizes').insert(sizeRows)
        if (sErr) throw sErr
      }

      const uploadRows = await uploadProductImages(productId, imageUploads)
      if (uploadRows.length) {
        const { error: imgErr } = await supabase
          .from('product_images')
          .insert(uploadRows.map((r) => ({ ...r, product_id: productId })))
        if (imgErr) throw imgErr
      }

      setMessage('Product updated.')
      onSaved({ id: productId, name, price, description, category_id: categoryId })
      onClose()
    } catch (err: any) {
      setMessage(err?.message ? `Error: ${err.message}` : 'Failed to update product.')
    } finally {
      setLoading(false)
    }
  }

  async function removeImage(img: ExistingImage) {
    try {
      setLoading(true)
      const { error: delErr } = await supabase.from('product_images').delete().eq('id', img.id)
      if (delErr) throw delErr
      const match = img.image_url.match(/\/object\/public\/([^/]+)\/(.+)$/)
      if (match) {
        const bucket = match[1]
        const path = match[2]
        await supabase.storage.from(bucket).remove([path])
      }
      setExistingImages((prev) => prev.filter((e) => e.id !== img.id))
      setMessage('Image removed')
    } catch (err: any) {
      setMessage(err?.message || 'Failed to remove image.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 nice-scrollbar">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-xl border border-brand-200 bg-brand-base p-4 shadow-xl max-h-[85vh] overflow-y-auto nice-scrollbar">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-accent">Edit Product</h2>
          <button onClick={onClose} className="rounded-full bg-brand-base px-3 py-1 text-accent hover:opacity-90">Close</button>
        </div>

        {loading ? (
          <p className="text-accent">Loading…</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="text-accent">Category</label>
              <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent focus:outline-none">
                <option value="">Select a category</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>

            <div>
              <label htmlFor="name" className="text-accent">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none" required />
            </div>

            <div>
              <label htmlFor="description" className="text-accent">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none nice-scrollbar max-h-60 overflow-y-auto" rows={6} />
            </div>

            {!!properties.length && (
              <div>
                <label className="text-accent">Properties</label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {properties.map((p) => (
                    <div key={p.id} className="flex flex-col">
                      <span className="text-accent/80">{p.name}</span>
                      <input type="text" value={propValues[p.name] ?? ''} onChange={(e) => setPropValues((prev) => ({ ...prev, [p.name]: e.target.value }))} className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ProductSizesInput useSizes={useSizes} onToggle={() => setUseSizes((v) => !v)} sizes={sizes} onChangeSizes={setSizes} />

            <div className="grid gap-4 sm:grid-cols-2">
              {!useSizes && (
                <div>
                  <label htmlFor="stock" className="text-accent">Stock</label>
                  <input id="stock" type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none" />
                </div>
              )}
              <div>
                <label htmlFor="price" className="text-accent">Price</label>
                <input id="price" type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none" />
              </div>
            </div>

            {!!existingImages.length && (
              <div>
                <label className="text-accent">Current Images</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="rounded-xl border border-accent/20 p-2 bg-white">
                      <img src={img.image_url} alt={img.alt ?? 'Product'} className="h-24 w-full object-cover rounded" />
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-accent/70 truncate">{img.alt ?? '—'}</p>
                        <button type="button" onClick={() => removeImage(img)} className="text-xs text-red-600 hover:text-red-800">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-accent/60">New uploads will be added; existing images stay unchanged.</p>
              </div>
            )}

            <ProductImagesUpload rows={imageUploads} onChange={setImageUploads} />

            {message && <p className="text-sm text-accent">{message}</p>}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-full bg-gray-200 px-5 py-2 text-accent">Cancel</button>
              <button type="submit" disabled={!canSubmit || loading} className="rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90 disabled:opacity-60">{loading ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}