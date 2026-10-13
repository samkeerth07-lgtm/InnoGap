import { Bell, ChevronRight } from 'lucide-react'
import { ANALYSIS_ICONS } from './analysisIcons'
import { resultBadgeClass } from '../data'

function ResultBadge({ result }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${resultBadgeClass(
        result,
      )}`}
    >
      {result}
    </span>
  )
}

export default function MyAnalysesPage({ analyses, onSelect }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-start justify-between rounded-[24px] bg-[#292d2e] px-5 py-5 text-white shadow-[0_18px_42px_rgba(41,45,46,0.14)] sm:px-6">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e6ff1f]">
            Analysis library
          </p>
          <h1 className="text-2xl font-semibold text-white">My Analyses</h1>
          <p className="mt-1 text-sm text-white/60">
            Every idea you&rsquo;ve analyzed, most recent first.
          </p>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-white/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6ff1f]"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <section className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-[0_16px_40px_rgba(41,45,46,0.06)] sm:p-6">
        {analyses.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            You haven&rsquo;t analyzed any ideas yet — start one from the dashboard.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_180px_120px_24px] gap-4 border-b border-slate-200 px-1 pb-3 text-xs font-semibold tracking-wide text-slate-400">
              <span>IDEA</span>
              <span>RESULT</span>
              <span>ANALYZED ON</span>
              <span />
            </div>

            <ul>
              {analyses.map((item) => {
                const Icon = ANALYSIS_ICONS[item.icon]
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(item)}
                      className="group grid w-full grid-cols-[1fr_180px_120px_24px] items-center gap-4 border-b border-slate-100 px-1 py-4 text-left transition-colors last:border-b-0 hover:bg-lime-50/70 focus-visible:bg-lime-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e6ff1f]"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg}`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-sm font-medium text-slate-900">{item.title}</span>
                      </span>
                      <ResultBadge result={item.result} />
                      <span className="text-sm text-slate-500">{item.date}</span>
                      <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-600" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
