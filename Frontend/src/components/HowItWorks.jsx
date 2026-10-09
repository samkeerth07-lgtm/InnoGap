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
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
          The InnoGap process
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          How InnoGap Works
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-400">
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
                <div className="absolute left-5 top-11 h-8 w-px bg-slate-200" />
              )}

              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-blue-500">
                    {step.number}
                  </span>

                  <h3 className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
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