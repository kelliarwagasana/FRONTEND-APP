import ListingCard from './ListingCard'
import { useAuth } from '../../auth/hooks/useAuth'
import { useListings } from '../hooks/useListings'
import { useSaved } from '../hooks/useSaved'

export default function SavedListings() {
  const { user: currentUser } = useAuth()
  const { data: listings = [], isPending: listingsLoading } = useListings()
  const { data: savedPayload, isPending: savedLoading } = useSaved()

  const savedIds = new Set(savedPayload?.listingIds ?? [])
  const savedListings = listings.filter((listing) => savedIds.has(listing.id))

  if (!currentUser) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Login to view saved stays</h1>
        <a
          href="#/login"
          className="mt-6 inline-flex rounded-lg bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
        >
          Login
        </a>
      </div>
    )
  }

  if (currentUser.role !== 'GUEST') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Saved listings are for guest accounts</h1>
        <a
          href="#/dashboard"
          className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Open dashboard
        </a>
      </div>
    )
  }

  if (listingsLoading || savedLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-600">Loading saved stays…</p>
      </div>
    )
  }

  if (savedListings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">No saved stays yet</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Save listings while browsing, then come back here when you are ready to book.
        </p>
        <a
          href="#/listings"
          className="mt-6 inline-flex rounded-lg bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
        >
          Browse listings
        </a>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {savedListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

