import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthBucket } from '../types'

interface AnalyticsBarChartProps {
  title: string
  subtitle?: string
  data: MonthBucket[]
  valuePrefix?: string
  color?: string
}

export default function AnalyticsBarChart({
  title,
  subtitle,
  data,
  valuePrefix = '',
  color = '#f97316',
}: AnalyticsBarChartProps) {
  const chartData = data.map((d) => ({ name: d.label, value: d.value }))

  return (
    <article className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#292626]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#857d7a]">{subtitle}</p>}
      </div>
      <div className="h-56 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#857d7a', fontSize: 10 }}
              axisLine={{ stroke: '#eadfdb' }}
              tickLine={false}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={52}
            />
            <YAxis
              tick={{ fill: '#857d7a', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={valuePrefix === '$' ? false : true}
            />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #eadfdb',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
              formatter={(value) => {
                const n = Number(value ?? 0)
                return [valuePrefix === '$' ? `$${n.toLocaleString()}` : n, 'Total']
              }}
            />
            <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
