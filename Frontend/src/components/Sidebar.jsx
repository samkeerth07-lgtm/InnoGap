import { Lightbulb, LayoutGrid, CirclePlus, FileText, Bookmark, ChevronDown } from 'lucide-react'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'new-analysis', label: 'New Analysis', icon: CirclePlus },
  { key: 'my-analyses', label: 'My Analyses', icon: FileText },
  { key: 'saved-ideas', label: 'Saved Ideas', icon: Bookmark },
]

export default function Sidebar({ active = 'dashboard', onNavigate }) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-gray-100 bg-white px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <Lightbulb className="h-6 w-6 text-blue-600" strokeWidth={2} />
          <div>
            <p className="text-lg font-semibold text-gray-900 leading-tight">InnoGap</p>
            <p className="text-xs text-gray-400 leading-tight">Find gaps. Build impact.</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = key === active
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate?.(key)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                {label}
              </button>
            )
          })}
        </nav>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 rounded-lg border-t border-gray-100 px-2 pt-4 text-left"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-sm font-semibold text-white">
          A
        </span>
        <span className="flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Ananya R.</p>
          <p className="text-xs text-gray-400 leading-tight">Student</p>
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>
    </aside>
  )
}
