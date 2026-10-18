export function resultBadgeClass(result) {
  const rawValue =
    typeof result === 'object' && result !== null
      ? result.similarity || result.verdict || result.label || result.text || ''
      : result
  const value = String(rawValue ?? '').toLowerCase().replace(/[-_]+/g, ' ').trim()

  if (value.includes('new') || value.includes('low')) {
    return 'bg-[var(--success-bg)] text-[var(--success-text)]'
  }

  if (value.includes('partial') || value.includes('medium')) {
    return 'bg-[var(--warning-bg)] text-[var(--warning-text)]'
  }

  if (value.includes('similar') || value.includes('high')) {
    return 'bg-[var(--danger-bg)] text-[var(--danger-text)]'
  }

  return 'bg-[var(--icon-tile)] text-[var(--ink)]'
}

// Seed data for the analyses list — analyses created via "New Analysis"
// are prepended to this at runtime (see App.jsx).
export const initialAnalyses = [
  {
    id: 1,
    title: 'AI Robot that finds misplaced objects',
    icon: 'bot',
    iconBg: 'bg-[var(--icon-tile)] text-[var(--ink)]',
    result: 'PARTIALLY EXISTING',
    date: '20 May 2025',
  },
  {
    id: 2,
    title: 'Smart Dustbin with Auto Waste Segregation',
    icon: 'trash',
    iconBg: 'bg-[var(--icon-tile)] text-[var(--ink)]',
    result: 'HIGHLY SIMILAR',
    date: '19 May 2025',
  },
  {
    id: 3,
    title: 'Solar Powered Smart Irrigation System',
    icon: 'sprout',
    iconBg: 'bg-[var(--icon-tile)] text-[var(--ink)]',
    result: 'PARTIALLY EXISTING',
    date: '18 May 2025',
  },
  {
    id: 4,
    title: 'Portable Health Monitor for Rural Areas',
    icon: 'heart',
    iconBg: 'bg-[var(--icon-tile)] text-[var(--ink)]',
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