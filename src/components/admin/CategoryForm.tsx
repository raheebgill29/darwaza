"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import CategoryImageUpload from './CategoryImageUpload'
import { uploadProductImages } from '@/lib/uploadProductImages'
import type { CategoryImageUpload as CategoryImageType } from './CategoryImageUpload'

export default function CategoryForm() {
  const [name, setName] = useState('')
  const [properties, setProperties] = useState<string[]>([''])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [categoryImage, setCategoryImage] = useState<CategoryImageType>({ file: null, alt: '' })

  function addProperty() {
    setProperties((prev) => [...prev, ''])
  }

  function removeProperty(index: number) {
    setProperties((prev) => prev.filter((_, i) => i !== index))
  }

  function updateProperty(index: number, value: string) {
    setProperties((prev) => prev.map((p, i) => (i === index ? value : p)))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    const trimmedName = name.trim()
    const propNames = properties.map((p) => p.trim()).filter((p) => p.length > 0)
    // dedupe while preserving order
    const seen = new Set<string>()
    const uniquePropNames: string[] = []
    for (const p of propNames) {
      if (!seen.has(p)) {
        seen.add(p)
        uniquePropNames.push(p)
      }
    }
    if (!trimmedName) {
      setError('Category name is required.')
      return
    }
    setSaving(true)
    try {
      // Upload image if provided
      let imageUrl = null
      if (categoryImage.file) {
        const categoryId = `category-${Date.now()}`
        const images = await uploadProductImages(
          categoryId,
          [{ file: categoryImage.file, alt: categoryImage.alt || trimmedName }]
        )
        if (images && images.length > 0) {
          imageUrl = images[0].image_url
        }
      }
      
      // Try inserting a new category; if it exists, fetch its id
      let categoryId: string | null = null
      const { data: inserted, error: insertErr } = await supabase
        .from('categories')
        .insert({ 
          name: trimmedName,
          image_url: imageUrl,
          image_alt: categoryImage.alt || trimmedName
        })
        .select('id')
        .single()

      if (insertErr) {
        // If duplicate, fetch existing id and continue
        if ((insertErr as any).code === '23505' || /duplicate key|already exists/i.test(insertErr.message)) {
          const { data: existing, error: fetchErr } = await supabase
            .from('categories')
            .select('id')
            .eq('name', trimmedName)
            .single()
          if (fetchErr || !existing) {
            throw fetchErr ?? new Error('Failed to fetch existing category')
          }
          categoryId = existing.id
        } else {
          throw insertErr
        }
      } else {
        categoryId = inserted?.id ?? null
      }

      if (!categoryId) throw new Error('Missing category id after insert')

      if (uniquePropNames.length > 0) {
        const rows = uniquePropNames.map((prop, idx) => ({ category_id: categoryId!, name: prop, order_index: idx }))
        const { error: propsErr } = await supabase
          .from('category_properties')
          .upsert(rows, { onConflict: 'category_id,name', ignoreDuplicates: true })
        if (propsErr) throw propsErr
      }

      setMessage(`Category saved${uniquePropNames.length ? ` with ${uniquePropNames.length} propert${uniquePropNames.length === 1 ? 'y' : 'ies'}` : ''}.`)
      
      // Reset form after successful save
      setName('')
      setProperties([''])
      setCategoryImage({ file: null, alt: '' })
    } catch (err: any) {
      const msg = err?.message ?? 'Failed to save category. Ensure migration is applied.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="category-name" className="text-accent">Name</label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
          placeholder="e.g., Dresses"
          required
        />
      </div>

      <CategoryImageUpload image={categoryImage} onChange={setCategoryImage} />

      <div>
        <div className="flex items-center justify-between">
          <label className="text-accent">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="rounded-full bg-brand-base px-3 py-1 text-accent hover:opacity-90"
          >
            Add Property
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {properties.map((prop, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={prop}
                onChange={(e) => updateProperty(idx, e.target.value)}
                className="flex-1 rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
                placeholder="e.g., Size"
              />
              <button
                type="button"
                onClick={() => removeProperty(idx)}
                className="rounded-full bg-brand-base px-3 py-2 text-accent hover:opacity-90"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-accent">{message}</p>}

      <button type="submit" disabled={saving} className="rounded-full bg-brand-base px-5 py-2 text-accent hover:opacity-90 disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Category'}
      </button>
    </form>
  )
}