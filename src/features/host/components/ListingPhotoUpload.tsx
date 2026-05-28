import { useRef, useState, type ChangeEvent } from 'react'
import { FiImage, FiUpload, FiX } from 'react-icons/fi'

export interface ListingPhotoItem {
  id: string
  file: File
  url: string
  name: string
}

interface ListingPhotoUploadProps {
  photos: ListingPhotoItem[]
  onChange: (photos: ListingPhotoItem[]) => void
  error?: string
}

const MAX_PHOTOS = 12
const MAX_SIZE_MB = 5

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default function ListingPhotoUpload({ photos, onChange, error }: ListingPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState('')

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''

    if (files.length === 0) return

    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) {
      setLocalError(`You can upload up to ${MAX_PHOTOS} photos.`)
      return
    }

    const toAdd = files.slice(0, remaining)
    const invalid = toAdd.find((f) => !f.type.startsWith('image/') || f.size > MAX_SIZE_MB * 1024 * 1024)

    if (invalid) {
      setLocalError(`Use images only (max ${MAX_SIZE_MB}MB per file).`)
      return
    }

    setLocalError('')

    const items = await Promise.all(
      toAdd.map(async (file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        url: await readFileAsDataUrl(file),
        name: file.name,
      })),
    )

    onChange([...photos, ...items])
  }

  const removePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id))
    setLocalError('')
  }

  const displayError = error ?? localError

  return (
    <div>
      <span className="text-sm font-semibold text-black">Upload photos</span>
      <p className="mt-1 text-xs text-black/55">
        Add at least one photo. The first image is used as the cover. Up to {MAX_PHOTOS} images, {MAX_SIZE_MB}MB
        each.
      </p>

      <div className="mt-3 rounded-2xl border border-dashed border-[#eadfdb] bg-[#fff7ed]/40 p-4">
        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-[#eadfdb] bg-white px-5 py-10 text-center transition hover:border-[#f97316] hover:bg-[#fff7ed] ${
            photos.length >= MAX_PHOTOS ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7ed] text-xl text-[#f97316]">
            <FiUpload aria-hidden />
          </span>
          <span className="mt-3 text-sm font-semibold text-black">Click to upload photos</span>
          <span className="mt-1 max-w-xs text-xs text-black/50">
            JPG, PNG, or WEBP — select multiple files at once
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            multiple
            className="sr-only"
            onChange={handleUpload}
            disabled={photos.length >= MAX_PHOTOS}
          />
        </label>

        {photos.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-xl border border-[#eadfdb] bg-white"
              >
                <img src={photo.url} alt={photo.name} className="h-36 w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-md bg-[#f97316] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Cover
                  </span>
                )}
                <div className="flex items-center justify-between gap-2 border-t border-[#eadfdb] p-2.5">
                  <p className="truncate text-xs font-medium text-black/70">{photo.name}</p>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#eadfdb] text-black/60 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${photo.name}`}
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#eadfdb] bg-white px-4 py-3 text-sm text-black/50">
            <FiImage className="shrink-0 text-[#f97316]" aria-hidden />
            No photos yet — upload images to showcase your listing.
          </div>
        )}
      </div>

      {displayError && <p className="mt-2 text-xs font-medium text-red-600">{displayError}</p>}
    </div>
  )
}
