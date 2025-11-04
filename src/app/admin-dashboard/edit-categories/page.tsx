'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import EditCategoryModal from '@/components/admin/EditCategoryModal'
import Link from 'next/link'

type Category = { id: string; name: string; image_url?: string | null; image_alt?: string | null }

export default function EditCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id,name,image_url,image_alt')
          .order('name')
        if (error) throw error
        setCategories(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const openEdit = (id: string) => {
    setSelectedId(id)
    setModalOpen(true)
  }

  async function deleteCategory(id: string) {
    const ok = typeof window !== 'undefined' ? window.confirm('Delete this category? This cannot be undone.') : true
    if (!ok) return
    setActionError(null)
    try {
      const { count, error: countErr } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', id)
      if (countErr) throw countErr
      if ((count ?? 0) > 0) {
        setActionError('Cannot delete category with products. Move or delete products first.')
        return
      }

      const { error: delErr } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (delErr) throw delErr

      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (e: any) {
      setActionError(e?.message ?? 'Failed to delete category.')
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <Link href="/admin-dashboard" className="text-accent hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-accent">Edit Categories</h1>
          <p className="mt-2 text-accent/80">View all categories and edit their details.</p>
        </div>

        {actionError && (
          <p className="text-red-600 mb-4">{actionError}</p>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading categories...</p>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-xl border border-brand-200 bg-brand-base p-4 hover:shadow-md transition-shadow">
                <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={cat.image_url || 'https://via.placeholder.com/300'}
                    alt={cat.image_alt || cat.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-semibold text-accent">{cat.name}</h2>
                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-full bg-brand-base px-3 py-1 text-accent hover:opacity-90"
                    onClick={() => openEdit(cat.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditCategoryModal
        open={modalOpen}
        categoryId={selectedId || ''}
        onClose={() => setModalOpen(false)}
        onSaved={async (updated) => {
          // Refresh a single updated category
          try {
            const { data, error } = await supabase
              .from('categories')
              .select('id,name,image_url,image_alt')
              .eq('id', updated.id)
              .single()
            if (!error && data) {
              setCategories((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...data } : c)))
            }
          } catch {}
        }}
      />
    </div>
  )
}