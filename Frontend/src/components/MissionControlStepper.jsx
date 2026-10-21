import { useState, useEffect } from 'react'
import {
  Brain,
  Search,
  Scale,
  Sparkles,
  Loader2,
  CheckCircle2,
  Terminal,
} from 'lucide-react'

const STAGES = [
  {
    id: 1,
    title: 'Deconstructing Hypothesis',
    desc: 'Extracting domain entities, technical keywords, and search queries...',
    icon: Brain,
    durationMs: 8000,
  },
  {
    id: 2,
    title: 'Scanning Global Prior Art',
    desc: 'Querying GitHub repositories & OpenAlex academic paper indices...',
    icon: Search,
    durationMs: 14000,
  },
  {
    id: 3,
    title: 'Semantic Relevance Gate',
    desc: 'Evaluating functional problem alignment and filtering buzzwords...',
    icon: Scale,
    durationMs: 10000,
  },
  {
    id: 4,
    title: 'Synthesizing Innovation Gap',
    desc: 'Cross-analyzing implementations and compiling executive verdict...',
    icon: Sparkles,
    durationMs: 8000,
  },
]

export default function MissionControlStepper({ problem = '', solution = '' }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate realistic stage progression while analysis is in flight
  useEffect(() => {
    if (secondsElapsed > 26) setCurrentStageIndex(3)
    else if (secondsElapsed > 18) setCurrentStageIndex(2)
    else if (secondsElapsed > 7) setCurrentStageIndex(1)
    else setCurrentStageIndex(0)
  }, [secondsElapsed])

  const progressPercent = Math.min(95, Math.floor((secondsElapsed / 35) * 100))

  return (
    <div className="mx-auto max-w-3xl pb-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            Mission Control • Agentic AI Pipeline
          </span>
        </div>

        <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-mono font-bold text-[var(--ink)] shadow-sm">
          Elapsed: {String(Math.floor(secondsElapsed / 60)).padStart(2, '0')}:{String(secondsElapsed % 60).padStart(2, '0')}s
        </div>
      </div>

      {/* Main Terminal Card */}
      <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--ink)] px-6 py-4 text-[var(--surface)]">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[var(--accent)]" />
            <span className="font-mono text-xs font-semibold text-[var(--surface)]">
              innogap-orchestrator :: parallel-discovery
            </span>
          </div>

          <span className="rounded-full bg-[var(--ink-raised)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
            Live Execution
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[var(--icon-tile)]">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stepper Stages */}
        <div className="p-6 sm:p-8 space-y-6">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex
            const isCurrent = idx === currentStageIndex
            const isPending = idx > currentStageIndex
            const Icon = stage.icon

            return (
              <div
                key={stage.id}
                className={`flex items-start gap-4 transition-all duration-300 ${
                  isPending ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {/* Stage Icon Pin */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                    isCompleted
                      ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
                      : isCurrent
                      ? 'bg-[var(--accent)] text-[var(--on-accent)] ring-4 ring-[var(--accent-tint)] shadow-md'
                      : 'bg-[var(--icon-tile)] text-[var(--muted)]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Stage Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[var(--ink)]">
                      {stage.title}
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-[var(--muted)]">
                      {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Queued'}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[var(--text)]">
                    {stage.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Live Idea Under Investigation Footer */}
        <div className="border-t border-[var(--border)] bg-[var(--bg)]/50 p-5 px-6 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Investigating Idea:
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-[var(--ink)]">
            "{problem}"
          </p>
          {solution && (
            <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
              Proposed angle: "{solution}"
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
