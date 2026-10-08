import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Github,
  Lightbulb,
  Layers,
  Search,
  X,
} from 'lucide-react'

import { mockAnalysisResult } from '../analysisData'

function EvidenceBadge({ label, active = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? 'bg-emerald-500' : 'bg-gray-300'
        }`}
      />
      {label}
    </span>
  )
}

function SourceIcon({ type }) {
  const normalized = (type || '').toLowerCase()

  if (
    normalized.includes('github') ||
    normalized.includes('open source')
  ) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
        <Github className="h-5 w-5" />
      </div>
    )
  }

  if (
    normalized.includes('paper') ||
    normalized.includes('research')
  ) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <FileText className="h-5 w-5" />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
      <Layers className="h-5 w-5" />
    </div>
  )
}

export default function AnalysisResultPage({
  result = mockAnalysisResult,
  onBack,
  onViewAllSources,
  isSaved = false,
  onSaveReport,
}) {
  const [selectedSolution, setSelectedSolution] = useState(null)

  const solutions = result.similarSolutions || []

  const evidenceStats = useMemo(() => {
    let research = 0
    let github = 0
    let prototypes = 0
    let demos = 0

    solutions.forEach((solution) => {
      const type = (solution.type || '').toLowerCase()
      const implementation = solution.implementation || {}

      if (type.includes('research') || type.includes('paper')) {
        research += 1
      }

      if (
        type.includes('github') ||
        type.includes('open source')
      ) {
        github += 1
      }

      if (
        implementation.prototypeMentioned ||
        type.includes('prototype')
      ) {
        prototypes += 1
      }

      if (implementation.demoAvailable) {
        demos += 1
      }
    })

    return {
      research,
      github,
      prototypes,
      demos,
    }
  }, [solutions])

  const getSimilarityStyle = (similarity) => {
    const value = (similarity || '').toLowerCase()

    if (value === 'high') {
      return 'bg-red-50 text-red-700 border-red-100'
    }

    if (value === 'medium') {
      return 'bg-amber-50 text-amber-700 border-amber-100'
    }

    return 'bg-gray-50 text-gray-600 border-gray-100'
  }

  const getImplementationEvidence = (solution) => {
    const implementation = solution?.implementation || {}

    return {
      code:
        implementation.codeAvailable ||
        Boolean(solution?.sourceUrl),
      runInstructions:
        implementation.runInstructionsAvailable || false,
      prototype:
        implementation.prototypeMentioned || false,
      demo:
        implementation.demoAvailable || false,
      deployment:
        implementation.deploymentMentioned || false,
    }
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        <button
          type="button"
          className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 md:flex"
          onClick={onSaveReport}
          disabled={isSaved}
        >
          {isSaved ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isSaved ? 'Saved' : 'Save Report'}
        </button>
      </div>

      {/* Page heading */}
      <div className="mb-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {result.status || 'Analysis Complete'}
          </span>

          <span className="text-xs text-gray-400">
            Innovation analysis
          </span>
        </div>

        <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-gray-950">
          {result.title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
          {result.description}
        </p>
      </div>

      {/* Main result */}
      <section className="mb-6 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                Overall result
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
                {result.overallResult}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                {result.overallResultNote}
              </p>
            </div>

            <div className="flex h-20 min-w-20 items-center justify-center rounded-2xl border border-white bg-white px-5 shadow-sm">
              <span className="text-center text-sm font-semibold text-blue-700">
                {result.overallResult}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Your approach vs existing */}
      <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Lightbulb className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-semibold text-gray-950">
                Your Approach
              </h2>
              <p className="text-xs text-gray-400">
                What you proposed
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-gray-600">
            {result.proposed}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Search className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-semibold text-gray-950">
                What Already Exists
              </h2>
              <p className="text-xs text-gray-400">
                Technologies and approaches discovered
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {result.existingTech?.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Potential gap */}
      <section className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 md:p-7">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <Layers className="h-5 w-5" />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              The important part
            </p>

            <h2 className="text-xl font-semibold text-gray-950">
              Potential Gap
            </h2>
          </div>
        </div>

        <p className="max-w-4xl text-sm leading-7 text-gray-700">
          {result.potentialGap}
        </p>
      </section>

      {/* Evidence overview */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-950">
            Evidence Found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Different types of evidence discovered during the analysis.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-medium text-gray-500">
              Research Papers
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">
              {evidenceStats.research}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-medium text-gray-500">
              Open Source
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">
              {evidenceStats.github}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-medium text-gray-500">
              Prototypes
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">
              {evidenceStats.prototypes}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-medium text-gray-500">
              Demos
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">
              {evidenceStats.demos}
            </p>
          </div>
        </div>
      </section>

      {/* Existing solutions */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Discovery
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-950">
              Existing Solutions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Ranked results related to your proposed approach.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllSources}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            View all sources
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {solutions.length > 0 ? (
            solutions.map((solution, index) => {
              const evidence = getImplementationEvidence(solution)

              return (
                <button
                  key={solution.id}
                  type="button"
                  onClick={() => setSelectedSolution(solution)}
                  className="group w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden pt-1 text-xs font-semibold text-gray-300 sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <SourceIcon type={solution.type} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 transition group-hover:text-blue-700">
                            {solution.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {solution.type}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getSimilarityStyle(
                            solution.similarity
                          )}`}
                        >
                          {solution.similarity || 'Related'}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-gray-600">
                        {solution.description ||
                          solution.solution ||
                          'No description available.'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <EvidenceBadge
                          label="Source Code"
                          active={evidence.code}
                        />

                        <EvidenceBadge
                          label="Run Instructions"
                          active={evidence.runInstructions}
                        />

                        <EvidenceBadge
                          label="Prototype"
                          active={evidence.prototype}
                        />

                        <EvidenceBadge
                          label="Demo"
                          active={evidence.demo}
                        />
                      </div>
                    </div>

                    <div className="hidden pt-2 text-gray-300 transition group-hover:text-blue-500 sm:block">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <p className="text-sm font-medium text-gray-600">
                No similar solutions were found.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Try another problem statement or proposed solution.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Summary */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-4 w-4" />
          </span>

          <div>
            <h3 className="font-semibold text-gray-950">
              Summary
            </h3>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-600">
              {result.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Mobile save button */}
      <div className="mb-6 md:hidden">
        <button
          type="button"
          onClick={onSaveReport}
          disabled={isSaved}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium ${
            isSaved
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}

          {isSaved ? 'Saved' : 'Save Report'}
        </button>
      </div>

      {/* Detail drawer */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close details"
            onClick={() => setSelectedSolution(null)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-gray-200 bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur">
              <p className="text-sm font-semibold text-gray-900">
                Solution Details
              </p>

              <button
                type="button"
                onClick={() => setSelectedSolution(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <SourceIcon type={selectedSolution.type} />

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-gray-950">
                    {selectedSolution.name}
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {selectedSolution.type}
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getSimilarityStyle(
                      selectedSolution.similarity
                    )}`}
                  >
                    {selectedSolution.similarity} similarity
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  What it does
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {selectedSolution.description ||
                    selectedSolution.solution ||
                    'No detailed description available.'}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Implementation Evidence
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries({
                    'Source Code':
                      getImplementationEvidence(selectedSolution).code,
                    'Run Instructions':
                      getImplementationEvidence(selectedSolution)
                        .runInstructions,
                    Prototype:
                      getImplementationEvidence(selectedSolution).prototype,
                    Demo:
                      getImplementationEvidence(selectedSolution).demo,
                    Deployment:
                      getImplementationEvidence(selectedSolution)
                        .deployment,
                  }).map(([label, active]) => (
                    <EvidenceBadge
                      key={label}
                      label={label}
                      active={active}
                    />
                  ))}
                </div>
              </div>

              {selectedSolution.whatItDoes?.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    What it does
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {selectedSolution.whatItDoes.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-gray-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSolution.technologies?.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Technologies
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSolution.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(selectedSolution.reason ||
                selectedSolution.solution) && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Why it matters
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {selectedSolution.reason ||
                      selectedSolution.solution}
                  </p>
                </div>
              )}

              {selectedSolution.sourceUrl && (
                <div className="mt-8">
                  <a
                    href={selectedSolution.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Open Source
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}