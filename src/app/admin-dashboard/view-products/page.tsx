'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import DataTable, { DataTableColumn } from '@/components/admin/DataTable'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category_id: string
  product_images?: { image_url: string }[]
}
interface Category { id: string; name: string }

export default function ViewProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Load categories once
  useEffect(() => {
    (async () => {
      try {
        const { data: cats, error } = await supabase.from('categories').select('id,name').order('name')
        if (error) throw error
        setCategories(cats || [])
      } catch (err: any) {
        setError(err.message)
      }
    })()
  }, [])

  // Load products when filter changes
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('products')
          .select('id,name,price,description,category_id,product_images (image_url)')
          .order('name', { ascending: true })
        if (selectedCategory !== 'all') {
          query = query.eq('category_id', selectedCategory)
        }
        const { data: prods, error } = await query
        if (error) throw error
        setProducts(prods || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [selectedCategory])

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <Link 
            href="/admin-dashboard" 
            className="text-accent hover:underline mb-4 inline-block"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-accent">View Products</h1>
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="categoryFilter" className="text-sm text-accent/80">Filter by Category:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-brand-200 bg-white p-1 text-sm text-accent"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
          </div>
        ) : (
          <DataTable
            rows={products}
            columns={columns(categories)}
            actions={[
              {
                label: 'Edit',
                href: (p) => `/admin-dashboard/view-products/${p.category_id}`,
                variant: 'primary',
              },
              {
                label: 'Delete',
                onClick: async (p) => {
                  const ok = typeof window !== 'undefined' ? window.confirm('Delete this product?') : true
                  if (!ok) return
                  const { error: delErr } = await supabase.from('products').delete().eq('id', p.id)
                  if (!delErr) setProducts((prev) => prev.filter((x) => x.id !== p.id))
                },
                variant: 'danger',
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}

function columns(categories: Category[]): DataTableColumn<Product>[] {
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—'
  return [
    {
      header: 'Image',
      cell: (p) => (
        <div className="w-16 h-16 relative">
          <img src={p.product_images?.[0]?.image_url || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-full object-cover rounded" />
        </div>
      ),
    },
    { header: 'Name', cell: (p) => <span className="font-medium">{p.name}</span> },
    { header: 'Price', cell: (p) => <>Rs {p.price.toLocaleString('en-IN')}</> },
    { header: 'Description', cell: (p) => <span className="max-w-xs truncate inline-block">{p.description}</span>, className: 'max-w-xs' },
    { header: 'Category', cell: (p) => catName(p.category_id) },
  ]
}