import { FiBarChart2, FiCalendar, FiLayers, FiStar } from 'react-icons/fi'
import HostStatCard from '../../host/components/HostStatCard'
import { useAnalytics } from '../hooks'
import AnalyticsBarChart from './AnalyticsBarChart'
import AnalyticsBreakdownChart from './AnalyticsBreakdownChart'

const chartYear = new Date().getFullYear()
const yearRangeLabel = `Jan – Dec ${chartYear}`

export default function AnalyticsDashboard() {
  const query = useAnalytics()
  const data = query.data

  if (query.isPending) {
    return <p className="text-sm text-[#857d7a]">Loading analytics…</p>
  }

  if (query.isError || !data) {
    return <p className="text-sm text-red-600">Could not load analytics.</p>
  }

  const { summary } = data

  const bookingBreakdown = [
    { name: 'Pending', value: data.bookingsByStatus.pending, color: '#f59e0b' },
    { name: 'Confirmed', value: data.bookingsByStatus.confirmed, color: '#22c55e' },
    { name: 'Cancelled', value: data.bookingsByStatus.cancelled, color: '#94a3b8' },
  ]

  const ratingBreakdown = data.reviewsByRating.map((r) => ({
    name: `${r.rating}★`,
    value: r.count,
    color: r.rating >= 4 ? '#f97316' : r.rating >= 3 ? '#fb923c' : '#fdba74',
  }))

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HostStatCard
          label="Listings"
          value={summary.totalListings}
          hint="Total stays in scope"
          icon={FiLayers}
        />
        <HostStatCard
          label="Bookings"
          value={summary.totalBookings}
          hint="All reservation requests"
          icon={FiCalendar}
          accent="slate"
        />
        <HostStatCard
          label="Reviews"
          value={summary.totalReviews}
          hint={
            summary.averageRating != null
              ? `Average rating ${summary.averageRating}`
              : 'No reviews yet'
          }
          icon={FiStar}
          accent="amber"
        />
        <HostStatCard
          label="Total revenue"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          hint="From confirmed bookings"
          icon={FiBarChart2}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <AnalyticsBarChart
          title="Total revenue"
          subtitle={`Confirmed bookings · ${yearRangeLabel}`}
          data={data.revenueByMonth}
          valuePrefix="$"
          color="#f97316"
        />
        <AnalyticsBarChart
          title="Bookings"
          subtitle={`New reservations · ${yearRangeLabel}`}
          data={data.bookingsByMonth}
          color="#292626"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <AnalyticsBreakdownChart
          title="Bookings by status"
          subtitle="Current snapshot"
          items={bookingBreakdown}
        />
        <AnalyticsBreakdownChart
          title="Reviews by rating"
          subtitle="Distribution"
          items={ratingBreakdown}
        />
      </section>
    </div>
  )
}
