import { FiCheck, FiEdit3, FiExternalLink, FiLayers, FiPlus, FiX, FiXCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useApproveListing, useAdminAllListings, useRejectListing } from '../../admin/hooks'
import { getCurrentUser } from '../../auth/authStorage'
import HostStatCard from '../../host/components/HostStatCard'
import { useHostStats, useMyListings } from '../../host/hooks'
import type { Listing, ListingLifecycleStatus } from '../../listings/types'

function statusBadgeClass(status?: ListingLifecycleStatus) {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-emerald-50 text-emerald-700'
    case 'PENDING_APPROVAL':
      return 'bg-amber-50 text-amber-700'
    case 'REJECTED':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

function formatStatus(status?: ListingLifecycleStatus) {
  switch (status) {
    case 'PENDING_APPROVAL':
      return 'Pending'
    case 'PUBLISHED':
      return 'Published'
    case 'REJECTED':
      return 'Rejected'
    default:
      return status ?? '—'
  }
}

export default function ListingsPage() {
  const currentUser = getCurrentUser()
  const isAdmin = currentUser?.role === 'ADMIN'

  if (isAdmin) {
    return <AdminAllListingsPage />
  }

  return <HostListingsPage />
}

function AdminAllListingsPage() {
  const listingsQuery = useAdminAllListings()
  const listings = listingsQuery.data ?? []

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[#292626]">Listings</h1>
        <p className="mt-1 text-sm text-[#857d7a]">
          Review, approve, or reject stays before they appear on the public site.
        </p>
      </section>

      <AdminListingsTable listings={listings} isLoading={listingsQuery.isPending} isError={listingsQuery.isError} />
    </div>
  )
}

function AdminListingsTable({
  listings,
  isLoading,
  isError,
}: {
  listings: Listing[]
  isLoading: boolean
  isError: boolean
}) {
  const approve = useApproveListing()
  const reject = useRejectListing()

  const handleApprove = (listing: Listing) => {
    approve.mutate(listing.id, {
      onSuccess: () => toast.success(`"${listing.title}" approved`),
      onError: (e: Error) => toast.error(e.message),
    })
  }

  const handleReject = (listing: Listing) => {
    reject.mutate(listing.id, {
      onSuccess: () => toast.success(`"${listing.title}" rejected`),
      onError: (e: Error) => toast.error(e.message),
    })
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-[#eadfdb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div>
          <h2 className="text-lg font-bold text-[#292626]">Platform directory</h2>
          <p className="mt-1 text-sm text-[#857d7a]">
            {isLoading ? 'Loading…' : `${listings.length} listing${listings.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link
          to="/listings"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#eadfdb] bg-white px-4 py-2 text-sm font-semibold text-[#292626] transition hover:bg-[#fff7ed]"
        >
          <FiExternalLink />
          Public site
        </Link>
      </div>

      <div className="overflow-hidden bg-[#faf8f7] px-3 py-3">
        {isError ? (
          <p className="p-6 text-sm font-medium text-red-700">Could not load listings. Try refreshing the page.</p>
        ) : isLoading ? (
          <p className="p-6 text-sm text-[#857d7a]">Loading listings…</p>
        ) : listings.length === 0 ? (
          <p className="p-6 text-sm text-[#857d7a]">No listings in the system yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-white">
                <tr className="bg-[#292626] shadow-sm">
                  <th className="rounded-l-xl px-4 py-4 font-semibold">Cover</th>
                  <th className="px-4 py-4 font-semibold">Listing</th>
                  <th className="px-4 py-4 font-semibold">Location</th>
                  <th className="px-4 py-4 font-semibold">Host</th>
                  <th className="px-4 py-4 font-semibold">Type</th>
                  <th className="px-4 py-4 font-semibold">Guests</th>
                  <th className="px-4 py-4 font-semibold">Price</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="rounded-r-xl px-4 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => {
                  const thumb = listing.photos[0]?.url
                  const hostName = listing.host?.name?.trim() || '—'
                  return (
                    <tr
                      key={listing.id}
                      className={`shadow-sm transition hover:bg-[#fff7ed] ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#fff8f5]'
                      }`}
                    >
                      <td className="rounded-l-xl px-4 py-3">
                        <div className="h-12 w-16 overflow-hidden rounded-lg bg-[#eadfdb]">
                          {thumb ? (
                            <img src={thumb} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                      </td>
                      <td className="max-w-[220px] px-4 py-3 font-semibold text-[#292626]">
                        <span className="line-clamp-2 whitespace-normal">{listing.title}</span>
                      </td>
                      <td className="max-w-[160px] px-4 py-3 text-[#857d7a]">
                        <span className="line-clamp-2 whitespace-normal">{listing.location}</span>
                      </td>
                      <td className="px-4 py-3 text-[#857d7a]">{hostName}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#857d7a]">{listing.type}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#857d7a]">{listing.guest}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#292626]">
                        ${listing.pricePerNight}/night
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(listing.status)}`}
                        >
                          {formatStatus(listing.status)}
                        </span>
                      </td>
                      <td className="rounded-r-xl px-4 py-3 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {listing.status === 'PENDING_APPROVAL' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(listing)}
                                disabled={approve.isPending || reject.isPending}
                                className="inline-flex items-center gap-1 rounded-lg bg-[#f97316] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-50"
                              >
                                <FiCheck />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(listing)}
                                disabled={approve.isPending || reject.isPending}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                <FiX />
                                Reject
                              </button>
                            </>
                          )}
                          <Link
                            to={`/listings/${listing.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#eadfdb] bg-white px-3 py-1.5 text-xs font-semibold text-[#292626] transition hover:bg-[#fff7ed]"
                          >
                            <FiExternalLink />
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

function HostListingsPage() {
  const listingsQuery = useMyListings()
  const { stats, isLoading: statsLoading } = useHostStats()
  const listings = listingsQuery.data ?? []

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-2xl font-bold text-[#292626]">Listings</h1>
          <p className="mt-1 text-sm text-[#857d7a]">Manage your stays and track approval status.</p>
        </div>
        <Link
          to="/dashboard/create-listing"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          <FiPlus />
          Add listing
        </Link>
      </section>

      {statsLoading ? (
        <p className="text-sm text-[#857d7a]">Loading listing stats…</p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <HostStatCard
            label="Total listings"
            value={stats.totalListings}
            hint="All stays you have created"
            icon={FiLayers}
          />
          <HostStatCard
            label="Approved listings"
            value={stats.approvedListings}
            hint="Published and bookable"
            icon={FiLayers}
            accent="emerald"
          />
          <HostStatCard
            label="Pending listings"
            value={stats.pendingListings}
            hint="Awaiting admin review"
            icon={FiLayers}
            accent="amber"
          />
          <HostStatCard
            label="Rejected listings"
            value={stats.rejectedListings}
            hint="Not approved for publication"
            icon={FiXCircle}
            accent="red"
          />
        </section>
      )}

      <AvailableListingsSection listings={listings} isLoading={listingsQuery.isPending} />
    </div>
  )
}

function AvailableListingsSection({
  listings,
  isLoading,
}: {
  listings: Listing[]
  isLoading: boolean
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#eadfdb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div>
          <h2 className="text-lg font-bold text-[#292626]">Your listings</h2>
          <p className="mt-1 text-sm text-[#857d7a]">
            {isLoading ? 'Loading…' : `${listings.length} listing${listings.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link
          to="/listings"
          className="inline-flex w-fit rounded-xl border border-[#eadfdb] bg-white px-4 py-2 text-sm font-semibold text-[#292626] transition hover:bg-[#fff7ed]"
        >
          Public view
        </Link>
      </div>

      <div className="overflow-hidden bg-[#faf8f7] px-3 py-3">
        {isLoading ? (
          <p className="p-6 text-sm text-[#857d7a]">Loading listings…</p>
        ) : listings.length === 0 ? (
          <p className="p-6 text-sm text-[#857d7a]">No listings yet. Create your first stay.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-y-2 text-left text-sm whitespace-nowrap">
              <thead className="text-xs uppercase tracking-[0.14em] text-white">
                <tr className="bg-[#292626] shadow-sm">
                  <th className="rounded-l-xl px-5 py-4 font-semibold">Listing</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Guests</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="rounded-r-xl px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => (
                  <tr
                    key={listing.id}
                    className={`shadow-sm transition hover:bg-[#fff7ed] ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#fff8f5]'
                    }`}
                  >
                    <td className="rounded-l-xl px-5 py-4 font-semibold text-[#292626]">{listing.title}</td>
                    <td className="px-5 py-4 text-[#857d7a]">{listing.type}</td>
                    <td className="px-5 py-4 text-[#857d7a]">{listing.guest}</td>
                    <td className="px-5 py-4 font-semibold text-[#292626]">
                      ${listing.pricePerNight}/night
                    </td>
                    <td className="px-5 py-4 text-[#857d7a]">{listing.status ?? 'PUBLISHED'}</td>
                    <td className="rounded-r-xl px-5 py-4 text-right">
                      <Link
                        to={`/dashboard/edit-listing/${listing.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#eadfdb] bg-white px-3 py-1.5 text-xs font-semibold text-[#292626] transition hover:bg-[#fff7ed]"
                      >
                        <FiEdit3 />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
