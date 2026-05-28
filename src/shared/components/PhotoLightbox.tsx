import { Dialog, DialogPanel } from '@headlessui/react'
import { useCallback, useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'

export interface LightboxPhoto {
  url: string
  alt?: string
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

function PhotoLightboxContent({
  photos,
  initialIndex = 0,
  onClose,
}: Omit<PhotoLightboxProps, 'isOpen'>) {
  const [index, setIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(true)

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? photos.length - 1 : i - 1))
    setZoomed(true)
  }, [photos.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i >= photos.length - 1 ? 0 : i + 1))
    setZoomed(true)
  }, [photos.length])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && photos.length > 1) goPrev()
      if (event.key === 'ArrowRight' && photos.length > 1) goNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, goPrev, goNext, photos.length])

  const current = photos[index]

  return (
    <DialogPanel className="relative flex h-full w-full max-w-6xl flex-col">
      <div className="mb-3 flex items-center justify-between gap-4 text-white">
        <p className="text-sm font-medium text-white/80">
          {photos.length > 1 ? `${index + 1} / ${photos.length}` : 'Photo preview'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Close"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        {photos.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:-left-2"
            aria-label="Previous photo"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          className="flex max-h-full max-w-full items-center justify-center overflow-hidden"
          aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
        >
          <img
            src={current.url}
            alt={current.alt ?? ''}
            className={`max-h-[calc(100vh-8rem)] max-w-full rounded-lg object-contain shadow-2xl transition-transform duration-300 ease-out ${
              zoomed ? 'scale-100 cursor-zoom-out' : 'scale-[0.88] cursor-zoom-in'
            }`}
          />
        </button>

        {photos.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:-right-2"
            aria-label="Next photo"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </DialogPanel>
  )
}

export default function PhotoLightbox({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
}: PhotoLightboxProps) {
  if (photos.length === 0) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-8">
        {isOpen ? (
          <PhotoLightboxContent
            key={`${initialIndex}-${photos[0]?.url ?? 'empty'}`}
            photos={photos}
            initialIndex={initialIndex}
            onClose={onClose}
          />
        ) : null}
      </div>
    </Dialog>
  )
}
