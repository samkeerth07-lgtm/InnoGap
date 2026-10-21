import { useMemo } from 'react'
import {
  FileText,
  Bookmark,
  Target,
  ArrowUpRight,
} from 'lucide-react'

export default function DashboardStats({ analyses = [], savedIdeas = [] }) {
  const stats = useMemo(() => {
    const totalAnalyses = analyses.length
    const totalSaved = savedIdeas.length

    // Dynamically calculate how many analyses identified a potential innovation gap
    const potentialGapsCount = analyses.filter((item) => {
      const resultStr = String(item.result || item.overallResult || '').toLowerCase()
      const gapText = item.resultData?.potentialGap || item.potentialGap || ''
      return (
        resultStr.includes('gap') ||
        resultStr.includes('partial') ||
        resultStr.includes('new') ||
        (gapText && !gapText.toLowerCase().includes('no clear functional gap'))
      )
    }).length

    return [
      {
        label: 'Total Analyses',
        value: String(totalAnalyses),
        note: totalAnalyses === 1 ? '1 analysis completed' : `${totalAnalyses} analyses completed`,
        icon: FileText,
        iconClass: 'bg-[var(--icon-tile)] text-[var(--ink)]',
      },
      {
        label: 'Saved Ideas',
        value: String(totalSaved),
        note: totalSaved === 1 ? '1 bookmarked idea' : `${totalSaved} bookmarked ideas`,
        icon: Bookmark,
        iconClass: 'bg-[var(--success-bg)] text-[var(--success-text)]',
      },
      {
        label: 'Potential Gaps',
        value: String(potentialGapsCount),
        note: potentialGapsCount === 1 ? '1 gap identified' : `${potentialGapsCount} gaps identified`,
        icon: Target,
        iconClass: 'bg-[var(--icon-tile)] text-[var(--ink)]',
      },
    ]
  }, [analyses, savedIdeas])

  return (
    <section className="mb-5 grid grid-cols-1 gap-3 rounded-[28px] p-3 sm:grid-cols-3">
      {stats.map(({ label, value, note, icon: Icon, iconClass }) => (
        <div
          key={label}
          className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--surface)] sm:p-5"
        >
          <div className="flex items-start justify-between">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
            >
              <Icon className="h-5 w-5" />
            </span>

            <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
          </div>

          <p className="mt-4 text-xs font-medium text-[var(--muted)]">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--ink)]">
            {value}
          </p>

          <p className="mt-2 text-xs font-medium text-[var(--muted)]">
            {note}
          </p>
        </div>
      ))}
    </section>
  )
}
