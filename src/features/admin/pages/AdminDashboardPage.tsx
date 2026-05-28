import { Link } from 'react-router-dom'
import { FiBarChart2, FiCalendar, FiLayers, FiUsers } from 'react-icons/fi'
import { useAdminStats } from '../hooks'

export default function AdminDashboardPage() {
  const statsQuery = useAdminStats()
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
            { label: 'Pending listings', value: s?.pendingListings ?? 0, icon: FiLayers },
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
          to="/dashboard/users"
          className="inline-flex rounded-xl border-2 border-black bg-[#f97316] px-6 py-3 text-sm font-black text-white hover:bg-black"
        >
          Manage users
        </Link>
        <Link
          to="/dashboard/moderation"
          className="inline-flex rounded-xl border-2 border-black bg-white px-6 py-3 text-sm font-black text-black hover:bg-[#fff7ed]"
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
    </div>
  )
}
