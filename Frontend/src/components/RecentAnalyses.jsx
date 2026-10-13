import {
  ArrowRight,
  Clock3,
  FileText,
  Leaf,
  GraduationCap,
  Car,
  Brain,
} from 'lucide-react'
import VerdictBadge from './VerdictBadge'

function getIcon(title = '') {
  const value = title.toLowerCase()

  if (value.includes('waste') || value.includes('farm')) {
    return Leaf
  }

  if (value.includes('study') || value.includes('education')) {
    return GraduationCap
  }

  if (value.includes('parking') || value.includes('transport')) {
    return Car
  }

  if (value.includes('mental') || value.includes('health')) {
    return Brain
  }

  return FileText
}

export default function RecentAnalyses({
  analyses = [],
  onSelect,
  onViewAll,
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--card-shadow)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-5 sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
            Workspace
          </p>

          <h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">
            Recent Analyses
          </h2>

          <p className="mt-1 text-xs text-[var(--text)]">
            Your latest innovation analysis results.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ink)] transition hover:text-[var(--muted)]"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-[var(--border)] p-3 sm:p-4">
        {analyses.length > 0 ? (
          analyses.slice(0, 5).map((analysis, index) => {
            const Icon = getIcon(analysis.title)
            const verdict = analysis.result || analysis.overallResult

            return (
              <button
                key={analysis.id}
                type="button"
                onClick={() => onSelect?.(analysis)}
                className={`group flex w-full items-center gap-3 rounded-[18px] px-3 py-3.5 text-left transition sm:gap-4 sm:px-4 ${index === 0 ? 'bg-[var(--accent-tint)] hover:bg-[var(--accent-tint)]' : 'hover:bg-[var(--surface)]'}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--icon-tile)] text-[var(--ink)]">
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--text)]">
                    {analysis.title}
                  </span>

                  <span className="mt-1 block truncate text-xs text-[var(--text)]">
                    {analysis.description ||
                      'Innovation analysis result'}
                  </span>
                </span>

                <VerdictBadge
                  value={verdict}
                  className="hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex"
                />

                <span className="hidden items-center gap-1 text-[11px] text-[var(--muted)] lg:flex">
                  <Clock3 className="h-3.5 w-3.5" />
                  {analysis.time || '—'}
                </span>

                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
              </button>
            )
          })
        ) : (
          <div className="px-5 py-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-[var(--muted)]" />

            <p className="mt-3 text-sm font-medium text-[var(--ink)]">
              No analyses yet
            </p>

            <p className="mt-1 text-xs text-[var(--text)]">
              Start your first analysis to see results here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}