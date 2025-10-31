'use client'

import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage products and view orders.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin-dashboard/add-product"
          className="rounded border px-4 py-6 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Add Product</h2>
          <p className="text-gray-600">Create new products (placeholder).</p>
        </Link>

        <Link
          href="/admin-dashboard/orders"
          className="rounded border px-4 py-6 hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-gray-600">Review placed orders (placeholder).</p>
        </Link>
      </div>
    </main>
  )
}