import {
  LayoutGrid,
  CirclePlus,
  FileText,
  Bookmark,
  ChevronDown,
  Settings,
  Lightbulb,
} from 'lucide-react'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'new-analysis', label: 'New Analysis', icon: CirclePlus },
  { key: 'my-analyses', label: 'My Analyses', icon: FileText },
  { key: 'saved-ideas', label: 'Saved Ideas', icon: Bookmark },
]

export default function Sidebar({
  active = 'dashboard',
  onNavigate,
}) {
  return (
    <aside className="relative z-20 flex h-[72px] w-full shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-3 backdrop-blur-xl sm:px-6">
      {/* Brand */}
      <div className="shrink-0 px-1">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ink)] shadow-sm">
            <Lightbulb
              className="h-5 w-5 text-[var(--accent)]"
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-[var(--ink)]">
              InnoGap
            </p>
            
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex min-w-0 flex-1 items-center justify-center px-2">
        <p className="hidden">
          Workspace
        </p>

        <nav className="dark-surface flex items-center gap-1 overflow-x-auto rounded-full bg-[var(--ink)] p-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = key === active

            return (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => onNavigate?.(key)}
                className={`group flex shrink-0 items-center gap-1 rounded-full px-2.5 py-2 text-left text-xs font-semibold transition-all duration-200 sm:px-4 ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-sm'
                    : 'text-[var(--dark-text)] hover:bg-[var(--ink-raised)] hover:text-[var(--surface)]'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    isActive
                      ? 'text-[var(--on-accent)]'
                      : 'text-[var(--icon-decor)] group-hover:text-[var(--surface)]'
                  }`}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={1.9}
                  />
                </span>

                <span className="sr-only lg:not-sr-only lg:flex-1">{label}</span>

                {isActive && <span className="sr-only">Current page</span>}
              </button>
            )
          })}
        </nav>

        <div className="hidden">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
            Manage
          </p>

          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg)] hover:text-[var(--ink)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] group-hover:text-[var(--ink)]">
              <Settings className="h-[17px] w-[17px]" />
            </span>
            Settings
          </button>
        </div>
      </div>

      {/* Bottom identity block */}
      <div className="shrink-0 border-l border-[var(--border)] pl-2 sm:pl-5">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-1.5 text-left transition hover:bg-[var(--bg)]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--icon-tile)] text-xs font-bold text-[var(--ink)]">
            U
          </span>

          <span className="min-w-0 flex-1">
            <span className="hidden truncate text-sm font-semibold text-[var(--ink)] sm:block">
              User
            </span>
            
          </span>

          <ChevronDown className="hidden h-4 w-4 text-[var(--muted)] sm:block" />
        </button>

        
      </div>
    </aside>
  )
}