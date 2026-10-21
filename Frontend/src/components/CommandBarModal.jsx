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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close command bar"
        onClick={onClose}
        className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl z-10">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5">
          <Search className="h-5 w-5 text-[var(--muted)]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search past ideas, papers, or jump to an action..."
            className="w-full bg-transparent text-sm font-medium text-[var(--ink)] placeholder:text-[var(--muted)] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-full p-1 text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded bg-[var(--icon-tile)] px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--muted)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Quick Actions
              </p>
              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => handleAction(() => onNavigate('new-analysis'))}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[var(--ink)] hover:bg-[var(--icon-tile)] transition"
                >
                  <span className="flex items-center gap-2.5">
                    <PlusCircle className="h-4 w-4 text-[var(--accent)]" />
                    Start New Innovation Analysis
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAction(() => onNavigate('saved-ideas'))}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[var(--ink)] hover:bg-[var(--icon-tile)] transition"
                >
                  <span className="flex items-center gap-2.5">
                    <Bookmark className="h-4 w-4 text-[var(--muted)]" />
                    View Bookmarked Ideas
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                </button>
              </div>
            </div>
          )}

          {/* Past Analyses */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              {query ? 'Matching Analyses' : 'Recent Analyses'}
            </p>
            <div className="mt-1 space-y-1">
              {filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAction(() => onSelectAnalysis(item))}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs hover:bg-[var(--icon-tile)] transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <FileText className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                      <div className="truncate">
                        <span className="font-semibold text-[var(--ink)] block truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">
                          {item.date || 'Recent'} • {item.result || 'Analyzed'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[var(--muted)]">
                  No matching analyses found for "{query}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="border-t border-[var(--border)] bg-[var(--bg)]/50 px-4 py-2 text-[10px] text-[var(--muted)] flex items-center justify-between">
          <span>Tip: Use Cmd+K / Ctrl+K anywhere to launch</span>
          <span>InnoGap Intelligence</span>
        </div>
      </div>
    </div>
  )
}
