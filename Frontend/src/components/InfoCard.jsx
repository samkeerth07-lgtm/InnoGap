export default function InfoCard({ icon: Icon, iconBg, title, children }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <h3 className="text-sm font-semibold text-[var(--ink)]">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-[var(--text)]">{children}</div>
    </div>
  )
}
