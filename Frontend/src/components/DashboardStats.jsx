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
    note: '3 this week',
    icon: FileText,
    iconClass: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Saved Ideas',
    value: '5',
    note: '1 this week',
    icon: Bookmark,
    iconClass: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Potential Gaps',
    value: '8',
    note: '2 this week',
    icon: Target,
    iconClass: 'bg-violet-50 text-violet-600',
  },
  {
    label: 'Avg. Analysis Time',
    value: '2–3 min',
    note: 'Improving',
    icon: Clock3,
    iconClass: 'bg-amber-50 text-amber-600',
  },
]

export default function DashboardStats() {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-100"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <ArrowUpRight className="h-4 w-4 text-slate-300" />
            </div>

            <p className="mt-5 text-xs font-medium text-slate-400">
              {label}
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              {value}
            </p>

            <p className="mt-2 text-xs font-medium text-emerald-600">
              {note}
            </p>
          </div>
        )
      )}
    </section>
  )
}