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
    iconClass: 'bg-[var(--icon-tile)] text-[var(--ink)]',
  },
  {
    label: 'Saved Ideas',
    value: '5',
    note: '+1 this week',
    icon: Bookmark,
    iconClass: 'bg-[var(--success-bg)] text-[var(--success-text)]',
  },
  {
    label: 'Potential Gaps',
    value: '8',
    note: 'Across your analyses',
    icon: Target,
    iconClass: 'bg-[var(--icon-tile)] text-[var(--ink)]',
  },
]

export default function DashboardStats() {
  return (
    <section className="mb-5 grid grid-cols-1 gap-3 rounded-[28px] p-3 sm:grid-cols-3">
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
            className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--surface)] sm:p-5"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
            </div>

              <p className="mt-4 text-xs font-medium text-[var(--muted)]">
              {label}
            </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--ink)]">
              {value}
            </p>

              <p className="mt-2 text-xs font-medium text-[var(--muted)]">
              {note}
            </p>
          </div>
        )
      )}
    </section>
  )
}