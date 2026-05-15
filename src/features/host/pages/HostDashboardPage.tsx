import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  useDeleteListing,
  useHostBookingAction,
  useHostBookings,
  useMyListings,
} from '../hooks'
import type { Booking, Listing, ListingLifecycleStatus } from '../../listings/types'

function statusLabel(s?: ListingLifecycleStatus) {
  if (!s) return 'published'
  return s.replace('_', ' ').toLowerCase()
}

function bookingStatusTone(status: string) {
  if (status === 'CONFIRMED') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (status === 'CANCELLED') return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-amber-50 text-amber-900 border-amber-200'
}

export default function HostDashboardPage() {
  const [tab, setTab] = useState<'listings' | 'bookings'>('listings')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const listingsQuery = useMyListings()
  const bookingsQuery = useHostBookings()
  const deleteListing = useDeleteListing()
  const hostAction = useHostBookingAction()

  const listings = useMemo(() => listingsQuery.data ?? [], [listingsQuery.data])
  const bookings = useMemo(() => bookingsQuery.data ?? [], [bookingsQuery.data])

  const stats = useMemo(() => {
    const earnings = bookings
      .filter((b) => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.totalPrice, 0)
    return {
      earnings,
      bookingsCount: bookings.length,
      pendingBookings: bookings.filter((booking) => booking.status === 'PENDING').length,
      approvedListings: listings.filter((listing) => listing.status === 'PUBLISHED').length,
      pendingListings: listings.filter((listing) => listing.status === 'PENDING_APPROVAL').length,
      rejectedListings: listings.filter((listing) => listing.status === 'REJECTED').length,
    }
  }, [bookings, listings])

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-1xl font-black text-[#292626]">Host dashboard</h1>
          <p className=" text-sm text-[#857d7a]">Manage listings and booking requests.</p>
        </div>
        <Link
          to="/dashboard/create-listing"
          className="inline-flex w-fit rounded-xl bg-[#f97316] px-5 py-3 text-sm font-black text-white hover:bg-black"
        >
          Create listing
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm">
          <p className="text font-semibold uppercase tracking-[0.15em] text-[#857d7a]">Total earnings</p>
          <p className="mt-2 text-1xl font-semibold text-[#292626]">${stats.earnings.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm">
          <p className="text font-semibold uppercase tracking-[0.15em] text-[#857d7a]">Booking requests</p>
          <p className="mt-2 text-1xl font-semibold text-[#292626]">{stats.bookingsCount}</p>
        </div>
        <div className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm">
          <p className="text font-semibold uppercase tracking-[0.15em] text-[#857d7a]">Pending bookings</p>
          <p className="mt-2 text-1xl font-bold text-[#292626]">{stats.pendingBookings}</p>
        </div>
        <div className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm">
          <p className="text font-semibold uppercase tracking-[0.15em] text-[#857d7a]">Approved listings</p>
          <p className="mt-2 text-1xl font-bold text-[#292626]">{stats.approvedListings}</p>
        </div>
        <div className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm">
          <p className="text font-semibold uppercase tracking-[0.15em] text-[#857d7a]">Pending listings</p>
          <p className="mt-2 text-1xl font-bold text-[#292626]">{stats.pendingListings}</p>
        </div>
        <div className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm">
          <p className="text font-semibold uppercase tracking-[0.15em] text-[#857d7a]">Rejected listings</p>
          <p className="mt-2 text-1xl font-bold text-[#292626]">{stats.rejectedListings}</p>
        </div>
      </section>

      <div className="flex gap-2 border-b border-[#eadfdb]">
        {(['listings', 'bookings'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 text-sm font-black capitalize ${
              tab === t ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-[#857d7a]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'listings' && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing: Listing) => {
            const img = listing.photos[0]?.url
            return (
              <article key={listing.id} className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
                {img && <img src={img} alt="" className="aspect-[5/3] w-full object-cover" />}
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[#292626]">{listing.title}</h3>
                    <span className="whitespace-nowrap rounded-full border border-[#f0e5e1] px-2 py-0.5 text-[10px] font-black uppercase text-[#857d7a]">
                      {statusLabel(listing.status)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#f97316]">${listing.pricePerNight} / night</p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/dashboard/edit-listing/${listing.id}`}
                      className="rounded-lg border border-black bg-white px-3 py-1.5 text-xs font-black hover:bg-[#fff7ed]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(listing.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-black text-red-800"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/listings/${listing.id}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
          {listings.length === 0 && (
            <p className="text-sm text-[#857d7a]">No listings yet. Create one to get started.</p>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="space-y-4">
          {bookings.map((booking: Booking) => (
            <article
              key={booking.id}
              className="grid gap-4 rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm md:grid-cols-[1fr_auto]"
            >
              <div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${bookingStatusTone(booking.status)}`}>
                  {booking.status.toLowerCase()}
                </span>
                <h3 className="mt-3 text-lg font-bold text-[#292626]">{booking.listing?.title}</h3>
                <p className="text-sm text-[#857d7a]">
                  {booking.guest?.name} · {booking.checkIn} → {booking.checkOut}
                </p>
                <p className="mt-2 font-black text-[#f97316]">${booking.totalPrice.toLocaleString()}</p>
              </div>
              {booking.status === 'PENDING' && (
                <div className="flex flex-col gap-2 md:items-end">
                  <button
                    type="button"
                    onClick={() =>
                      hostAction.mutate({ bookingId: booking.id, status: 'CONFIRMED' })
                    }
                    className="rounded-lg bg-[#f97316] px-4 py-2 text-xs font-black text-white hover:bg-black"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      hostAction.mutate({ bookingId: booking.id, status: 'CANCELLED' })
                    }
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-800"
                  >
                    Decline
                  </button>
                </div>
              )}
            </article>
          ))}
          {bookings.length === 0 && <p className="text-sm text-[#857d7a]">No bookings for your listings yet.</p>}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="max-w-md rounded-2xl border-2 border-black bg-white p-6 shadow-xl">
            <p className="font-bold text-slate-900">Delete this listing permanently?</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeleteId(null)} className="flex-1 rounded-lg border py-2 text-sm font-semibold">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white"
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
