import { FiEdit3, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useMyListings } from '../../host/hooks'
import type { Listing } from '../../listings/types'

export default function ListingsPage() {
  const listingsQuery = useMyListings()
  const listings = listingsQuery.data ?? []

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#292626]">Listings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your stays from the API.</p>
        </div>
        <Link
          to="/dashboard/create-listing"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
        >
          <FiPlus />
          Add listing
        </Link>
      </section>

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
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Your listings</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? 'Loading…' : `${listings.length} listing${listings.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link
          to="/listings"
          className="inline-flex w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Public view
        </Link>
      </div>

      <div className="overflow-hidden bg-[#f8fafc] px-3 py-3">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading listings…</p>
        ) : listings.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No listings yet. Create your first stay.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-y-2 text-left text-sm whitespace-nowrap">
              <thead className="text-xs uppercase tracking-[0.16em] text-white">
                <tr className="bg-slate-950 shadow-sm">
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
                    <td className="rounded-l-xl px-5 py-4 font-semibold text-slate-900">{listing.title}</td>
                    <td className="px-5 py-4 text-slate-600">{listing.type}</td>
                    <td className="px-5 py-4 text-slate-600">{listing.guest}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      ${listing.pricePerNight}/night
                    </td>
                    <td className="px-5 py-4 text-slate-600">{listing.status ?? 'PUBLISHED'}</td>
                    <td className="rounded-r-xl px-5 py-4 text-right">
                      <Link
                        to={`/dashboard/edit-listing/${listing.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
