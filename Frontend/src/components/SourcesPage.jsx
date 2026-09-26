import { useState, useMemo } from 'react'
import { ArrowLeft, Bell } from 'lucide-react'
import SourceListItem from './SourceListItem'
import SourceDetailPanel from './SourceDetailPanel'

export default function SourcesPage({
  sources = [],
  onBackToResults,
  onBackToSummary,
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  // Convert backend data into the format
  // expected by SourceListItem and SourceDetailPanel
  const formattedSources = useMemo(
    () =>
      sources.map((source) => ({
        id: source.id,

        name: source.name,

        icon: source.type === 'Research Paper' ? 'brain' : 'github',

        iconStyle:
          source.type === 'Research Paper'
            ? 'bg-violet-100 text-violet-700'
            : 'bg-gray-900 text-white',

        badge: source.type || 'GitHub',

        summary:
          source.solution ||
          source.description ||
          'No description available.',

        detail: {
          website: source.sourceUrl || '',
          sourceUrl: source.sourceUrl || '',
          description: source.description || '',

          fullDescription:
            source.description ||
            source.solution ||
            'No description available.',

          capabilities:
            source.capabilities || [],

          whatItDoes:
            source.whatItDoes || [],

          relevance:
            source.problem ||
            'This project is related to the problem being analyzed.',

          type: source.type,
          similarity: source.similarity || null,

          lastAccessed:
            'Just now',
        },
      })),
    [sources],
  )

  const filters = [
    {
      key: 'all',
      label: 'All Sources',
    },
    {
      key: 'github',
      label: 'GitHub',
    },
    {
      key: 'brain',
      label: 'Research Papers',
    },
  ]

  const filteredSources = useMemo(() => {
    if (activeFilter === 'all') {
      return formattedSources
    }

    return formattedSources.filter(
      (source) => source.icon === activeFilter,
    )
  }, [activeFilter, formattedSources])

  const selectedSource =
    formattedSources.find(
      (source) => source.id === selectedId,
    ) ??
    filteredSources[0] ??
    null

  const countFor = (key) => {
    if (key === 'all') {
      return formattedSources.length
    }

    return formattedSources.filter(
      (source) => source.icon === key,
    ).length
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}
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


      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Similar Existing Solutions
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        We found several existing solutions related to your idea.
        Here are the sources we analyzed:
      </p>


      {/* Filters */}
      <div className="my-6 flex flex-wrap gap-2">

        {filters.map(({ key, label }) => {

          const isActive =
            key === activeFilter

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


      {/* Sources */}
      <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-[1fr_1fr]">

        <div className="space-y-4">

          {filteredSources.length > 0 ? (

            filteredSources.map((source) => (

              <SourceListItem
                key={source.id}
                source={source}
                active={
                  source.id === selectedSource?.id
                }
                onClick={() =>
                  setSelectedId(source.id)
                }
              />

            ))

          ) : (

            <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
              No sources were found for this analysis.
            </div>

          )}

        </div>


        {/* Details */}
        <div className="lg:sticky lg:top-8 lg:self-start">

          {selectedSource && (
            <SourceDetailPanel
              source={selectedSource}
            />
          )}

        </div>

      </div>

    </div>
  )
}