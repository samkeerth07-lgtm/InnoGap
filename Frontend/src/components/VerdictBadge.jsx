import { resultBadgeClass } from '../data'

export default function VerdictBadge({ value, className = '' }) {
  if (!value) return null

  return (
    <span className={`${className} ${resultBadgeClass(value)}`}>
      {value}
    </span>
  )
}