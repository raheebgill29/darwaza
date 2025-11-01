'use client'

import { useCallback, useMemo, useRef } from 'react'

export type ImageUploadRow = { file?: File | null; alt: string }

export default function ProductImagesUpload({
  rows,
  onChange,
}: {
  rows: ImageUploadRow[]
  onChange: (rows: ImageUploadRow[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const addFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const toAdd: ImageUploadRow[] = []
    for (let i = 0; i < files.length; i++) {
      toAdd.push({ file: files[i], alt: '' })
    }
    onChange([...(rows ?? []), ...toAdd])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [rows, onChange])

  const removeRow = useCallback((idx: number) => {
    onChange(rows.filter((_, i) => i !== idx))
  }, [rows, onChange])

  const updateAlt = useCallback((idx: number, alt: string) => {
    onChange(rows.map((r, i) => (i === idx ? { ...r, alt } : r)))
  }, [rows, onChange])

  const hasFiles = useMemo(() => rows.some((r) => !!r.file), [rows])

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-base p-3">
      <div className="flex items-center justify-between">
        <span className="text-accent">Images (Files)</span>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-brand-base px-3 py-1 text-accent hover:opacity-90"
          >
            Add Files
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-2">
        {rows.map((row, idx) => (
          <div key={idx} className="grid gap-2 sm:grid-cols-5 items-end">
            <div className="sm:col-span-3">
              <label className="text-accent">Preview</label>
              <div className="mt-1 flex items-center gap-3 rounded-xl border border-accent/30 bg-brand-base p-2">
                {row.file ? (
                  <img
                    src={URL.createObjectURL(row.file)}
                    alt={row.alt || 'Preview'}
                    className="h-16 w-16 rounded object-cover border border-accent/20"
                  />
                ) : (
                  <div className="h-16 w-16 rounded bg-accent/10" />
                )}
                <div className="flex-1">
                  <p className="text-xs text-accent/70 truncate">{row.file?.name ?? 'No file selected'}</p>
                  <p className="text-xs text-accent/50">{row.file ? `${Math.round((row.file.size/1024)*10)/10} KB` : ''}</p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-accent">Alt text</label>
              <input
                type="text"
                value={row.alt}
                onChange={(e) => updateAlt(idx, e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/30 bg-brand-base px-3 py-2 text-accent placeholder:text-accent/50 focus:outline-none"
                placeholder="e.g., Front view"
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

      {!hasFiles && (
        <p className="mt-2 text-xs text-accent/70">Add one or more image files. Order is preserved.</p>
      )}
    </div>
  )
}