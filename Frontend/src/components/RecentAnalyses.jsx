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
    return 'bg-[#e6ff1f] text-[#202426] border-[#e6ff1f]'
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
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#292d2e] text-white shadow-[0_24px_55px_rgba(30,38,44,0.16)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e6ff1f]">
            Workspace
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Recent Analyses
          </h2>

          <p className="mt-1 text-xs text-white/50">
            Your latest innovation analysis results.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#e6ff1f] transition hover:text-white"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-white/[0.08] p-3 sm:p-4">
        {analyses.length > 0 ? (
          analyses.slice(0, 5).map((analysis, index) => {
            const Icon = getIcon(analysis.title)

            return (
              <button
                key={analysis.id}
                type="button"
                onClick={() => onSelect?.(analysis)}
                className={`group flex w-full items-center gap-3 rounded-[18px] px-3 py-3.5 text-left transition sm:gap-4 sm:px-4 ${index === 0 ? 'bg-[#dce9f2]/15 hover:bg-[#dce9f2]/20' : 'hover:bg-white/[0.06]'}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-[#e6ff1f] text-[#202426]' : 'bg-white/10 text-white/75'}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white group-hover:text-[#e6ff1f]">
                    {analysis.title}
                  </span>

                  <span className="mt-1 block truncate text-xs text-white/45">
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

                <span className="hidden items-center gap-1 text-[11px] text-white/45 lg:flex">
                  <Clock3 className="h-3.5 w-3.5" />
                  {analysis.time || '—'}
                </span>

                <ArrowRight className="h-4 w-4 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-[#e6ff1f]" />
              </button>
            )
          })
        ) : (
          <div className="px-5 py-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-white/35" />

            <p className="mt-3 text-sm font-medium text-white">
              No analyses yet
            </p>

            <p className="mt-1 text-xs text-white/50">
              Start your first analysis to see results here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}