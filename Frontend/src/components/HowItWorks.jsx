import { Pencil, Search, SlidersHorizontal, Lightbulb, FileText, ArrowRight } from 'lucide-react'
import { howItWorksSteps } from '../data'

const ICONS = {
  pencil: Pencil,
  search: Search,
  sliders: SlidersHorizontal,
  lightbulb: Lightbulb,
  fileText: FileText,
}

export default function HowItWorks() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-base font-semibold text-gray-900">How it works</h2>

      <div className="flex items-start justify-between">
        {howItWorksSteps.map((item, index) => {
          const Icon = ICONS[item.icon]
          const isLast = index === howItWorksSteps.length - 1
          return (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-40 shrink-0 text-left">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="h-6 w-6 text-blue-500" strokeWidth={1.75} />
                </div>
                <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                    {item.step}
                  </span>
                  {item.title}
                </p>
                <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
              </div>
              {!isLast && (
                <ArrowRight className="mt-6 h-4 w-4 shrink-0 text-gray-300" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
