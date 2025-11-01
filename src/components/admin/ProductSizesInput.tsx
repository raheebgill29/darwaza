'use client'

import { useCallback } from 'react'

export type SizeRow = { size: string; stock: number }

export default function ProductSizesInput({
  useSizes,
  onToggle,
  sizes,
  onChangeSizes,
}: {
  useSizes: boolean
  onToggle: () => void
  sizes: SizeRow[]
  onChangeSizes: (rows: SizeRow[]) => void
}) {
  const addRow = useCallback(() => {
    onChangeSizes([...(sizes ?? []), { size: '', stock: 0 }])
  }, [sizes, onChangeSizes])

  const updateRow = useCallback(
    (idx: number, key: 'size' | 'stock', value: string | number) => {
      onChangeSizes(sizes.map((r, i) => (i === idx ? { ...r, [key]: value } : r)))
    },
    [sizes, onChangeSizes]
  )

  const removeRow = useCallback(
    (idx: number) => {
      onChangeSizes(sizes.filter((_, i) => i !== idx))
    },
    [sizes, onChangeSizes]
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-accent">Add size</label>
        <button
          type="button"
          onClick={onToggle}
          className={`rounded-full px-4 py-2 text-accent ${useSizes ? 'bg-accent/10 border border-accent/30' : 'bg-brand-base'} hover:opacity-90`}
        >
          {useSizes ? 'On' : 'Off'}
        </button>
      </div>

      {useSizes && (
        <div className="mt-3 rounded-xl border border-brand-200 bg-brand-base p-3">
          <div className="flex items-center justify-between">
            <span className="text-accent">Size options</span>
            <button
              type="button"
              onClick={addRow}
              className="rounded-full bg-brand-base px-3 py-1 text-accent hover:opacity-90"
            >
              Add Size Option
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {sizes.map((row, idx) => (
              <div key={idx} className="grid gap-2 sm:grid-cols-5 items-end">
                <div className="sm:col-span-3">
                  <label className="text-accent">Size</label>
                  <input
                    type="text"
                    value={row.size}
                    onChange={(e) => updateRow(idx, 'size', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
                    placeholder="e.g., S, M, L"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-accent">Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={row.stock}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      updateRow(idx, 'stock', isNaN(val) ? 0 : val)
                    }}
                    className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-5">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="rounded-full bg-brand-base px-3 py-2 text-accent hover:opacity-90"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-accent/70">When sizes are on, product-level stock is managed per size.</p>
        </div>
      )}
    </div>
  )
}