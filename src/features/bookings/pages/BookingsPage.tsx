import { useEffect } from 'react'
import { FiXCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../shared/components/Navbar'
import { useAuth } from '../../auth/hooks/useAuth'
import { useCancelBooking } from '../hooks/useCancelBooking'
import { useMyBookings } from '../hooks/useMyBookings'
import type { Booking } from '../../listings/types'

function money(amount: number) {
  return `$${amount.toLocaleString()}`
}

function statusClasses(status: string) {
  if (status === 'CONFIRMED') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  if (status === 'CANCELLED') {
    return 'bg-red-50 text-red-700 border-red-200'
  }

  return 'bg-amber-50 text-amber-700 border-amber-200'
}

export default function BookingsPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const bookingsQuery = useMyBookings()
  const cancelBooking = useCancelBooking()
  const bookings: Booking[] = bookingsQuery.data ?? []
  useEffect(() => {
    if (currentUser && currentUser.role !== 'GUEST') {
      navigate('/dashboard', { replace: true })
    }
  }, [currentUser, navigate])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar variant="solid" />
        <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-6 py-16 text-center">
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-950">Login required</h1>
            <a
              href="#/login"
              className="mt-6 inline-flex rounded-lg bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
            >
              Login
            </a>
          </div>
        </main>
      </div>
    )
  }

  if (currentUser.role !== 'GUEST') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="solid" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar variant="solid" />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#f97316]">
            Guest
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-950">Your bookings</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Review upcoming stays and requests for {currentUser.name}.
              </p>
            </div>
            <a
              href="#/listings"
              className="inline-flex rounded-lg bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
            >
              Book another stay
            </a>
          </div>
        </section>

        {bookingsQuery.isPending ? (
          <p className="mt-8 text-center text-sm font-semibold text-slate-600">Loading bookings…</p>
        ) : bookingsQuery.isError ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-800">Could not load bookings.</p>
            <button
              type="button"
              onClick={() => bookingsQuery.refetch()}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-800 ring-1 ring-red-200"
            >
              Retry
            </button>
          </div>
        ) : (
        <section className="mt-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">No bookings yet</h2>
              <a
                href="#/listings"
                className="mt-6 inline-flex rounded-lg bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
              >
                Explore stays
              </a>
            </div>
          ) : (
            bookings.map((booking) => {
              const firstPhoto = booking.listing?.photos?.[0]

              return (
                <article key={booking.id} className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-[15rem_1fr]">
                  {firstPhoto && (
                    <img
                      src={firstPhoto.url}
                      alt={booking.listing?.title ?? ''}
                      className="h-56 w-full object-cover md:h-full"
                    />
                  )}
                  <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <span className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${statusClasses(booking.status)}`}>
                        {booking.status}
                      </span>
                      <h2 className="mt-4 text-2xl font-bold text-slate-950">{booking.listing?.title}</h2>
                      <p className="mt-2 text-sm text-slate-500">{booking.listing?.location}</p>
                      <p className="mt-4 text-sm font-medium text-slate-700">
                        {booking.checkIn} to {booking.checkOut}
                        {booking.guests != null ? ` · ${booking.guests} guests` : ''}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 lg:min-w-44">
                      <p className="text-sm text-slate-500">Total</p>
                      <p className="mt-2 text-2xl font-bold text-slate-950">{money(booking.totalPrice)}</p>
                      {booking.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => cancelBooking.mutate(booking.id)}
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <FiXCircle />
                          Cancel booking
                        </button>
                      )}
                      <a
                        href={`#/listings/${booking.listingId}`}
                        className="mt-5 inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      >
                        View stay
                      </a>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </section>
        )}
      </main>
    </div>
  )
}
