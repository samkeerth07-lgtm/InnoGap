import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import FormField from './FormField'

export default function NewAnalysisPage({ onSubmit }) {
  const [problem, setProblem] = useState('')
  const [solution, setSolution] = useState('')

  const isValid = problem.trim().length > 0 && solution.trim().length > 0

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit?.({ problem: problem.trim(), solution: solution.trim() })
  }

  return (
    <div className="mx-auto max-w-3xl pb-8">
      <header className="mb-6">
        <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text)]">
          <span className="h-2 w-2 rounded-full bg-[var(--text)]" />
          Research workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">
          Start New Analysis
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text)]">
          Tell us your idea and we&rsquo;ll analyze existing solutions and find the gap.
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
        className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] backdrop-blur sm:p-7"
      >
        <div className="space-y-7">
          <FormField
            id="analysis-problem"
            label="Problem"
            hint="What problem are you trying to solve?"
            placeholder="Describe the problem clearly and briefly..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />

          <FormField
            id="analysis-solution"
            label="Proposed Solution"
            hint="How do you plan to solve this problem?"
            placeholder="Describe your proposed solution in detail..."
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
        </div>

        <div className="mt-7 flex justify-end border-t border-[var(--border)] pt-5">
        <button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${
            isValid
              ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-sm hover:brightness-95'
              : 'cursor-not-allowed bg-[var(--accent-disabled)] text-[var(--on-accent)]'
          }`}
        >
          Start Analysis
          <ArrowRight className="h-4 w-4" />
        </button>
        </div>
      </form>
    </div>
  )
}