import { Bot, Brain, Cpu } from 'lucide-react'

const ICONS = { bot: Bot, brain: Brain, cpu: Cpu }

export default function SolutionCard({ solution }) {
  const Icon = ICONS[solution.icon]

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${solution.iconBg}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{solution.name}</p>
          <p className="text-xs text-gray-400">{solution.type}</p>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-500">{solution.description}</p>

      <div className="rounded-lg bg-gray-50 p-3">
        <p className="mb-2 text-xs text-gray-400">Key Capabilities</p>
        <div className="flex flex-wrap gap-2">
          {solution.capabilities.map((cap) => (
            <span
              key={cap}
              className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
