'use client'

import Link from 'next/link'

interface MenuRow {
  label: string
  href: string
  description?: string
}

interface MenuTableProps {
  title: string
  description?: string
  rows: MenuRow[]
}

export default function MenuTable({ title, description, rows }: MenuTableProps) {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-accent">{title}</h1>
        {description && (
          <p className="mt-2 text-accent/80">{description}</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-brand-200 bg-brand-base">
              <th className="p-3 text-left text-sm font-semibold text-accent">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-accent">Description</th>
              <th className="p-3 text-left text-sm font-semibold text-accent">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.href} className="border-b border-brand-200 hover:bg-brand-50">
                <td className="p-3 text-sm text-accent">{row.label}</td>
                <td className="p-3 text-sm text-accent/80">{row.description || '-'}</td>
                <td className="p-3 text-sm">
                  <Link
                    href={row.href}
                    className="rounded-md border border-brand-200 px-3 py-1 text-xs text-accent hover:bg-brand-base"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}