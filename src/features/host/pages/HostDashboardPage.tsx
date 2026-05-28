import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiBarChart2, FiCalendar, FiLayers, FiUsers } from 'react-icons/fi'
import HostStatCard from '../components/HostStatCard'
import { useDeleteListing, useHostStats, useMyListings } from '../hooks'
import type { Listing, ListingLifecycleStatus } from '../../listings/types'

function statusLabel(s?: ListingLifecycleStatus) {
  if (!s) return 'published'
  return s.replace('_', ' ').toLowerCase()
}

export default function HostDashboardPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const listingsQuery = useMyListings()
  const { stats, isLoading, isError } = useHostStats()
  const deleteListing = useDeleteListing()

  const listings = listingsQuery.data ?? []

  const handleDelete = () => {
    if (!deleteId) return
    deleteListing.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Listing removed')
        setDeleteId(null)
      },
      onError: (e: Error) => toast.error(e.message),
    })
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-2xl font-bold text-[#292626]">Host overview</h1>
          <p className="mt-1 text-sm text-[#857d7a]">
            Performance snapshot across guests, listings, and earnings.
          </p>
        </div>
        <Link
          to="/dashboard/create-listing"
          className="inline-flex w-fit rounded-xl bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Create listing
        </Link>
      </section>

      {isLoading ? (
        <p className="text-sm text-[#857d7a]">Loading overview…</p>
      ) : isError ? (
        <p className="text-sm text-red-600">Could not load dashboard stats.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          <HostStatCard
            label="Guests"
            value={stats.totalGuests}
            hint="Unique guests with bookings on your listings"
            icon={FiUsers}
          />
          <HostStatCard
            label="Approved listings"
            value={stats.approvedListings}
            hint="Published and visible to travelers"
            icon={FiLayers}
            accent="emerald"
          />
          <HostStatCard
            label="Total earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            hint="From confirmed reservations"
            icon={FiBarChart2}
          />
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        <Link
          to="/dashboard/bookings"
          className="inline-flex items-center gap-2 rounded-xl border border-[#eadfdb] bg-white px-5 py-2.5 text-sm font-semibold text-[#292626] shadow-sm transition hover:border-[#f97316]/50 hover:bg-[#fff7ed]"
        >
          <FiCalendar className="h-4 w-4 text-[#f97316]" aria-hidden />
          Manage bookings
        </Link>
        <Link
          to="/dashboard/listings"
          className="inline-flex items-center gap-2 rounded-xl border border-[#eadfdb] bg-white px-5 py-2.5 text-sm font-semibold text-[#292626] shadow-sm transition hover:border-[#f97316]/50 hover:bg-[#fff7ed]"
        >
          <FiLayers className="h-4 w-4 text-[#f97316]" aria-hidden />
          All listings
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#292626]">Recent listings</h2>
            <p className="text-sm text-[#857d7a]">Quick access to your published and draft stays.</p>
          </div>
          <Link
            to="/dashboard/listings"
            className="text-sm font-semibold text-[#f97316] hover:text-black"
          >
            View all →
          </Link>
        </div>

        {listingsQuery.isPending ? (
          <p className="text-sm text-[#857d7a]">Loading listings…</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.slice(0, 6).map((listing: Listing) => {
              const img = listing.photos[0]?.url
              return (
                <article
                  key={listing.id}
                  className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm transition hover:border-[#f97316]/30"
                >
                  {img ? (
                    <img src={img} alt="" className="aspect-[5/3] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[5/3] items-center justify-center bg-[#fff7ed] text-xs font-semibold uppercase tracking-wider text-[#857d7a]">
                      No photo
                    </div>
                  )}
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[#292626]">{listing.title}</h3>
                      <span className="whitespace-nowrap rounded-full border border-[#f0e5e1] bg-[#fff7ed] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#857d7a]">
                        {statusLabel(listing.status)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#f97316]">
                      ${listing.pricePerNight} / night
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/dashboard/edit-listing/${listing.id}`}
                        className="rounded-lg border border-[#eadfdb] bg-white px-3 py-1.5 text-xs font-semibold text-[#292626] transition hover:bg-[#fff7ed]"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(listing.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/listings/${listing.id}`}
                        className="rounded-lg border border-[#eadfdb] px-3 py-1.5 text-xs font-semibold text-[#857d7a] transition hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
            {listings.length === 0 && (
              <p className="text-sm text-[#857d7a] md:col-span-2 xl:col-span-3">
                No listings yet.{' '}
                <Link to="/dashboard/create-listing" className="font-semibold text-[#f97316] hover:underline">
                  Create your first stay
                </Link>
                .
              </p>
            )}
          </div>
        )}
      </section>

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="max-w-md rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-xl">
            <p className="font-bold text-[#292626]">Delete this listing permanently?</p>
            <p className="mt-1 text-sm text-[#857d7a]">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-[#eadfdb] py-2.5 text-sm font-semibold text-[#292626] transition hover:bg-[#fff7ed]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
