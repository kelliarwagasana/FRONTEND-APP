import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Listing } from '../types'
import SavedBadge from './SavedBadge'

interface ListingCardProps {
  listing: Listing
}

function formatAvailableFrom(iso?: string) {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function ListingCard({ listing }: ListingCardProps) {
  const coverPhoto = listing.photos[0]
  const guestLabel = `${listing.guest} guest${listing.guest > 1 ? 's' : ''}`
  const fromLabel = formatAvailableFrom(listing.availableFrom)
  const hiddenBeyondPreview = Math.max(0, listing.photos.length - 3)

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-100 bg-white font-listing shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100">
        {coverPhoto ? (
          <Link
            to={`/listings/${listing.id}`}
            className="block h-full w-full"
            aria-label={`View ${listing.title}`}
          >
            <img
              src={coverPhoto.url}
              alt={listing.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        ) : (
          <Link to={`/listings/${listing.id}`} className="block h-full bg-slate-200" aria-label={listing.title} />
        )}

        <span className="absolute left-3 top-3 z-[1] rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-800 shadow-sm backdrop-blur-sm">
          {listing.type}
        </span>

        {hiddenBeyondPreview > 0 && (
          <span className="absolute bottom-12 left-3 z-[1] rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            +{hiddenBeyondPreview} photos
          </span>
        )}

        <SavedBadge listingId={listing.id} className="absolute right-3 top-3 z-[1]" />

        {typeof listing.isAvailable === 'boolean' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 to-transparent pt-10 pb-2.5 pr-3 sm:pb-3">
            <div className="pointer-events-auto flex justify-end">
              {listing.isAvailable ? (
                <Link
                  to={`/listings/${listing.id}/book`}
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold tracking-wide text-[#c2410c] shadow-md ring-1 ring-black/5 transition hover:bg-[#fff7ed] sm:px-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  Available
                </Link>
              ) : (
                <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-900/95 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-white shadow-md ring-1 ring-white/10 sm:px-4">
                  Booked
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 p-3.5">
        <Link to={`/listings/${listing.id}`} className="block min-h-[3.25rem]">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">{listing.title}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">{listing.location}</p>
          {fromLabel && <p className="mt-0.5 text-[11px] font-medium text-slate-400">From {fromLabel}</p>}
        </Link>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
          <p className="text-xs text-slate-500">{guestLabel}</p>
          <p className="text-sm font-semibold text-slate-900">
            ${listing.pricePerNight}
            <span className="font-normal text-slate-500"> /night</span>
          </p>
        </div>
      </div>
    </article>
  )
}

export default memo(ListingCard)
