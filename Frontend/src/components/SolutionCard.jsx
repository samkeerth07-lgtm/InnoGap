import { Bot, Brain, Cpu } from 'lucide-react'

const ICONS = { bot: Bot, brain: Brain, cpu: Cpu }

function truncateText(text, maxLength = 160) {
  if (!text) return ''

  return text.length > maxLength
    ? `${text.slice(0, maxLength)}...`
    : text
}

export default function SolutionCard({ solution }) {
  const Icon = ICONS[solution.icon]

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${solution.iconBg}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">{solution.name}</p>
          <p className="text-xs text-[var(--muted)]">{solution.type}</p>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-[var(--text)]">
  {truncateText(solution.description, 160)}
</p>

      <div className="rounded-lg bg-[var(--bg)] p-3">
        <p className="mb-2 text-xs text-[var(--text)]">Key Capabilities</p>
        <div className="flex flex-wrap gap-2">
          {solution.capabilities.map((cap) => (
            <span
              key={cap}
              className="rounded-md bg-[var(--icon-tile)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
