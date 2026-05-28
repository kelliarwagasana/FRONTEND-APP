import { FiCalendar, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { DashboardOutletContext } from '../utils/dashboardUtils'
import { statusClasses } from '../utils/dashboardUtils'
import HostStatCard from '../../host/components/HostStatCard'
import { useHostBookings, useHostBookingAction, useHostStats } from '../../host/hooks'
import type { Booking } from '../../bookings/types'

export default function BookingsPage() {
  const { isAdmin } = useOutletContext<DashboardOutletContext>()
  const bookingsQuery = useHostBookings()
  const hostAction = useHostBookingAction()
  const { stats, isLoading: statsLoading } = useHostStats()

  if (isAdmin) {
    return (
      <section className="rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#857d7a]">
          Use <strong className="text-[#292626]">Platform bookings</strong> in the sidebar for all reservations.
        </p>
      </section>
    )
  }

  const bookings = bookingsQuery.data ?? []

  const handleStatusUpdate = (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    hostAction.mutate(
      { bookingId, status },
      {
        onSuccess: () => toast.success(status === 'CONFIRMED' ? 'Booking confirmed' : 'Booking cancelled'),
        onError: (e: Error) => toast.error(e.message),
      },
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[#292626]">Bookings</h1>
        <p className="mt-1 text-sm text-[#857d7a]">
          Review requests, confirm stays, and track reservation status.
        </p>
      </section>

      {statsLoading ? (
        <p className="text-sm text-[#857d7a]">Loading booking stats…</p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <HostStatCard
            label="Booking requests"
            value={stats.bookingRequests}
            hint="All reservations for your listings"
            icon={FiCalendar}
          />
          <HostStatCard
            label="Pending bookings"
            value={stats.pendingBookings}
            hint="Awaiting your approval"
            icon={FiClock}
            accent="amber"
          />
          <HostStatCard
            label="Confirmed"
            value={stats.confirmedBookings}
            hint="Approved and active stays"
            icon={FiCheckCircle}
            accent="emerald"
          />
          <HostStatCard
            label="Cancelled"
            value={stats.cancelledBookings}
            hint="Declined or cancelled reservations"
            icon={FiXCircle}
            accent="red"
          />
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
        <div className="border-b border-[#eadfdb] px-5 py-4 sm:px-6 sm:py-5">
          <h2 className="text-lg font-bold text-[#292626]">All reservations</h2>
          <p className="mt-1 text-sm text-[#857d7a]">
            {bookingsQuery.isPending
              ? 'Loading…'
              : `${bookings.length} booking${bookings.length === 1 ? '' : 's'}`}
          </p>
        </div>

        <div className="overflow-hidden bg-[#faf8f7] px-3 py-3">
          {bookingsQuery.isPending ? (
            <p className="p-6 text-sm text-[#857d7a]">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="p-6 text-sm text-[#857d7a]">No bookings yet.</p>
          ) : (
            <BookingsTable bookings={bookings} onStatusUpdate={handleStatusUpdate} />
          )}
        </div>
      </section>
    </div>
  )
}

function BookingsTable({
  bookings,
  onStatusUpdate,
}: {
  bookings: Booking[]
  onStatusUpdate: (id: string, status: 'CONFIRMED' | 'CANCELLED') => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] border-separate border-spacing-y-2 text-left text-sm whitespace-nowrap">
        <thead className="text-xs uppercase tracking-[0.14em] text-white">
          <tr className="bg-[#292626] shadow-sm">
            <th className="rounded-l-xl px-5 py-4 font-semibold">Listing</th>
            <th className="px-5 py-4 font-semibold">Guest</th>
            <th className="px-5 py-4 font-semibold">Check-in</th>
            <th className="px-5 py-4 font-semibold">Check-out</th>
            <th className="px-5 py-4 font-semibold">Total</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="rounded-r-xl px-5 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr
              key={booking.id}
              className={`shadow-sm transition hover:bg-[#fff7ed] ${
                index % 2 === 0 ? 'bg-white' : 'bg-[#fff8f5]'
              }`}
            >
              <td className="rounded-l-xl px-5 py-4 font-semibold text-[#292626]">
                {booking.listing?.title ?? 'Listing'}
              </td>
              <td className="px-5 py-4 text-[#857d7a]">{booking.guest?.name ?? 'Guest'}</td>
              <td className="px-5 py-4 text-[#857d7a]">
                {new Date(booking.checkIn).toLocaleDateString()}
              </td>
              <td className="px-5 py-4 text-[#857d7a]">
                {new Date(booking.checkOut).toLocaleDateString()}
              </td>
              <td className="px-5 py-4 font-semibold text-[#292626]">
                ${booking.totalPrice.toLocaleString()}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${statusClasses(booking.status)}`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="rounded-r-xl px-5 py-4">
                {booking.status === 'PENDING' && (
                  <BookingActions bookingId={booking.id} onStatusUpdate={onStatusUpdate} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BookingActions({
  bookingId,
  onStatusUpdate,
}: {
  bookingId: string
  onStatusUpdate: (id: string, status: 'CONFIRMED' | 'CANCELLED') => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onStatusUpdate(bookingId, 'CONFIRMED')}
        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
      >
        <FiCheckCircle />
        Confirm
      </button>
      <button
        type="button"
        onClick={() => onStatusUpdate(bookingId, 'CANCELLED')}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
      >
        <FiXCircle />
        Cancel
      </button>
    </div>
  )
}
