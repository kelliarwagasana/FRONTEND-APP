import { useState } from 'react'
import type { AllBookingsFilters } from '../hooks'
import { useAllBookings } from '../hooks'

export default function AllBookingsAdminPage() {
  const [status, setStatus] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const filters: AllBookingsFilters = { status, dateFrom, dateTo, page }
  const query = useAllBookings(filters)
  const data = query.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#292626]">All bookings</h1>
        <p className="mt-1 text-sm text-[#857d7a]">Filter by status and date range.</p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-[#eadfdb] bg-white p-4 shadow-sm">
        <label className="text-xs font-bold text-[#857d7a]">
          Status
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="mt-1 block rounded-lg border border-[#eadfdb] px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label className="text-xs font-bold text-[#857d7a]">
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value)
              setPage(1)
            }}
            className="mt-1 block rounded-lg border border-[#eadfdb] px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-bold text-[#857d7a]">
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value)
              setPage(1)
            }}
            className="mt-1 block rounded-lg border border-[#eadfdb] px-3 py-2 text-sm"
          />
        </label>
      </div>

      {query.isFetching && !query.isPending ? (
        <p className="text-xs font-semibold text-[#f97316]">Updating results…</p>
      ) : null}

      <div className="space-y-4">
        {(data?.items ?? []).map((b) => (
          <article key={b.id} className="rounded-xl border border-[#eadfdb] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-[#857d7a]">{b.status}</p>
                <h3 className="mt-1 font-bold text-[#292626]">{b.listing?.title}</h3>
                <p className="text-sm text-[#857d7a]">
                  {b.guest?.name} · {b.checkIn} → {b.checkOut}
                </p>
              </div>
              <p className="text-lg font-black text-[#f97316]">${b.totalPrice.toLocaleString()}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-lg border border-[#eadfdb] px-4 py-2 text-sm font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-[#857d7a]">
          Page {data?.page ?? page}
          {data?.total != null ? ` · ${data.total} total` : ''}
        </span>
        <button
          type="button"
          disabled={data ? page * (data.limit ?? 8) >= data.total : true}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border border-[#eadfdb] px-4 py-2 text-sm font-semibold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
