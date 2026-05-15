import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../utils/dashboardUtils'
import UserAvatar from '../components/UserAvatar'
import { useHostBookings } from '../../host/hooks'
import { useUsers } from '../../users/hooks'
import type { User } from '../../auth/types'

export default function GuestsPage() {
  const { isAdmin } = useOutletContext<DashboardOutletContext>()
  const hostBookingsQuery = useHostBookings()
  const usersQuery = useUsers()

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

  const isLoading = isAdmin ? usersQuery.isPending : hostBookingsQuery.isPending

  return (
    <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
      <div className="border-b border-[#f0e5e1] px-6 py-5">
        <h2 className="text-xl font-bold text-[#292626]">Guest list</h2>
        <p className="mt-1 text-sm text-[#857d7a]">
          {isLoading ? 'Loading…' : `${guests.length} guest${guests.length === 1 ? '' : 's'}`}
        </p>
      </div>
      <div className="overflow-hidden bg-[#f8fafc] px-3 py-3">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading guests…</p>
        ) : guests.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No guests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm whitespace-nowrap">
              <thead className="text-xs uppercase tracking-[0.16em] text-white">
                <tr className="bg-slate-950 shadow-sm">
                  <th className="rounded-l-xl px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="rounded-r-xl px-5 py-4 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`shadow-sm transition hover:bg-[#fff7ed] ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#fff8f5]'
                    }`}
                  >
                    <td className="rounded-l-xl px-5 py-4">
                      <GuestNameCell user={user} />
                    </td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4 text-slate-600">{user.phone}</td>
                    <td className="rounded-r-xl px-5 py-4">
                      <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {user.role}
                      </span>
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

function GuestNameCell({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} size="md" />
      <span className="font-semibold text-[#292626]">{user.name}</span>
    </div>
  )
}
