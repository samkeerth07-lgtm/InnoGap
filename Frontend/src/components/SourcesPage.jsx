import { useState, useMemo } from 'react'
import { ArrowLeft, Bell } from 'lucide-react'
import SourceListItem from './SourceListItem'
import SourceDetailPanel from './SourceDetailPanel'
import { sources, sourceFilters } from '../sourcesData'

export default function SourcesPage({ onBackToResults, onBackToSummary }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(sources[0].id)

  const filteredSources = useMemo(
    () =>
      activeFilter === 'all' ? sources : sources.filter((s) => s.category === activeFilter),
    [activeFilter],
  )

  const selectedSource =
    sources.find((s) => s.id === selectedId) ?? filteredSources[0] ?? sources[0]

  const countFor = (key) =>
    key === 'all' ? sources.length : sources.filter((s) => s.category === key).length

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={onBackToResults}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToSummary}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Summary
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">Similar Existing Solutions</h1>
      <p className="mt-1 text-sm text-gray-500">
        We found several existing solutions related to your idea. Here are the sources we
        analyzed:
      </p>

      <div className="my-6 flex flex-wrap gap-2">
        {sourceFilters.map(({ key, label }) => {
          const isActive = key === activeFilter
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label} ({countFor(key)})
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          {filteredSources.map((source) => (
            <SourceListItem
              key={source.id}
              source={source}
              active={source.id === selectedSource.id}
              onClick={() => setSelectedId(source.id)}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <SourceDetailPanel source={selectedSource} />
        </div>
      </div>
    </div>
  )
}
