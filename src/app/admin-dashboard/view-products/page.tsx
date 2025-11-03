'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  image_url: string
}

export default function ViewProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, image_url')
          .order('name')
        
        if (error) {
          throw error
        }
        
        setCategories(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <Link 
            href="/admin-dashboard" 
            className="text-accent hover:underline mb-4 inline-block"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-accent">View Products by Category</h1>
          <p className="mt-2 text-accent/80">Select a category to view its products</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/admin-dashboard/view-products/${category.id}`}
                className="rounded-xl border border-brand-200 bg-brand-base p-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={category.image_url || 'https://via.placeholder.com/300'} 
                    alt={category.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-semibold text-accent">{category.name}</h2>
                <p className="text-accent/70 mt-1">View products in this category</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}