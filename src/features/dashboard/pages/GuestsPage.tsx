import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../utils/dashboardUtils'
import UserAvatar from '../components/UserAvatar'
import { useHostBookings } from '../../host/hooks'
import { useUsers } from '../../users/hooks'
import type { User } from '../../auth/types'

const PREVIEW_COUNT = 5

export default function GuestsPage() {
  const { isAdmin } = useOutletContext<DashboardOutletContext>()
  const hostBookingsQuery = useHostBookings()
  const usersQuery = useUsers()
  const [showAll, setShowAll] = useState(false)

  const guests = useMemo(() => {
    if (isAdmin) {
      return (usersQuery.data?.data ?? []).filter((u) => u.role === 'GUEST')
    }
    const map = new Map<string, User>()
    for (const booking of hostBookingsQuery.data ?? []) {
      if (booking.guest) {
        map.set(booking.guest.id, booking.guest)
      }
    }
    return Array.from(map.values())
  }, [isAdmin, hostBookingsQuery.data, usersQuery.data?.data])

  const visibleGuests = useMemo(
    () => (showAll ? guests : guests.slice(0, PREVIEW_COUNT)),
    [showAll, guests],
  )
  const hasMore = guests.length > PREVIEW_COUNT
  const isLoading = isAdmin ? usersQuery.isPending : hostBookingsQuery.isPending

  let subtitle = 'Loading…'
  if (!isLoading) {
    if (guests.length === 0) subtitle = 'No guests yet'
    else if (showAll || guests.length <= PREVIEW_COUNT) {
      subtitle = `${guests.length} guest${guests.length === 1 ? '' : 's'}`
    } else {
      subtitle = `Showing ${visibleGuests.length} of ${guests.length} guests`
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[#292626]">Guest list</h1>
        <p className="mt-1 text-sm text-[#857d7a]">
          Guests who have booked your listings.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
        <div className="border-b border-[#f0e5e1] px-6 py-5">
          <h2 className="text-xl font-bold text-[#292626]">Your guests</h2>
          <p className="mt-1 text-sm text-[#857d7a]">{subtitle}</p>
        </div>
        <div className="overflow-hidden bg-[#faf8f7] px-3 py-3">
          {isLoading ? (
            <p className="p-6 text-sm text-[#857d7a]">Loading guests…</p>
          ) : guests.length === 0 ? (
            <p className="p-6 text-sm text-[#857d7a]">No guests yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm whitespace-nowrap">
                  <thead className="text-xs uppercase tracking-[0.14em] text-white">
                    <tr className="bg-[#292626] shadow-sm">
                      <th className="rounded-l-xl px-5 py-4 font-semibold">Name</th>
                      <th className="px-5 py-4 font-semibold">Email</th>
                      <th className="px-5 py-4 font-semibold">Phone</th>
                      <th className="rounded-r-xl px-5 py-4 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleGuests.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`shadow-sm transition hover:bg-[#fff7ed] ${
                          index % 2 === 0 ? 'bg-white' : 'bg-[#fff8f5]'
                        }`}
                      >
                        <td className="rounded-l-xl px-5 py-4">
                          <GuestNameCell user={user} />
                        </td>
                        <td className="px-5 py-4 text-[#857d7a]">{user.email}</td>
                        <td className="px-5 py-4 text-[#857d7a]">{user.phone}</td>
                        <td className="rounded-r-xl px-5 py-4">
                          <span className="inline-flex rounded-lg border border-[#eadfdb] bg-white px-3 py-1 text-xs font-semibold text-[#292626]">
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <div className="border-t border-[#eadfdb] px-3 py-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="w-full rounded-xl border border-[#eadfdb] bg-[#fff7ed] px-4 py-3 text-sm font-semibold text-[#f97316] transition hover:border-[#f97316] hover:bg-white sm:w-auto"
                  >
                    {showAll ? 'Show fewer guests' : `See all guests (${guests.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function GuestNameCell({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} size="md" />
      <span className="font-semibold text-[#292626]">{user.name}</span>
    </div>
  )
}
