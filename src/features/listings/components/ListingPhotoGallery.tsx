import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import PhotoLightbox from '../../../shared/components/PhotoLightbox'

const PREVIEW_COUNT = 3

export interface GalleryPhoto {
  id?: string
  url: string
}

interface ListingPhotoGalleryProps {
  photos: GalleryPhoto[]
  title: string
}

export default function ListingPhotoGallery({ photos, title }: ListingPhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openPreview = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (photos.length === 0) {
    return <EmptyPhotoPlaceholder />
  }

  const previewSlots = photos.slice(0, PREVIEW_COUNT)
  const hiddenCount = Math.max(0, photos.length - PREVIEW_COUNT)

  return (
    <>
      <div
        className={`grid gap-2 sm:gap-3 ${
          previewSlots.length === 1
            ? 'grid-cols-1'
            : previewSlots.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-3'
        }`}
      >
        {previewSlots.map((photo, index) => {
          const isLastSlot = index === PREVIEW_COUNT - 1
          const showMoreOverlay = hiddenCount > 0 && isLastSlot

          return (
            <button
              key={photo.id ?? `gallery-${index}`}
              type="button"
              onClick={() => openPreview(showMoreOverlay ? PREVIEW_COUNT : index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/90 transition hover:ring-[#f97316]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
              aria-label={
                showMoreOverlay
                  ? `View ${hiddenCount} more photos of ${title}`
                  : `Preview photo ${index + 1} of ${title}`
              }
            >
              <img
                src={photo.url}
                alt=""
                className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] ${
                  showMoreOverlay ? 'brightness-[0.55]' : ''
                }`}
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              {!showMoreOverlay && (
                <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-md bg-black/45 px-2 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                  Preview
                </span>
              )}
              {showMoreOverlay && (
                <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/35 text-white">
                  <span className="text-lg font-bold tracking-tight sm:text-xl">+{hiddenCount}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    photos
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      <PhotoLightbox
        photos={photos.map((photo, index) => ({
          url: photo.url,
          alt: `${title} — photo ${index + 1}`,
        }))}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}

function EmptyPhotoPlaceholder() {
  return (
    <div
      className="flex aspect-[21/9] max-h-[20rem] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 ring-1 ring-slate-200/80"
      aria-hidden
    >
      <ImageIcon className="h-12 w-12 text-slate-300" strokeWidth={1.25} />
    </div>
  )
}
