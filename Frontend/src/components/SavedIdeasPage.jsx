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

export default function SavedIdeasPage({ savedIdeas, onSelect }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Saved Ideas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Reports you&rsquo;ve saved for later.
          </p>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {savedIdeas.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            No saved ideas yet — open an analysis result and hit &ldquo;Save Report&rdquo; to keep
            it here.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_180px_140px_24px] gap-4 border-b border-gray-100 px-1 pb-3 text-xs font-medium tracking-wide text-gray-400">
              <span>IDEA</span>
              <span>RESULT</span>
              <span>SAVED ON</span>
              <span />
            </div>

            <ul>
              {savedIdeas.map((item) => {
                const Icon = ANALYSIS_ICONS[item.icon]
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(item)}
                      className="grid w-full grid-cols-[1fr_180px_140px_24px] items-center gap-4 border-b border-gray-50 px-1 py-4 text-left last:border-b-0 hover:bg-gray-50/60"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg}`}
                        >
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
          </>
        )}
      </section>
    </div>
  )
}
