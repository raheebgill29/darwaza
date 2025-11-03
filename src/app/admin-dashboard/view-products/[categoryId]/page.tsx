'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { use } from 'react'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category_id: string
  product_images?: { image_url: string }[]
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

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
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
                      <Link 
                        href={`/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        target="_blank"
                      >
                        View
                      </Link>
                      {/* Add edit functionality in the future */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}