import AnalyticsDashboard from '../../analytics/components/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[#292626]">Analytics</h1>
        <p className="mt-1 text-sm text-[#857d7a]">
          Monthly trends from January through December {new Date().getFullYear()}.
        </p>
      </section>
      <AnalyticsDashboard />
    </div>
  )
}
