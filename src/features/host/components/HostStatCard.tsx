import type { IconType } from 'react-icons'

interface HostStatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: IconType
  accent?: 'orange' | 'slate' | 'emerald' | 'amber' | 'red'
}

const accentStyles = {
  orange: 'bg-[#fff7ed] text-[#f97316]',
  slate: 'bg-slate-100 text-slate-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-600',
}

export default function HostStatCard({ label, value, hint, icon: Icon, accent = 'orange' }: HostStatCardProps) {
  return (
    <article className="rounded-2xl border border-[#eadfdb] bg-white p-5 transition hover:border-[#f97316]/35 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-black sm:text-3xl">{value}</p>
          {hint && <p className="mt-1.5 text-xs leading-relaxed text-black/45">{hint}</p>}
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentStyles[accent]}`}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  )
}
