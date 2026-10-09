import {
  ArrowRight,
  Clock3,
  FileText,
  Leaf,
  GraduationCap,
  Car,
  Brain,
} from 'lucide-react'

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

function getStatusStyle(status = '') {
  const value = status.toLowerCase()

  if (
    value.includes('new') ||
    value.includes('mostly new')
  ) {
    return 'bg-blue-50 text-blue-700 border-blue-100'
  }

  if (
    value.includes('partial') ||
    value.includes('existing')
  ) {
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }

  return 'bg-slate-50 text-slate-600 border-slate-100'
}

export default function RecentAnalyses({
  analyses = [],
  onSelect,
  onViewAll,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Workspace
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Recent Analyses
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your latest innovation analysis results.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {analyses.length > 0 ? (
          analyses.slice(0, 5).map((analysis) => {
            const Icon = getIcon(analysis.title)

            return (
              <button
                key={analysis.id}
                type="button"
                onClick={() => onSelect?.(analysis)}
                className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50/70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                    {analysis.title}
                  </span>

                  <span className="mt-1 block truncate text-xs text-slate-400">
                    {analysis.description ||
                      'Innovation analysis result'}
                  </span>
                </span>

                <span
                  className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:block ${getStatusStyle(
                    analysis.status ||
                      analysis.overallResult
                  )}`}
                >
                  {analysis.status ||
                    analysis.overallResult ||
                    'Analyzed'}
                </span>

                <span className="hidden items-center gap-1 text-[11px] text-slate-400 lg:flex">
                  <Clock3 className="h-3.5 w-3.5" />
                  {analysis.time || '—'}
                </span>

                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
              </button>
            )
          })
        ) : (
          <div className="px-5 py-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No analyses yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Start your first analysis to see results here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}