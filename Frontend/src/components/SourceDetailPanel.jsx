import { ExternalLink, CheckCircle2, Tag, Link2, Calendar } from 'lucide-react'
import SourceIcon from './SourceIcon'
import { badgeClass } from '../sourcesData'

export default function SourceDetailPanel({ source }) {
  const { detail } = source

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SourceIcon icon={source.icon} style={source.iconStyle} className="h-11 w-11" />
          <div>
            <h2 className="text-base font-semibold text-gray-900">{source.name}</h2>
            <span
              className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass(
                source.badge,
              )}`}
            >
              {source.badge}
            </span>
          </div>
        </div>
        <a
          href={detail.website}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Visit Source
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-gray-600">{detail.fullDescription}</p>

      <h3 className="mb-2 text-sm font-semibold text-gray-900">Key Capabilities</h3>
      <div className="mb-6 flex flex-wrap gap-2">
        {detail.capabilities.map((cap) => (
          <span
            key={cap}
            className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
          >
            {cap}
          </span>
        ))}
      </div>

      <hr className="mb-6 border-gray-100" />

      <h3 className="mb-2 text-sm font-semibold text-gray-900">What It Does</h3>
      <ul className="mb-6 space-y-1.5">
        {detail.whatItDoes.map((point) => (
          <li key={point} className="flex gap-2 text-sm leading-relaxed text-gray-600">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
            {point}
          </li>
        ))}
      </ul>

      <hr className="mb-6 border-gray-100" />

      <h3 className="mb-2 text-sm font-semibold text-gray-900">Relevance to Your Idea</h3>
      <div className="mb-6 flex gap-3 rounded-xl bg-blue-50/60 p-4">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-gray-700">{detail.relevance}</p>
      </div>

      <hr className="mb-6 border-gray-100" />

      <h3 className="mb-3 text-sm font-semibold text-gray-900">Source Details</h3>
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-gray-500">
            <Tag className="h-4 w-4" />
            Type
          </dt>
          <dd className="text-gray-900">{detail.type}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-gray-500">
            <Link2 className="h-4 w-4" />
            Website
          </dt>
          <dd>
            <a
              href={detail.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              {detail.website}
            </a>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            Last Accessed
          </dt>
          <dd className="text-gray-900">{detail.lastAccessed}</dd>
        </div>
      </dl>
    </div>
  )
}
