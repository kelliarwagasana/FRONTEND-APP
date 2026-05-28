import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface BreakdownItem {
  name: string
  value: number
  color: string
}

interface AnalyticsBreakdownChartProps {
  title: string
  subtitle?: string
  items: BreakdownItem[]
}

export default function AnalyticsBreakdownChart({ title, subtitle, items }: AnalyticsBreakdownChartProps) {
  return (
    <article className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#292626]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#857d7a]">{subtitle}</p>}
      </div>
      <div className="h-52 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={items} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#857d7a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={72}
              tick={{ fill: '#292626', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.06)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #eadfdb',
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {items.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
