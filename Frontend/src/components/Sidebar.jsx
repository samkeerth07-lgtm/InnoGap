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
    <aside className="relative z-20 flex h-[72px] w-full shrink-0 items-center justify-between border-b border-white/70 bg-white/45 px-3 backdrop-blur-xl sm:px-6">
      {/* Brand */}
      <div className="shrink-0 px-1">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292d2e] shadow-sm">
            <Lightbulb
              className="h-5 w-5 text-[#e6ff1f]"
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">
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

        <nav className="flex items-center gap-1 overflow-x-auto rounded-full bg-[#292d2e] p-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = key === active

            return (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => onNavigate?.(key)}
                className={`group flex shrink-0 items-center gap-2 rounded-full px-2.5 py-2 text-left text-xs font-semibold transition-all duration-200 sm:px-4 ${
                  isActive
                    ? 'bg-[#e6ff1f] text-[#202426] shadow-sm'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    isActive
                      ? 'text-[#202426]'
                      : 'text-white/60 group-hover:text-white'
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
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Manage
          </p>

          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 group-hover:text-slate-700">
              <Settings className="h-[17px] w-[17px]" />
            </span>
            Settings
          </button>
        </div>
      </div>

      {/* Bottom identity block */}
      <div className="shrink-0 border-l border-white/70 pl-2 sm:pl-5">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-1.5 text-left transition hover:bg-white/50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9e4ff] text-xs font-bold text-slate-800">
            A
          </span>

          <span className="min-w-0 flex-1">
            <span className="hidden truncate text-sm font-semibold text-slate-900 sm:block">
              Ananya R.
            </span>
            <span className="hidden text-xs text-slate-400 sm:block">
              Student
            </span>
          </span>

          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </button>

        
      </div>
    </aside>
  )
}