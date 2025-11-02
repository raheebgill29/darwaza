'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-accent">Admin Dashboard</h1>
            <p className="mt-2 text-accent/80">Manage products, categories, and view orders.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin-dashboard/add-category"
            className="rounded-xl border border-brand-200 bg-brand-base px-4 py-6 hover:opacity-90"
          >
            <h2 className="text-xl font-semibold text-accent">Add Category</h2>
            <p className="text-accent/70">Define category name and properties.</p>
          </Link>

          <Link
            href="/admin-dashboard/add-product"
            className="rounded-xl border border-brand-200 bg-brand-base px-4 py-6 hover:opacity-90"
          >
            <h2 className="text-xl font-semibold text-accent">Add Product</h2>
            <p className="text-accent/70">Create new products assigned to categories.</p>
          </Link>

          <Link
            href="/admin-dashboard/orders"
            className="rounded-xl border border-brand-200 bg-brand-base px-4 py-6 hover:opacity-90"
          >
            <h2 className="text-xl font-semibold text-accent">Orders</h2>
            <p className="text-accent/70">Review placed orders.</p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}