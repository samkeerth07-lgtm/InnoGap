import { ExternalLink, CheckCircle2, Tag, Link2, Calendar } from 'lucide-react'
import SourceIcon from './SourceIcon'
import { badgeClass } from '../sourcesData'
import VerdictBadge from './VerdictBadge'

export default function SourceDetailPanel({ source }) {
  const { detail } = source
  const similarity = detail?.similarity && typeof detail.similarity === 'object' ? detail.similarity : null

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SourceIcon icon={source.icon} style={source.iconStyle} className="h-11 w-11" />
          <div>
            <h2 className="text-base font-semibold text-[var(--ink)]">{source.name}</h2>
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
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--ink)] hover:text-[var(--text)]"
        >
          Visit Source
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-[var(--text)]">{detail.fullDescription}</p>

      <h3 className="mb-2 text-sm font-semibold text-[var(--ink)]">Key Capabilities</h3>
      <div className="mb-6 flex flex-wrap gap-2">
        {detail.capabilities.map((cap) => (
          <span
            key={cap}
            className="rounded-md bg-[var(--icon-tile)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]"
          >
            {cap}
          </span>
        ))}
      </div>

      <hr className="mb-6 border-[var(--border)]" />

      <h3 className="mb-2 text-sm font-semibold text-[var(--ink)]">What It Does</h3>
      <ul className="mb-6 space-y-1.5">
        {detail.whatItDoes.map((point) => (
          <li key={point} className="flex gap-2 text-sm leading-relaxed text-[var(--text)]">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
            {point}
          </li>
        ))}
      </ul>

      <hr className="mb-6 border-[var(--border)]" />

      <h3 className="mb-2 text-sm font-semibold text-[var(--ink)]">Relevance to Your Idea</h3>
      {similarity ? (
        <div className="mb-6 rounded-xl bg-[var(--bg)] p-4">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--icon-tile)] text-[var(--ink)]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--text)]">
              <p className="mb-2 font-medium text-[var(--ink)]">
                Similarity level: <VerdictBadge value={similarity.similarity} className="font-semibold" />
              </p>
              {similarity.reason ? <p className="mb-3">{similarity.reason}</p> : null}

              {Array.isArray(similarity.overlap) && similarity.overlap.length > 0 ? (
                <div className="mb-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text)]">
                    Common Capabilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {similarity.overlap.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text)] ring-1 ring-[var(--border)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {Array.isArray(similarity.differences) && similarity.differences.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text)]">
                    Differences
                  </p>
                  <ul className="space-y-1.5">
                    {similarity.differences.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--text)]">
          Similarity analysis is not available for this source.
        </div>
      )}

      <hr className="mb-6 border-[var(--border)]" />

      <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">Source Details</h3>
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-[var(--muted)]">
            <Tag className="h-4 w-4" />
            Type
          </dt>
          <dd className="text-[var(--ink)]">{detail.type}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-[var(--muted)]">
            <Link2 className="h-4 w-4" />
            Website
          </dt>
          <dd>
            <a
              href={detail.website}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--ink)] hover:text-[var(--text)]"
            >
              {detail.website}
            </a>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-[var(--muted)]">
            <Calendar className="h-4 w-4" />
            Last Accessed
          </dt>
          <dd className="text-[var(--ink)]">{detail.lastAccessed}</dd>
        </div>
      </dl>
    </div>
  )
}
