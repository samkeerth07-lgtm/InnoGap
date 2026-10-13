import {
  ArrowRight,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react'

export default function StartAnalysisCard({ onStart }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">
              Have a new idea?
            </p>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--text)]">
              Check research, GitHub projects and existing
              implementations before spending weeks building.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="dark-surface inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold text-[var(--surface)] transition hover:bg-[var(--ink-raised)]"
        >
          <FileText className="h-4 w-4" />
          Start analysis
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  )
}