'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import MenuTable from '@/components/admin/MenuTable'
import { useSearchParams } from 'next/navigation'

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as 'products' | 'category') || 'products'
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div>
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
        <div className="mt-8">
          <div className="flex-1">
            {tab === 'products' ? (
              <MenuTable
                title="Products"
                description="Choose an action to manage products."
                rows={[
                  { label: 'Add Product', href: '/admin-dashboard/add-product', description: 'Create a new product' },
                  { label: 'View Products', href: '/admin-dashboard/view-products', description: 'Browse by category' },
                ]}
              />
            ) : (
              <MenuTable
                title="Category"
                description="Choose an action to manage categories."
                rows={[
                  { label: 'Add Category', href: '/admin-dashboard/add-category', description: 'Define category and properties' },
                  { label: 'View Categories', href: '/admin-dashboard/view-categories', description: 'Browse, edit and delete' },
                ]}
              />
            )}
          </div>
        </div>
    </div>
  )
}