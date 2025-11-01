'use client'

import { useCallback } from 'react'

export type ImageRow = { url: string; alt: string }

export default function ProductImagesInput({
  images,
  onChange,
}: {
  images: ImageRow[]
  onChange: (rows: ImageRow[]) => void
}) {
  const addRow = useCallback(() => {
    onChange([...(images ?? []), { url: '', alt: '' }])
  }, [images, onChange])

  const updateRow = useCallback(
    (idx: number, key: 'url' | 'alt', value: string) => {
      onChange(images.map((r, i) => (i === idx ? { ...r, [key]: value } : r)))
    },
    [images, onChange]
  )

  const removeRow = useCallback(
    (idx: number) => {
      onChange(images.filter((_, i) => i !== idx))
    },
    [images, onChange]
  )

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-base p-3">
      <div className="flex items-center justify-between">
        <span className="text-accent">Images</span>
        <button
          type="button"
          onClick={addRow}
          className="rounded-full bg-brand-base px-3 py-1 text-accent hover:opacity-90"
        >
          Add Image
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {images.map((row, idx) => (
          <div key={idx} className="grid gap-2 sm:grid-cols-5 items-end">
            <div className="sm:col-span-3">
              <label className="text-accent">Image URL</label>
              <input
                type="url"
                value={row.url}
                onChange={(e) => updateRow(idx, 'url', e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-accent">Alt text</label>
              <input
                type="text"
                value={row.alt}
                onChange={(e) => updateRow(idx, 'alt', e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
                placeholder="e.g., Rose midi dress front"
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
      <p className="mt-2 text-xs text-accent/70">Paste as many image URLs as you want. Order is preserved.</p>
    </div>
  )
}