import { ArrowRight } from 'lucide-react'

export default function StartAnalysisCard({ onStart }) {
  return (
    <section className="mb-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Start a new analysis</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your problem and proposed solution to begin.
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Start Analysis
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  )
}
