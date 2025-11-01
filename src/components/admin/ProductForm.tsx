'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ProductImagesUpload, { ImageUploadRow } from './ProductImagesUpload'
import ProductSizesInput, { SizeRow } from './ProductSizesInput'
import { uploadProductImages } from '@/lib/uploadProductImages'

type Category = { id: string; name: string }
type CategoryProperty = { id: string; name: string }
// SizeRow type imported from ProductSizesInput

export default function ProductForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [categoryId, setCategoryId] = useState<string>('')
  const [properties, setProperties] = useState<CategoryProperty[]>([])
  const [loadingProps, setLoadingProps] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)
  const [propValues, setPropValues] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Sizes toggle and rows
  const [useSizes, setUseSizes] = useState(false)
  const [sizes, setSizes] = useState<SizeRow[]>([{ size: '', stock: 0 }])

  // Images (files) rows
  const [imageUploads, setImageUploads] = useState<ImageUploadRow[]>([])

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true)
      setMessage(null)
      try {
        const { data, error } = await supabase.from('categories').select('id,name').order('name')
        if (error) throw error
        setCategories(data ?? [])
      } catch (err) {
        setMessage('Categories table unavailable. Run the migration to enable fetching.')
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    async function loadProps() {
      if (!categoryId) {
        setProperties([])
        return
      }
      setLoadingProps(true)
      setMessage(null)
      try {
        const { data, error } = await supabase
          .from('category_properties')
          .select('id,name')
          .eq('category_id', categoryId)
          .order('name')
        if (error) throw error
        setProperties(data ?? [])
        // initialize empty values for each property
        const initial: Record<string, string> = {}
        ;(data ?? []).forEach((p) => (initial[p.name] = ''))
        setPropValues(initial)
      } catch (err) {
        setMessage('Category properties unavailable. Create properties after running the migration.')
      } finally {
        setLoadingProps(false)
      }
    }
    loadProps()
  }, [categoryId])

  const canSubmit = useMemo(() => {
    if (!categoryId || !name || price < 0) return false
    if (useSizes) {
      return sizes.length > 0 && sizes.every((s) => s.size.trim().length > 0 && s.stock >= 0)
    }
    return stock >= 0
  }, [categoryId, name, price, stock, useSizes, sizes])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!canSubmit) {
      setMessage('Please fill the required fields correctly.')
      return
    }
    setSaving(true)
    try {
      // Prepare clean, deduplicated sizes if enabled
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

      const totalStock = useSizes
        ? cleanSizes.reduce((sum, r) => sum + (r.stock || 0), 0)
        : stock

      const { data: product, error: pErr } = await supabase
        .from('products')
        .insert({
          category_id: categoryId,
          name,
          description,
          stock: totalStock,
          price,
        })
        .select()
        .single()
      if (pErr) throw pErr

      // Insert property values (if any)
      if (properties.length) {
        const propRows = properties.map((p) => ({
          product_id: product.id,
          property_id: p.id,
          value: (propValues[p.name] ?? '').trim() || null,
        }))
        const { error: pvErr } = await supabase.from('product_property_values').insert(propRows)
        if (pvErr) {
          // Cleanup product to avoid partial state; cascades remove property values
          await supabase.from('products').delete().eq('id', product.id)
          throw pvErr
        }
      }

      // Insert per-size stock if enabled
      if (useSizes && cleanSizes.length) {
        const sizeRows = cleanSizes.map((r) => ({
          product_id: product.id,
          size: r.size,
          stock: r.stock,
        }))
        const { error: sErr } = await supabase.from('product_sizes').insert(sizeRows)
        if (sErr) {
          await supabase.from('products').delete().eq('id', product.id)
          throw sErr
        }
      }

      // Upload files to storage and insert product_images
      const uploadRows = await uploadProductImages(product.id, imageUploads)
      if (uploadRows.length) {
        const { error: imgErr } = await supabase.from('product_images').insert(
          uploadRows.map((r, idx) => ({ ...r, product_id: product.id, order_index: idx }))
        )
        if (imgErr) {
          await supabase.from('products').delete().eq('id', product.id)
          throw imgErr
        }
      }

      setMessage('Product saved successfully.')
      // Reset form
      setName('')
      setDescription('')
      setPrice(0)
      setStock(0)
      setUseSizes(false)
      setSizes([{ size: '', stock: 0 }])
      const initial: Record<string, string> = {}
      properties.forEach((p) => (initial[p.name] = ''))
      setPropValues(initial)
      setCategoryId('')
      setImageUploads([])
    } catch (err: any) {
      setMessage(err?.message ? `Error: ${err.message}` : 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="text-accent">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent focus:outline-none"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {loadingCategories && <p className="text-xs text-accent/70 mt-1">Loading categories…</p>}
      </div>

      <div>
        <label htmlFor="name" className="text-accent">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
          placeholder="e.g., Rose Midi Dress"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="text-accent">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
          rows={4}
          placeholder="Write a short description"
        />
      </div>

      {/* Sizes input */}
      <ProductSizesInput
        useSizes={useSizes}
        onToggle={() => setUseSizes((v) => !v)}
        sizes={sizes}
        onChangeSizes={setSizes}
      />

      {!!properties.length && (
        <div>
          <label className="text-accent">Properties</label>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {properties.map((p) => (
              <div key={p.id} className="flex flex-col">
                <span className="text-accent/80">{p.name}</span>
                <input
                  type="text"
                  value={propValues[p.name] ?? ''}
                  onChange={(e) => setPropValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
                  placeholder={`Enter ${p.name}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {!useSizes && (
          <div>
            <label htmlFor="stock" className="text-accent">Stock</label>
            <input
              id="stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
            />
          </div>
        )}
        <div>
          <label htmlFor="price" className="text-accent">Price</label>
          <input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Images uploader */}
      <ProductImagesUpload rows={imageUploads} onChange={setImageUploads} />

      {message && <p className="text-sm text-accent">{message}</p>}

      <button type="submit" disabled={!canSubmit || saving} className="rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90 disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Product'}
      </button>
    </form>
  )
}