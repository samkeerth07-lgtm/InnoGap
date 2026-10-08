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
    <aside className="flex h-screen w-[250px] shrink-0 flex-col border-r border-slate-200/80 bg-white">
      {/* Brand */}
      <div className="px-5 pb-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-200">
            <Lightbulb
              className="h-5 w-5 text-white"
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              InnoGap
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              Innovation intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = key === active

            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate?.(key)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                >
                  <Icon
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.9}
                  />
                </span>

                <span className="flex-1">{label}</span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Secondary navigation */}
        <div className="mt-8">
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
      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            A
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-900">
              Ananya R.
            </span>
            <span className="block text-xs text-slate-400">
              Student
            </span>
          </span>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        <div className="mt-3 rounded-xl bg-blue-50 px-3 py-3">
          <p className="text-[11px] font-semibold leading-4 text-blue-700">
            Find what already exists.
          </p>
          <p className="text-[11px] leading-4 text-blue-500">
            Build what doesn't.
          </p>
        </div>
      </div>
    </aside>
  )
}