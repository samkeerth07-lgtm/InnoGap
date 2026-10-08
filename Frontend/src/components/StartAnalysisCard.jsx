import {
  ArrowRight,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react'

export default function StartAnalysisCard({ onStart }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Have a new idea?
            </p>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Check research, GitHub projects and existing
              implementations before spending weeks building.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          <FileText className="h-4 w-4" />
          Start analysis
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  )
}