'use client'

import { useCallback, useRef } from 'react'

export type CategoryImageUpload = { file?: File | null; alt: string }

export default function CategoryImageUpload({
  image,
  onChange,
  previewUrl,
}: {
  image: CategoryImageUpload
  onChange: (image: CategoryImageUpload) => void
  previewUrl?: string | null
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const addFile = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    onChange({ file: files[0], alt: image.alt })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [image, onChange])

  const removeImage = useCallback(() => {
    onChange({ file: null, alt: '' })
  }, [onChange])

  const updateAlt = useCallback((alt: string) => {
    onChange({ ...image, alt })
  }, [image, onChange])

  const effectivePreview = image.file ? URL.createObjectURL(image.file) : (previewUrl || null)

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-base p-3">
      <div className="flex items-center justify-between">
        <span className="text-accent">Category Image</span>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => addFile(e.target.files)}
          />
          <button
            type="button"
            className="rounded-lg bg-brand-200 px-3 py-1 text-sm text-accent hover:bg-brand-300"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Image
          </button>
        </div>
      </div>

      {effectivePreview && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-brand-200 p-2">
          <div className="h-16 w-16 overflow-hidden rounded-md bg-brand-100">
            <img
              src={effectivePreview}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Alt text"
              value={image.alt}
              onChange={(e) => updateAlt(e.target.value)}
              className="w-full rounded-lg border border-brand-200 bg-brand-base px-2 py-1 text-sm text-accent"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="rounded-lg bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}