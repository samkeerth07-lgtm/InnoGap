import { useState, useEffect } from 'react'
import {
  ArrowRight,
  AlertCircle,
  Sparkles,
  Layers,
  Wand2,
} from 'lucide-react'
import FormField from './FormField'
import MissionControlStepper from './MissionControlStepper'

const QUICK_TEMPLATES = [
  {
    label: 'Smart Street Lighting',
    problem: 'Excessive energy waste in urban and municipal street lighting during low-traffic night hours.',
    solution: 'Deploy dynamic IoT mesh dimming sensors on lamps with LoRaWAN communication to illuminate only when motion is detected.',
    domain: 'IoT & Smart Cities',
  },
  {
    label: 'Smart Hydration Bottle',
    problem: 'Office workers and athletes chronically fail to maintain healthy daily hydration habits without tedious manual tracking apps.',
    solution: 'A smart water bottle with an ultrasonic fluid-level sensor integrated into the cap that vibrates when hydration is needed.',
    domain: 'Consumer Hardware',
  },
  {
    label: 'Autonomous Indoor Object Bot',
    problem: 'Elderly individuals and visually impaired persons struggle to locate misplaced household objects like keys and glasses.',
    solution: 'An affordable compact mobile robot with computer vision that maps rooms and fetches misplaced household items without requiring RFID tags.',
    domain: 'Robotics & Vision',
  },
]

const DOMAIN_CHIPS = [
  'Robotics',
  'IoT & Embedded',
  'AI / Machine Learning',
  'Climate & Energy',
  'Healthcare & Biotech',
  'Smart City',
  'Developer Tools',
]

export default function NewAnalysisPage({
  onSubmit,
  isAnalyzing = false,
  error = null,
  onClearError,
  initialProblem = '',
  initialSolution = '',
}) {
  const [problem, setProblem] = useState(initialProblem)
  const [solution, setSolution] = useState(initialSolution)
  const [selectedDomain, setSelectedDomain] = useState('')

  useEffect(() => {
    if (initialProblem) setProblem(initialProblem)
    if (initialSolution) setSolution(initialSolution)
  }, [initialProblem, initialSolution])

  const isValid = problem.trim().length > 0 && solution.trim().length > 0

  const handleSubmit = () => {
    if (!isValid || isAnalyzing) return
    onClearError?.()
    onSubmit?.({
      problem: problem.trim(),
      solution: solution.trim(),
      domain: selectedDomain,
    })
  }

  const applyTemplate = (template) => {
    onClearError?.()
    setProblem(template.problem)
    setSolution(template.solution)
    setSelectedDomain(template.domain)
  }

  // If analysis is in-flight, show the Mission Control Stepper
  if (isAnalyzing) {
    return <MissionControlStepper problem={problem} solution={solution} />
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      {/* Header */}
      <header className="mb-6">
        <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          Smart Idea Canvas
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          Start New Innovation Analysis
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text)]">
          Define your innovation hypothesis. InnoGap will scan academic literature, explore open-source repositories, and identify your technical gap.
        </p>
      </header>

      {/* Quick 1-Click Templates */}
      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--ink)] mb-2.5">
          <Wand2 className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>Quick Test Ideas (Click to auto-fill):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.label}
              type="button"
              onClick={() => applyTemplate(tmpl)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--icon-tile)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--accent-tint)] hover:border-[var(--ink)] transition"
            >
              <Sparkles className="h-3 w-3 text-[var(--muted)]" />
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1 text-sm leading-6">
            <p className="font-semibold">Analysis Failed</p>
            <p className="mt-1 text-xs opacity-90">{error}</p>
          </div>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              className="text-xs font-semibold hover:underline"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Main Canvas Form */}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
        className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] backdrop-blur sm:p-8"
      >
        <div className="space-y-6">
          {/* Domain Tags Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block mb-2">
              Optional Domain Focus
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DOMAIN_CHIPS.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setSelectedDomain(selectedDomain === dom ? '' : dom)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    selectedDomain === dom
                      ? 'bg-[var(--ink)] text-[var(--surface)] shadow-sm'
                      : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--icon-tile)]'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          <FormField
            id="analysis-problem"
            label="Problem Statement"
            hint="What core problem, friction, or inefficiency are you trying to solve?"
            placeholder="e.g. Existing solar streetlights operate on static schedules rather than traffic patterns, wasting massive grid power..."
            value={problem}
            disabled={isAnalyzing}
            onChange={(e) => {
              setProblem(e.target.value)
              if (error) onClearError?.()
            }}
          />

          <FormField
            id="analysis-solution"
            label="Your Proposed Solution"
            hint="How do you plan to solve this? Mention hardware, sensors, algorithms, or unique architecture."
            placeholder="e.g. Install LoRaWAN-connected PIR mesh sensors on poles that dynamically dim lamps to 20% and illuminate to 100% when pedestrians or vehicles approach..."
            value={solution}
            disabled={isAnalyzing}
            onChange={(e) => {
              setSolution(e.target.value)
              if (error) onClearError?.()
            }}
          />
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[var(--muted)]">
            {isValid ? 'Ready to launch multi-agent research scan.' : 'Enter both Problem and Solution to start.'}
          </p>

          <button
            type="submit"
            disabled={!isValid || isAnalyzing}
            aria-disabled={!isValid || isAnalyzing}
            className={`flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold shadow-md transition-all ${
              isValid && !isAnalyzing
                ? 'bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-95 hover:-translate-y-0.5'
                : 'cursor-not-allowed bg-[var(--accent-disabled)] text-[var(--on-accent)] opacity-50'
            }`}
          >
            Launch Investigation
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
