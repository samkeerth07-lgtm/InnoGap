export const RESULT_STYLES = {
  'PARTIALLY EXISTING': 'bg-amber-50 text-amber-700',
  'HIGHLY SIMILAR': 'bg-rose-50 text-rose-600',
  'NEW-LOOKING': 'bg-emerald-50 text-emerald-600',
}

export function resultBadgeClass(result) {
  return RESULT_STYLES[result] ?? 'bg-gray-100 text-gray-600'
}

// Seed data for the analyses list — analyses created via "New Analysis"
// are prepended to this at runtime (see App.jsx).
export const initialAnalyses = [
  {
    id: 1,
    title: 'AI Robot that finds misplaced objects',
    icon: 'bot',
    iconBg: 'bg-blue-50 text-blue-500',
    result: 'PARTIALLY EXISTING',
    date: '20 May 2025',
  },
  {
    id: 2,
    title: 'Smart Dustbin with Auto Waste Segregation',
    icon: 'trash',
    iconBg: 'bg-emerald-50 text-emerald-500',
    result: 'HIGHLY SIMILAR',
    date: '19 May 2025',
  },
  {
    id: 3,
    title: 'Solar Powered Smart Irrigation System',
    icon: 'sprout',
    iconBg: 'bg-violet-50 text-violet-500',
    result: 'PARTIALLY EXISTING',
    date: '18 May 2025',
  },
  {
    id: 4,
    title: 'Portable Health Monitor for Rural Areas',
    icon: 'heart',
    iconBg: 'bg-sky-50 text-sky-500',
    result: 'NEW-LOOKING',
    date: '16 May 2025',
  },
]

export const howItWorksSteps = [
  {
    step: 1,
    icon: 'pencil',
    title: 'You Enter',
    description: 'Add the problem and your proposed solution.',
  },
  {
    step: 2,
    icon: 'search',
    title: 'We Search',
    description: 'We look for similar existing solutions.',
  },
  {
    step: 3,
    icon: 'sliders',
    title: 'We Compare',
    description: 'We break down and compare key features.',
  },
  {
    step: 4,
    icon: 'lightbulb',
    title: 'We Find Gaps',
    description: 'We identify what exists and what’s missing.',
  },
  {
    step: 5,
    icon: 'fileText',
    title: 'You Get Insights',
    description: 'Get an evidence-backed report with gaps.',
  },
]