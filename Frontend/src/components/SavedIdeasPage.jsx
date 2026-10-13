import { Bell, ChevronRight } from 'lucide-react'
import { ANALYSIS_ICONS } from './analysisIcons'
import VerdictBadge from './VerdictBadge'

export default function SavedIdeasPage({ savedIdeas, onSelect }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--ink)]">Saved Ideas</h1>
          <p className="mt-1 text-sm text-[var(--text)]">
            Reports you&rsquo;ve saved for later.
          </p>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--ink)]"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        {savedIdeas.length === 0 ? (
          <p className="py-10 text-center text-sm text-[var(--text)]">
            No saved ideas yet — open an analysis result and hit &ldquo;Save Report&rdquo; to keep
            it here.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_180px_140px_24px] gap-4 border-b border-[var(--border)] px-1 pb-3 text-xs font-medium tracking-wide text-[var(--muted)]">
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
                      className="grid w-full grid-cols-[1fr_180px_140px_24px] items-center gap-4 border-b border-[var(--border)] px-1 py-4 text-left last:border-b-0 hover:bg-[var(--surface)]"
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
                      <ChevronRight className="h-4 w-4 text-[var(--muted)]" />
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
