'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Only highlight on root dashboard. Subpages can omit active highlight.
  const active: 'products' | 'category' | null = pathname === '/admin-dashboard' ? null : null;

  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full p-0 flex items-stretch">
        <AdminSidebar active={active} onSelect={() => {}} />
        <div className="flex-1 px-4">
          {children}
        </div>
      </main>
      <Footer noMargin />
    </div>
  )
}