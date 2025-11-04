"use client"

import Link from "next/link"
import React from "react"

type ActionVariant = "neutral" | "primary" | "danger"

export interface DataTableColumn<T> {
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

export interface DataTableAction<T> {
  label: string
  onClick?: (row: T) => void
  href?: (row: T) => string
  variant?: ActionVariant
}

interface DataTableProps<T> {
  rows: T[]
  columns: DataTableColumn<T>[]
  actions?: DataTableAction<T>[]
  emptyMessage?: string
}

export default function DataTable<T>({ rows, columns, actions, emptyMessage = "No data found." }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-brand-200 bg-brand-base">
            {columns.map((col, i) => (
              <th key={i} className="p-3 text-left text-sm font-semibold text-accent">
                {col.header}
              </th>
            ))}
            {actions && actions.length > 0 ? (
              <th className="p-3 text-left text-sm font-semibold text-accent">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={(columns.length || 0) + ((actions?.length ?? 0) > 0 ? 1 : 0)} className="p-6 text-center text-accent/80">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, ri) => (
              <tr key={ri} className="border-b border-brand-200 hover:bg-brand-50">
                {columns.map((col, ci) => (
                  <td key={ci} className={`p-3 text-sm text-accent ${col.className ?? ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
                {actions && actions.length > 0 ? (
                  <td className="p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      {actions.map((action, ai) => {
                        const variant = action.variant ?? "neutral"
                        const base = "rounded-md border px-2 py-1 text-xs"
                        const styles =
                          variant === "primary"
                            ? "border-brand-200 bg-brand-base text-accent hover:bg-brand-50"
                            : variant === "danger"
                            ? "border-red-200 bg-red-100 text-red-700 hover:bg-red-200"
                            : "border-brand-200 text-accent hover:bg-brand-base"

                        const href = action.href ? action.href(row) : undefined
                        if (href) {
                          return (
                            <Link key={ai} href={href} className={`${base} ${styles}`}>
                              {action.label}
                            </Link>
                          )
                        }
                        return (
                          <button key={ai} type="button" onClick={() => action.onClick?.(row)} className={`${base} ${styles}`}>
                            {action.label}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}