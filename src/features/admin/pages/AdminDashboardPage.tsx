import { Link } from 'react-router-dom'
import { FiBarChart2, FiCalendar, FiLayers, FiUsers } from 'react-icons/fi'
import { useAdminStats, useBanUser } from '../hooks'
import { useUsers } from '../../users/hooks'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const statsQuery = useAdminStats()
  const banUser = useBanUser()
  const usersQuery = useUsers()
  const users = usersQuery.data?.data ?? []
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const s = statsQuery.data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#292626]">Admin overview</h1>
        <p className="mt-1 text-sm text-[#857d7a]">Platform stats (live API)</p>
      </div>

      {statsQuery.isPending ? (
        <p className="text-sm text-slate-600">Loading stats…</p>
      ) : statsQuery.isError ? (
        <p className="text-sm text-red-600">Could not load stats.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total users', value: s?.totalUsers ?? 0, icon: FiUsers },
            { label: 'Total listings', value: s?.totalListings ?? 0, icon: FiLayers },
            { label: 'Pending approval', value: s?.pendingListings ?? 0, icon: FiLayers },
            { label: 'Approved listings', value: s?.approvedListings ?? 0, icon: FiLayers },
            { label: 'Rejected listings', value: s?.rejectedListings ?? 0, icon: FiLayers },
            { label: 'Total bookings', value: s?.totalBookings ?? 0, icon: FiCalendar },
            {
              label: 'Total revenue',
              value: `$${(s?.totalRevenue ?? 0).toLocaleString()}`,
              icon: FiBarChart2,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm"
            >
              <div>
                <p className="text-sm text-[#857d7a]">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#292626]">{item.value}</p>
              </div>
              <item.icon className="h-10 w-10 text-[#f97316]" aria-hidden />
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-wrap gap-4">
        <Link
          to="/dashboard/moderation"
          className="inline-flex rounded-xl border-2 border-black bg-[#f97316] px-6 py-3 text-sm font-black text-white hover:bg-black"
        >
          Moderation queue
        </Link>
        <Link
          to="/dashboard/platform-bookings"
          className="inline-flex rounded-xl border-2 border-black bg-white px-6 py-3 text-sm font-black text-black hover:bg-[#fff7ed]"
        >
          All bookings
        </Link>
      </section>

      <section className="rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#292626]">Ban user</h2>
        <p className="mt-1 text-sm text-[#857d7a]">
          Deactivate accounts via the API. Banned users cannot sign in.
        </p>
        <ul className="mt-4 divide-y divide-[#f0e5e1]">
          {users
            .filter((u) => u.role !== 'ADMIN')
            .map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-[#292626]">{u.name}</p>
                  <p className="text-xs text-[#857d7a]">{u.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmId(u.id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-800 hover:bg-red-100"
                >
                  Ban user
                </button>
              </li>
            ))}
        </ul>
      </section>

      {confirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="max-w-md rounded-2xl border-2 border-black bg-white p-6 shadow-xl">
            <p className="font-bold text-slate-900">Ban this user? Their listings and bookings will be affected.</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  banUser.mutate(confirmId, {
                    onSuccess: () => {
                      toast.success('User banned')
                      setConfirmId(null)
                    },
                    onError: (e: Error) => toast.error(e.message),
                  })
                }}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white"
              >
                Confirm ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
