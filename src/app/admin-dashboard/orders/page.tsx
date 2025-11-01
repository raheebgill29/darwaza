'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-accent">Orders</h1>
        <p className="mt-2 text-accent/80">This is a placeholder page for viewing orders.</p>
        <div className="mt-6 rounded-xl border border-brand-200 bg-brand-base p-4">
          <p className="text-accent/70">Orders list will appear here.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}