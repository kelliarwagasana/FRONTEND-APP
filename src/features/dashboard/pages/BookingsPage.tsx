import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { DashboardOutletContext } from '../utils/dashboardUtils'
import { statusClasses } from '../utils/dashboardUtils'
import { useHostBookings, useHostBookingAction } from '../../host/hooks'
import type { Booking } from '../../bookings/types'

export default function BookingsPage() {
  const { isAdmin } = useOutletContext<DashboardOutletContext>()
  const bookingsQuery = useHostBookings()
  const hostAction = useHostBookingAction()

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
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <BookingsHeader count={bookings.length} isLoading={bookingsQuery.isPending} />
      <div className="overflow-hidden bg-[#f8fafc] px-3 py-3">
        {bookingsQuery.isPending ? (
          <p className="p-6 text-sm text-slate-500">Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No bookings yet.</p>
        ) : (
          <BookingsTable bookings={bookings} onStatusUpdate={handleStatusUpdate} />
        )}
      </div>
    </section>
  )
}

function BookingsHeader({ count, isLoading }: { count: number; isLoading: boolean }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-950">Bookings</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isLoading ? 'Loading…' : `${count} total booking${count === 1 ? '' : 's'}`}
        </p>
      </div>
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
        <thead className="text-xs uppercase tracking-[0.16em] text-white">
          <tr className="bg-slate-950 shadow-sm">
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
              <td className="rounded-l-xl px-5 py-4 font-semibold text-slate-900">
                {booking.listing?.title ?? 'Listing'}
              </td>
              <td className="px-5 py-4 text-slate-600">{booking.guest?.name ?? 'Guest'}</td>
              <td className="px-5 py-4 text-slate-600">
                {new Date(booking.checkIn).toLocaleDateString()}
              </td>
              <td className="px-5 py-4 text-slate-600">
                {new Date(booking.checkOut).toLocaleDateString()}
              </td>
              <td className="px-5 py-4 font-semibold text-slate-900">
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
        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
      >
        <FiCheckCircle />
        Confirm
      </button>
      <button
        type="button"
        onClick={() => onStatusUpdate(bookingId, 'CANCELLED')}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
      >
        <FiXCircle />
        Cancel
      </button>
    </div>
  )
}
