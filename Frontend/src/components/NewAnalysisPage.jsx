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
        <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
          <span className="h-2 w-2 rounded-full bg-[#e6ff1f]" />
          Research workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#202426]">
          Start New Analysis
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Tell us your idea and we&rsquo;ll analyze existing solutions and find the gap.
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
        className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-[0_16px_40px_rgba(41,45,46,0.06)] backdrop-blur sm:p-7"
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

        <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${
            isValid
              ? 'bg-[#e6ff1f] text-[#202426] shadow-sm hover:bg-[#d9f216]'
              : 'cursor-not-allowed bg-slate-200 text-slate-500'
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