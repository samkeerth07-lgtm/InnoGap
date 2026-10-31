import { useState, useEffect } from 'react'
import {
  Search,
  PlusCircle,
  Bookmark,
  FileText,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export default function CommandBarModal({
  isOpen,
  onClose,
  analyses = [],
  onSelectAnalysis,
  onNavigate,
}) {
  const [query, setQuery] = useState('')

  // Close on Escape, toggle on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose?.()
        else onNavigate?.('command-bar-toggle')
      }
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNavigate])

  if (!isOpen) return null

  const filteredAnalyses = query.trim()
    ? analyses.filter((a) =>
        (a.title || '').toLowerCase().includes(query.toLowerCase()) ||
        (a.problemStatement || '').toLowerCase().includes(query.toLowerCase())
      )
    : analyses.slice(0, 4)

  const handleAction = (callback) => {
    onClose?.()
    callback?.()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] p-3 backdrop-blur-md sm:p-6">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close command bar"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="relative z-10 flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:max-h-[calc(100vh-3rem)]"
      >
        <div className="border-b border-[var(--border)] px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--on-accent)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  InnoGap workspace
                </p>
                <h2 id="search-dialog-title" className="mt-1 text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
                  Search your ideas
                </h2>
                <p className="mt-1 text-xs leading-5 text-[var(--text)] sm:text-sm">
                  Find an analysis or jump back into your workspace.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--icon-tile)] hover:text-[var(--ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 transition focus-within:border-[var(--ink)] focus-within:ring-2 focus-within:ring-[var(--ink)]/10">
            <Search className="h-5 w-5 shrink-0 text-[var(--muted)]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search analyses by title or idea..."
              aria-label="Search analyses"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus-visible:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="rounded-full p-1 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                Quick Actions
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleAction(() => onNavigate('new-analysis'))}
                  className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-tint)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--on-accent)]">
                    <PlusCircle className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[var(--ink)]">Start a new analysis</span>
                    <span className="mt-1 block text-[11px] leading-4 text-[var(--text)]">Explore an idea for innovation gaps</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAction(() => onNavigate('saved-ideas'))}
                  className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] p-3 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-tint)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
                    <Bookmark className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[var(--ink)]">View saved ideas</span>
                    <span className="mt-1 block text-[11px] leading-4 text-[var(--text)]">Return to reports you bookmarked</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
                </button>
              </div>
            </div>
          )}

          {/* Past Analyses */}
          <div>
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                {query ? 'Matching analyses' : 'Recent analyses'}
              </p>
              {filteredAnalyses.length > 0 && (
                <span className="text-[11px] text-[var(--muted)]">
                  {filteredAnalyses.length} {filteredAnalyses.length === 1 ? 'result' : 'results'}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAction(() => onSelectAnalysis(item))}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition hover:border-[var(--border)] hover:bg-[var(--bg)] sm:px-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[var(--ink)]">
                          {item.title}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[var(--text)]">
                        {item.date || 'Recent'} <span aria-hidden="true">·</span> {item.result || 'Analyzed'}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-10 text-center">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--icon-tile)] text-[var(--muted)]">
                    <Search className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
                    {query ? 'No matching analyses' : 'No analyses yet'}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text)]">
                    {query
                      ? <>Try another search for <span className="font-semibold text-[var(--ink)]">“{query}”</span>.</>
                      : 'Start a new analysis and your ideas will show up here.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
