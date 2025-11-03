'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { use } from 'react'
import EditProductModal from '@/components/admin/EditProductModal'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category_id: string
  product_images?: { image_url: string }[]
  featured?: boolean
  new_arrival?: boolean
  top_rated?: boolean
}

interface Category {
  id: string
  name: string
}

export default function CategoryProductsPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ name: string; price: string; description: string }>({ name: '', price: '', description: '' })
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editModalProductId, setEditModalProductId] = useState<string | null>(null)
  
  // Properly unwrap the params Promise using React.use()
  const { categoryId } = use(params)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        console.log('Fetching data for category ID:', categoryId)
        
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('id', categoryId)
          .single()
        
        console.log('Category data response:', { categoryData, categoryError })
        
        if (categoryError) throw categoryError
        setCategory(categoryData)
        
        // Fetch products for this category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id, 
            name, 
            price, 
            description, 
            category_id,
            featured,
            new_arrival,
            top_rated,
            product_images (image_url)
          `)
          .eq('category_id', categoryId)
          .order('name', { ascending: true })
        
        console.log('Products data response:', { productsData, productsError })
        
        if (productsError) throw productsError
        setProducts(productsData || [])
        
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchData()
    } else {
      console.error('No categoryId provided')
      setError('No category ID provided')
    }
  }, [categoryId]) // Only depend on the extracted categoryId

  async function handleToggle(id: string, field: 'featured' | 'new_arrival' | 'top_rated', value: boolean) {
    try {
      const { error: upErr } = await supabase
        .from('products')
        .update({ [field]: value })
        .eq('id', id)
      if (upErr) throw upErr
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
    } catch (err: any) {
      setError(err.message)
    }
  }

  function startEdit(p: Product) {
    setEditModalProductId(p.id)
    setEditModalOpen(true)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id: string) {
    try {
      const priceNum = parseFloat(editForm.price)
      if (Number.isNaN(priceNum)) throw new Error('Invalid price')
      const { error: upErr } = await supabase
        .from('products')
        .update({ name: editForm.name.trim(), price: priceNum, description: editForm.description.trim() })
        .eq('id', id)
      if (upErr) throw upErr
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, name: editForm.name.trim(), price: priceNum, description: editForm.description.trim() } : p)))
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function deleteProduct(id: string) {
    const ok = typeof window !== 'undefined' ? window.confirm('Delete this product? This cannot be undone.') : true
    if (!ok) return
    try {
      const { error: delErr } = await supabase.from('products').delete().eq('id', id)
      if (delErr) throw delErr
      setProducts((prev) => prev.filter((p) => p.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <Link 
            href="/admin-dashboard/view-products" 
            className="text-accent hover:underline mb-4 inline-block"
          >
            &larr; Back to Categories
          </Link>
          <h1 className="text-3xl font-semibold text-accent">
            {loading ? 'Loading...' : category?.name || 'Category'} Products
          </h1>
          <p className="mt-2 text-accent/80">
            Viewing all products in this category
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <>
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 relative">
                          <img 
                            src={product.product_images?.[0]?.image_url || 'https://via.placeholder.com/150'} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Rs {product.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                        >
                          {expandedId === product.id ? 'Hide' : 'View'}
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 mr-4"
                          onClick={() => startEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedId === product.id && (
                      <tr>
                        <td colSpan={5} className="bg-brand-base/50 px-6 py-4">
                          <div className="flex flex-wrap items-center gap-6">
                            <label className="flex items-center gap-2 text-sm text-accent">
                              <input
                                type="checkbox"
                                checked={!!product.featured}
                                onChange={(e) => handleToggle(product.id, 'featured', e.target.checked)}
                              />
                              Featured
                            </label>
                            <label className="flex items-center gap-2 text-sm text-accent">
                              <input
                                type="checkbox"
                                checked={!!product.new_arrival}
                                onChange={(e) => handleToggle(product.id, 'new_arrival', e.target.checked)}
                              />
                              New Arrival
                            </label>
                            <label className="flex items-center gap-2 text-sm text-accent">
                              <input
                                type="checkbox"
                                checked={!!product.top_rated}
                                onChange={(e) => handleToggle(product.id, 'top_rated', e.target.checked)}
                              />
                              Top Rated
                            </label>

                            {editingId === product.id ? (
                              <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                  className="rounded border border-brand-200 p-2"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                                  placeholder="Name"
                                />
                                <input
                                  className="rounded border border-brand-200 p-2"
                                  value={editForm.price}
                                  onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                                  placeholder="Price"
                                />
                                <input
                                  className="rounded border border-brand-200 p-2"
                                  value={editForm.description}
                                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                  placeholder="Description"
                                />
                                <div className="md:col-span-3 flex gap-3">
                                  <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => saveEdit(product.id)}>Save</button>
                                  <button className="px-4 py-2 bg-gray-300 text-accent rounded" onClick={cancelEdit}>Cancel</button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            <EditProductModal
              open={editModalOpen}
              productId={editModalProductId || ''}
              onClose={() => { setEditModalOpen(false); setEditModalProductId(null) }}
              onSaved={async (updated) => {
                try {
                  const { data, error } = await supabase
                    .from('products')
                    .select('id,name,price,description,category_id,featured,new_arrival,top_rated,product_images (image_url)')
                    .eq('id', updated.id)
                    .single()
                  if (!error && data) {
                    setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...data } : p)))
                  } else {
                    setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))
                  }
                } catch {
                  setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))
                } finally {
                  setEditModalOpen(false)
                  setEditModalProductId(null)
                }
              }}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}