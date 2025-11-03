'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import CategoryForm from './CategoryForm'

type Props = {
  open: boolean
  categoryId: string
  onClose: () => void
  onSaved?: (updated: { id: string; name: string }) => void
}

export default function EditCategoryModal({ open, categoryId, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false)
  const [initialCategory, setInitialCategory] = useState<{ id: string; name: string; image_url?: string | null; image_alt?: string | null } | null>(null)
  const [initialProperties, setInitialProperties] = useState<string[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!open || !categoryId) return
      setLoading(true)
      setErr(null)
      try {
        const { data: cat, error: catErr } = await supabase
          .from('categories')
          .select('id,name,image_url,image_alt')
          .eq('id', categoryId)
          .single()
        if (catErr) throw catErr

        const { data: props, error: propsErr } = await supabase
          .from('category_properties')
          .select('name,order_index')
          .eq('category_id', categoryId)
          .order('order_index')
        if (propsErr) throw propsErr

        setInitialCategory({ id: cat.id, name: cat.name, image_url: cat.image_url, image_alt: cat.image_alt })
        setInitialProperties((props ?? []).map((p: any) => p.name))
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load category for edit')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [open, categoryId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 nice-scrollbar">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-xl border border-brand-200 bg-brand-base p-4 shadow-xl max-h-[85vh] overflow-y-auto nice-scrollbar">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-accent">Edit Category</h2>
          <button onClick={onClose} className="rounded-full bg-brand-base px-3 py-1 text-accent hover:opacity-90">Close</button>
        </div>

        {loading ? (
          <p className="text-accent">Loading…</p>
        ) : err ? (
          <p className="text-red-600">{err}</p>
        ) : initialCategory ? (
          <CategoryForm
            mode="edit"
            initialCategory={initialCategory}
            initialProperties={initialProperties}
            onSaved={(id) => {
              onSaved?.({ id, name: initialCategory.name })
              onClose()
            }}
          />
        ) : (
          <p className="text-accent">No category data.</p>
        )}
      </div>
    </div>
  )
}