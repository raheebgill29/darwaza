'use client'

import ProductForm from '@/components/admin/ProductForm'

export default function AdminAddProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-accent">Add Product</h1>
      <p className="mt-2 text-accent/80">Select a category, then fill product details.</p>
      <div className="mt-6 rounded-xl border border-brand-200 bg-brand-base p-4">
        <ProductForm />
      </div>
    </div>
  )
}