import { resultBadgeClass } from '../data'

export default function VerdictBadge({ value, className = '' }) {
  if (!value) return null

  const displayValue =
    typeof value === 'object' && value !== null
      ? value.similarity || value.verdict || value.label || value.text || ''
      : String(value)

  if (!displayValue) return null

  return (
    <span className={`${className} ${resultBadgeClass(displayValue)}`}>
      {displayValue}
    </span>
  )
}