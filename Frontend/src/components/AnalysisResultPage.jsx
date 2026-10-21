import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Layers,
  Lightbulb,
  Printer,
  RefreshCw,
  Target,
  X,
} from 'lucide-react'

import { mockAnalysisResult } from '../analysisData'
import VerdictBadge from './VerdictBadge'

function getSimilarityLabel(similarity) {
  if (!similarity) return 'Related'
  if (typeof similarity === 'object' && similarity !== null) {
    return similarity.similarity || 'Related'
  }
  return String(similarity)
}

function EvidenceBadge({ label, active = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
          : 'bg-[var(--icon-tile)] text-[var(--muted)]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? 'bg-[var(--success-text)]' : 'bg-[var(--icon-decor)]'
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
  onPivot,
  initialSelectedSolution = null,
}) {
  const [selectedSolution, setSelectedSolution] = useState(initialSelectedSolution)
  const [copied, setCopied] = useState(false)

  const solutions = result.similarSolutions || []

  const getImplementationEvidence = (solution) => {
    const implementation = solution?.implementation || {}
    return {
      code: implementation.codeAvailable || Boolean(solution?.sourceUrl),
      runInstructions: implementation.runInstructionsAvailable || false,
      prototype: implementation.prototypeMentioned || false,
      demo: implementation.demoAvailable || false,
      deployment: implementation.deploymentMentioned || false,
    }
  }

  const handleCopySummary = () => {
    const markdown = `# InnoGap Analysis: ${result.title || 'Innovation Analysis'}
**Verdict:** ${result.overallResult || 'Analyzed'}
**Verdict Note:** ${result.overallResultNote || ''}

### Proposed Innovation
${result.proposed || ''}

### Innovation Gap
${result.potentialGap || ''}

### Executive Summary
${result.summary || ''}
`
    navigator.clipboard?.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-full pb-16 space-y-6">
      {/* Top Navigation & Action Suite */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--ink)] shadow-[var(--card-shadow)] transition hover:bg-[var(--icon-tile)] hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Markdown */}
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--icon-tile)] transition"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success-text)]" />
                Copied Markdown!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[var(--muted)]" />
                Copy Summary
              </>
            )}
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--icon-tile)] transition"
          >
            <Printer className="h-3.5 w-3.5 text-[var(--muted)]" />
            Print Report
          </button>

          {/* Pivot Idea Button */}
          {onPivot && (
            <button
              type="button"
              onClick={() => onPivot(result)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--icon-tile)] transition"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[var(--muted)]" />
              Pivot Idea
            </button>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={onSaveReport}
            disabled={isSaved}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold shadow-sm transition hover:-translate-y-0.5 ${
              isSaved
                ? 'border border-green-200 bg-[var(--success-bg)] text-[var(--success-text)]'
                : 'bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-95'
            }`}
          >
            {isSaved ? (
              <CheckCircle2 className="h-4 w-4 text-[var(--success-text)]" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isSaved ? 'Saved to Ideas' : 'Save Report'}
          </button>
        </div>
      </div>

      {/* Title & Status Header */}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--icon-tile)] px-3 py-1 text-[11px] font-bold text-[var(--ink)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success-text)]" />
            {result.status || 'Analysis Complete'}
          </span>
          <span className="text-xs font-semibold text-[var(--muted)]">
            Innovation Intelligence Brief
          </span>
        </div>

        <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          {result.title}
        </h1>

        <p className="mt-2.5 max-w-3xl text-sm leading-6 text-[var(--text)]">
          {result.description}
        </p>
      </div>

      {/* Hero: Executive Verdict */}
      <section className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--icon-tile)] blur-3xl opacity-70" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Executive Verdict
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
              {result.overallResult}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text)]">
              {result.overallResultNote}
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--card-shadow)]">
            <VerdictBadge
              value={result.overallResult}
              className="inline-flex rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* The Core Comparison: Your Proposed Approach vs The Potential Gap */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Your Proposed Approach */}
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--on-accent)] shadow-sm">
              <Lightbulb className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-base font-bold text-[var(--ink)]">
                Your Proposed Approach
              </h2>
              <p className="text-xs text-[var(--muted)]">
                User hypothesis
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-[var(--text)]">
            {result.proposed}
          </p>

          {result.existingTech?.length > 0 && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <p className="text-xs font-semibold text-[var(--muted)] mb-2">
                Core Technologies & Concepts:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.existingTech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-xl border border-[var(--border)] bg-[var(--icon-tile)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* The Innovation Gap (The Unsolved Opportunity) */}
        <div className="dark-surface rounded-[24px] border border-[var(--border)] bg-[var(--ink)] p-6 text-[var(--surface)] shadow-[var(--card-shadow)] flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ink-raised)] text-[var(--accent)]">
                <Target className="h-5 w-5" />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                  The Innovation Opportunity
                </p>
                <h2 className="text-base font-bold text-[var(--surface)]">
                  Identified Research Gap
                </h2>
              </div>
            </div>

            <p className="text-sm leading-7 text-[var(--dark-text)]">
              {result.potentialGap}
            </p>
          </div>

          {onPivot && (
            <div className="mt-6 border-t border-[var(--ink-raised)] pt-4">
              <button
                type="button"
                onClick={() => onPivot(result)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Want to tweak your angle? Pivot Idea & Re-Analyze →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Discovered Prior Art & Existing Solutions */}
      <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Discovered Prior Art
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--ink)] sm:text-2xl">
              Existing Solutions & Publications
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Ranked repositories and papers related to your proposed approach. Click any item to inspect details.
            </p>
          </div>

          {onViewAllSources && (
            <button
              type="button"
              onClick={onViewAllSources}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--icon-tile)]"
            >
              View all sources
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}
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
                  className="group w-full rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--muted)] hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden pt-1 text-xs font-bold text-[var(--muted)] sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <SourceIcon type={solution.type} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-bold text-[var(--ink)] transition group-hover:text-[var(--ink)]">
                            {solution.name}
                          </h3>

                          <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">
                            {solution.type}
                          </p>
                        </div>

                        <VerdictBadge
                          value={getSimilarityLabel(solution.similarity)}
                          className="inline-flex w-fit rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                        />
                      </div>

                      <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-[var(--text)]">
                        {solution.description ||
                          solution.solution ||
                          'No description available.'}
                      </p>

                      <div className="mt-3.5 flex flex-wrap gap-2">
                        <EvidenceBadge label="Source Code" active={evidence.code} />
                        <EvidenceBadge label="Run Instructions" active={evidence.runInstructions} />
                        <EvidenceBadge label="Prototype" active={evidence.prototype} />
                        <EvidenceBadge label="Demo" active={evidence.demo} />
                      </div>
                    </div>

                    <div className="hidden pt-2 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--ink)] sm:block">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
              <p className="text-sm font-semibold text-[var(--text)]">
                No similar solutions were found.
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Try another problem statement or proposed solution.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Executive Summary */}
      <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
            <FileText className="h-5 w-5" />
          </span>

          <div>
            <h3 className="text-base font-bold text-[var(--ink)]">
              Executive Summary
            </h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--text)]">
              {result.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Detail Slide-over Drawer */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close details"
            onClick={() => setSelectedSolution(null)}
            className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4 backdrop-blur">
              <p className="text-sm font-bold text-[var(--ink)]">
                Candidate Solution Details
              </p>

              <button
                type="button"
                onClick={() => setSelectedSolution(null)}
                className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--icon-tile)] hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <SourceIcon type={selectedSolution.type} />

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-[var(--ink)]">
                    {selectedSolution.name}
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                    {selectedSolution.type}
                  </p>

                  <VerdictBadge
                    value={getSimilarityLabel(selectedSolution.similarity)}
                    className="mt-3 inline-flex rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  What it does
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text)]">
                  {selectedSolution.description ||
                    selectedSolution.solution ||
                    'No detailed description available.'}
                </p>
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-6">
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  Implementation Evidence
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries({
                    'Source Code': getImplementationEvidence(selectedSolution).code,
                    'Run Instructions': getImplementationEvidence(selectedSolution).runInstructions,
                    Prototype: getImplementationEvidence(selectedSolution).prototype,
                    Demo: getImplementationEvidence(selectedSolution).demo,
                    Deployment: getImplementationEvidence(selectedSolution).deployment,
                  }).map(([label, active]) => (
                    <EvidenceBadge key={label} label={label} active={active} />
                  ))}
                </div>
              </div>

              {selectedSolution.technologies?.length > 0 && (
                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    Technologies
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSolution.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-xl border border-[var(--border)] bg-[var(--icon-tile)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(selectedSolution.similarity?.reason ||
                selectedSolution.reason ||
                selectedSolution.solution) && (
                <div className="mt-6 border-t border-[var(--border)] pt-6">
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    Why it matters (Competitive Overlap)
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text)]">
                    {selectedSolution.similarity?.reason ||
                      selectedSolution.reason ||
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
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--on-accent)] shadow-[var(--card-shadow)] transition hover:brightness-95"
                  >
                    Open Source Project / Paper
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
