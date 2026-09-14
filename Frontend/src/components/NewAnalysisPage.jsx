import { useState } from 'react'
import { Bell, ArrowRight } from 'lucide-react'
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Start New Analysis</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tell us your idea and we&rsquo;ll analyze existing solutions and find the gap.
          </p>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
 
      <hr className="mb-8 border-gray-100" />
 
      <div className="space-y-8">
        <FormField
          label="Problem"
          hint="What problem are you trying to solve?"
          placeholder="Describe the problem clearly and briefly..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
 
        <FormField
          label="Proposed Solution"
          hint="How do you plan to solve this problem?"
          placeholder="Describe your proposed solution in detail..."
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
      </div>
 
      <hr className="my-8 border-gray-100" />
 
      <div className="flex justify-end pb-10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          aria-disabled={!isValid}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          Start Analysis
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}