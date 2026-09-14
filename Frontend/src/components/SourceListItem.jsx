import { ChevronRight } from 'lucide-react'
import SourceIcon from './SourceIcon'
import { badgeClass } from '../sourcesData'

export default function SourceListItem({ source, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
        active ? 'border-blue-300 bg-blue-50/60' : 'border-gray-100 bg-white hover:bg-gray-50'
      }`}
    >
      <SourceIcon icon={source.icon} style={source.iconStyle} className="h-10 w-10" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{source.name}</p>
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass(source.badge)}`}>
            {source.badge}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">{source.summary}</p>
      </div>

      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-300" />
    </button>
  )
}
