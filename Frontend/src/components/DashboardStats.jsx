import {
  FileText,
  Bookmark,
  Target,
  Clock3,
  ArrowUpRight,
} from 'lucide-react'

const STATS = [
  {
    label: 'Total Analyses',
    value: '12',
    note: '+3 this week',
    icon: FileText,
    iconClass: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Saved Ideas',
    value: '5',
    note: '+1 this week',
    icon: Bookmark,
    iconClass: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Potential Gaps',
    value: '8',
    note: 'Across your analyses',
    icon: Target,
    iconClass: 'bg-lime-100 text-slate-900',
  },
]

export default function DashboardStats() {
  return (
    <section className="mb-5 grid grid-cols-1 gap-3 rounded-[28px] border border-white/70 bg-white/35 p-3 shadow-[0_18px_48px_rgba(83,105,156,0.08)] backdrop-blur-xl sm:grid-cols-3">
      {STATS.map(
        ({
          label,
          value,
          note,
          icon: Icon,
          iconClass,
        }) => (
          <div
            key={label}
            className="rounded-[22px] border border-white/80 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:bg-white/80 sm:p-5"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
              {label}
            </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-[#222728]">
              {value}
            </p>

              <p className="mt-2 text-xs font-medium text-slate-500">
              {note}
            </p>
          </div>
        )
      )}
    </section>
  )
}