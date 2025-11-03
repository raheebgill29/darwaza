'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CategoryForm from '@/components/admin/CategoryForm'

export default function AdminAddCategoryPage() {
  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-accent">Add Category</h1>
        <p className="mt-2 text-accent/80">Define a category and add one or more properties.</p>
        <div className="mt-6 rounded-xl border border-brand-200 bg-brand-base p-4">
          <CategoryForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}