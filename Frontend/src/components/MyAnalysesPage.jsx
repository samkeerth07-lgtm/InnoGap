import { Bell, ChevronRight } from 'lucide-react'
import { ANALYSIS_ICONS } from './analysisIcons'
import VerdictBadge from './VerdictBadge'

export default function MyAnalysesPage({ analyses, onSelect }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="dark-surface mb-6 flex items-start justify-between rounded-[24px] bg-[var(--ink)] px-5 py-5 text-[var(--surface)] shadow-[var(--card-shadow)] sm:px-6">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            Analysis library
          </p>
          <h1 className="text-2xl font-semibold text-[var(--surface)]">My Analyses</h1>
          <p className="mt-1 text-sm text-[var(--dark-text)]">
            Every idea you&rsquo;ve analyzed, most recent first.
          </p>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-[var(--dark-text)] transition-colors hover:bg-[var(--ink-raised)] hover:text-[var(--surface)]"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] sm:p-6">
        {analyses.length === 0 ? (
          <p className="py-10 text-center text-sm text-[var(--text)]">
            You haven&rsquo;t analyzed any ideas yet — start one from the dashboard.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_180px_120px_24px] gap-4 border-b border-[var(--border)] px-1 pb-3 text-xs font-semibold tracking-wide text-[var(--muted)]">
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
                      className="group grid w-full grid-cols-[1fr_180px_120px_24px] items-center gap-4 border-b border-[var(--border)] px-1 py-4 text-left transition-colors last:border-b-0 hover:bg-[var(--surface)]"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg}`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-sm font-medium text-[var(--ink)]">{item.title}</span>
                      </span>
                      <VerdictBadge value={item.result} className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold" />
                      <span className="text-sm text-[var(--muted)]">{item.date}</span>
                      <ChevronRight className="h-4 w-4 text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]" />
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
