"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import DataTable, { DataTableColumn } from "@/components/admin/DataTable"
import EditCategoryModal from "@/components/admin/EditCategoryModal"

type Category = { id: string; name: string; image_url?: string | null; image_alt?: string | null }

export default function ViewCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id,name,image_url,image_alt")
          .order("name")
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

  const columns: DataTableColumn<Category>[] = [
    {
      header: "Image",
      cell: (c) => (
        <div className="w-14 h-14 relative">
          <img src={c.image_url || "https://via.placeholder.com/150"} alt={c.image_alt || c.name} className="w-full h-full object-cover rounded" />
        </div>
      ),
    },
    { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
    { header: "ID", cell: (c) => <span className="font-mono text-xs">{c.id.slice(0, 8)}...</span> },
  ]

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <Link href="/admin-dashboard" className="text-accent hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-accent">View Categories</h1>
          <p className="mt-2 text-accent/80">Browse and manage categories</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><p className="text-lg">Loading categories...</p></div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <DataTable
            rows={categories}
            columns={columns}
            actions={[
              { label: "Edit", onClick: (c) => { setSelectedId(c.id); setEditOpen(true); }, variant: "primary" },
              { label: "Delete", onClick: async (c) => {
                  const ok = typeof window !== "undefined" ? window.confirm("Delete this category? This cannot be undone.") : true
                  if (!ok) return
                  // Prevent deletion if category has products
                  const { count, error: countErr } = await supabase
                    .from("products")
                    .select("id", { count: "exact", head: true })
                    .eq("category_id", c.id)
                  if (countErr) return
                  if ((count ?? 0) > 0) {
                    alert("Cannot delete category with products.")
                    return
                  }
                  const { error: delErr } = await supabase.from("categories").delete().eq("id", c.id)
                  if (!delErr) setCategories((prev) => prev.filter((x) => x.id !== c.id))
                }, variant: "danger" },
            ]}
          />
        )}

        <EditCategoryModal
          open={editOpen}
          categoryId={selectedId || ''}
          onClose={() => setEditOpen(false)}
          onSaved={async (updated) => {
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
    </div>
  )
}