import { ChevronRight } from 'lucide-react'
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

export default function RecentAnalyses({ analyses, onSelect, onViewAll }) {
  const items = analyses.slice(0, 4)

  return (
    <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Recent Analyses</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-[1fr_180px_120px_24px] gap-4 border-b border-gray-100 px-1 pb-3 text-xs font-medium tracking-wide text-gray-400">
        <span>IDEA</span>
        <span>RESULT</span>
        <span>ANALYZED ON</span>
        <span />
      </div>

      <ul>
        {items.map((item) => {
          const Icon = ANALYSIS_ICONS[item.icon]
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className="grid w-full grid-cols-[1fr_180px_120px_24px] items-center gap-4 border-b border-gray-50 px-1 py-4 text-left last:border-b-0 hover:bg-gray-50/60"
              >
                <span className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg}`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm font-medium text-gray-900">{item.title}</span>
                </span>
                <ResultBadge result={item.result} />
                <span className="text-sm text-gray-400">{item.date}</span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}