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
import VerdictBadge from './VerdictBadge'

function EvidenceBadge({ label, active = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
          : 'bg-[var(--icon-tile)] text-[var(--text)]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? 'bg-[var(--success-text)]' : 'bg-[var(--muted)]'
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
        <Github className="h-5 w-5" />
      </div>
    )
  }

  if (
    normalized.includes('paper') ||
    normalized.includes('research')
  ) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
        <FileText className="h-5 w-5" />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
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
          className="group flex items-center gap-2 text-sm font-medium text-[var(--text)] transition hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        <button
          type="button"
          className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] shadow-sm transition hover:border-[var(--border)] hover:bg-[var(--bg)] md:flex"
          onClick={onSaveReport}
          disabled={isSaved}
        >
          {isSaved ? (
            <CheckCircle2 className="h-4 w-4 text-[var(--success-text)]" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isSaved ? 'Saved' : 'Save Report'}
        </button>
      </div>

      {/* Page heading */}
      <div className="mb-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--icon-tile)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {result.status || 'Analysis Complete'}
          </span>

          <span className="text-xs text-[var(--text)]">
            Innovation analysis
          </span>
        </div>

        <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-[var(--ink)]">
          {result.title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text)]">
          {result.description}
        </p>
      </div>

      {/* Main result */}
      <section className="mb-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Overall result
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {result.overallResult}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text)]">
                {result.overallResultNote}
              </p>
            </div>

            <div className="flex h-20 min-w-20 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 shadow-[var(--card-shadow)]">
              <VerdictBadge value={result.overallResult} className="text-center text-sm font-semibold" />
            </div>
          </div>
        </div>
      </section>

      {/* Your approach vs existing */}
      <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
              <Lightbulb className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-semibold text-[var(--ink)]">
                Your Approach
              </h2>
              <p className="text-xs text-[var(--muted)]">
                What you proposed
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-[var(--text)]">
            {result.proposed}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
              <Search className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-semibold text-[var(--ink)]">
                What Already Exists
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Technologies and approaches discovered
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {result.existingTech?.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-[var(--border)] bg-[var(--icon-tile)] px-3 py-1.5 text-xs font-medium text-[var(--ink)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Potential gap */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] md:p-7">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
            <Layers className="h-5 w-5" />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              The important part
            </p>

            <h2 className="text-xl font-semibold text-[var(--ink)]">
              Potential Gap
            </h2>
          </div>
        </div>

        <p className="max-w-4xl text-sm leading-7 text-[var(--text)]">
          {result.potentialGap}
        </p>
      </section>

      {/* Evidence overview */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[var(--ink)]">
            Evidence Found
          </h2>

          <p className="mt-1 text-sm text-[var(--text)]">
            Different types of evidence discovered during the analysis.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
            <p className="text-xs font-medium text-[var(--muted)]">
              Research Papers
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
              {evidenceStats.research}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
            <p className="text-xs font-medium text-[var(--muted)]">
              Open Source
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
              {evidenceStats.github}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
            <p className="text-xs font-medium text-[var(--muted)]">
              Prototypes
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
              {evidenceStats.prototypes}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
            <p className="text-xs font-medium text-[var(--muted)]">
              Demos
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
              {evidenceStats.demos}
            </p>
          </div>
        </div>
      </section>

      {/* Existing solutions */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Discovery
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
              Existing Solutions
            </h2>

            <p className="mt-1 text-sm text-[var(--text)]">
              Ranked results related to your proposed approach.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllSources}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink)] transition hover:text-[var(--text)]"
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
                  className="group w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition hover:border-[var(--border)] hover:bg-[var(--bg)] hover:shadow-[var(--card-shadow)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden pt-1 text-xs font-semibold text-[var(--muted)] sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <SourceIcon type={solution.type} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-semibold text-[var(--ink)] transition group-hover:text-[var(--ink)]">
                            {solution.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-[var(--muted)]">
                            {solution.type}
                          </p>
                        </div>

                        <VerdictBadge
                          value={solution.similarity || 'Related'}
                          className="inline-flex w-fit rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
                        />
                      </div>

                      <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-[var(--text)]">
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

                    <div className="hidden pt-2 text-[var(--muted)] transition group-hover:text-[var(--ink)] sm:block">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
              <p className="text-sm font-medium text-[var(--text)]">
                No similar solutions were found.
              </p>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Try another problem statement or proposed solution.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Summary */}
      <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
            <FileText className="h-4 w-4" />
          </span>

          <div>
            <h3 className="font-semibold text-[var(--ink)]">
              Summary
            </h3>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--text)]">
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
              ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
              : 'dark-surface bg-[var(--ink)] text-[var(--surface)] hover:bg-[var(--ink-raised)]'
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
            className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4 backdrop-blur">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Solution Details
              </p>

              <button
                type="button"
                onClick={() => setSelectedSolution(null)}
                className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--bg)] hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <SourceIcon type={selectedSolution.type} />

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-[var(--ink)]">
                    {selectedSolution.name}
                  </h2>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {selectedSolution.type}
                  </p>

                  <VerdictBadge
                    value={selectedSolution.similarity || 'Related'}
                    className="mt-3 inline-flex rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
                  What it does
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--text)]">
                  {selectedSolution.description ||
                    selectedSolution.solution ||
                    'No detailed description available.'}
                </p>
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <h3 className="text-sm font-semibold text-[var(--ink)]">
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
                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    What it does
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {selectedSolution.whatItDoes.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-[var(--text)]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--muted)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSolution.technologies?.length > 0 && (
                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    Technologies
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSolution.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-[var(--border)] bg-[var(--icon-tile)] px-3 py-1.5 text-xs font-medium text-[var(--ink)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(selectedSolution.reason ||
                selectedSolution.solution) && (
                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    Why it matters
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--text)]">
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
                    className="dark-surface flex items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--surface)] transition hover:bg-[var(--ink-raised)]"
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