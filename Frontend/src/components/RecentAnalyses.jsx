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
    return 'bg-lime-100 text-slate-900 border-lime-200'
  }

  if (
    value.includes('partial') ||
    value.includes('existing')
  ) {
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }

  return 'bg-slate-100 text-slate-700 border-slate-200'
}

export default function RecentAnalyses({
  analyses = [],
  onSelect,
  onViewAll,
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white text-slate-900 shadow-[0_18px_48px_rgba(83,105,156,0.08)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e6ff1f]" />
            Workspace
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Recent Analyses
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your latest innovation analysis results.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#292d2e] transition hover:text-slate-500"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 p-3 sm:p-4">
        {analyses.length > 0 ? (
          analyses.slice(0, 5).map((analysis, index) => {
            const Icon = getIcon(analysis.title)

            return (
              <button
                key={analysis.id}
                type="button"
                onClick={() => onSelect?.(analysis)}
                className={`group flex w-full items-center gap-3 rounded-[18px] px-3 py-3.5 text-left transition sm:gap-4 sm:px-4 ${index === 0 ? 'bg-lime-50 hover:bg-lime-100' : 'hover:bg-slate-50'}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-[#292d2e] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                    {analysis.title}
                  </span>

                  <span className="mt-1 block truncate text-xs text-slate-500">
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

                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
              </button>
            )
          })
        ) : (
          <div className="px-5 py-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-900">
              No analyses yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Start your first analysis to see results here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}