import {
  FileText,
  Search,
  Scale,
  Target,
  ArrowRight,
} from 'lucide-react'

const STEPS = [
  {
    number: '01',
    title: 'Describe',
    description:
      'Tell InnoGap about your problem and proposed solution.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Discover',
    description:
      'Search across research, open-source projects and existing solutions.',
    icon: Search,
  },
  {
    number: '03',
    title: 'Compare',
    description:
      'Understand how existing solutions relate to your approach.',
    icon: Scale,
  },
  {
    number: '04',
    title: 'Identify the gap',
    description:
      'See what already exists and where meaningful differences remain.',
    icon: Target,
  },
]

export default function HowItWorks() {
  return (
    <section className="dark-surface rounded-[28px] border border-[var(--border)] bg-[var(--ink)] p-5 text-[var(--surface)] shadow-[var(--card-shadow)] sm:p-6">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
          The InnoGap process
        </p>

        <h2 className="mt-1 text-lg font-semibold text-[var(--surface)]">
          How InnoGap Works
        </h2>

        <p className="mt-1 text-xs leading-5 text-[var(--dark-text)]">
          From your idea to a clearer picture.
        </p>
      </div>

      <div className="space-y-5">
        {STEPS.map((step, index) => {
          const Icon = step.icon

          return (
            <div
              key={step.number}
              className="group relative flex gap-3"
            >
              {/* connector */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-5 top-11 h-8 w-px bg-[var(--dark-text)]" />
              )}

              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--icon-tile)] text-[var(--ink)] transition group-hover:bg-[var(--ink-raised)] group-hover:text-[var(--dark-text)]">
                <Icon className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-[var(--dark-text)]">
                    {step.number}
                  </span>

                  <h3 className="text-sm font-semibold text-[var(--surface)]">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-1 text-xs leading-5 text-[var(--dark-text)]">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      

      
    </section>
  )
}