export default function FormField({ id, label, hint, placeholder, value, onChange, rows = 7, disabled = false }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[var(--ink)]">{label}</label>
      <p id={`${id}-hint`} className="mt-1 text-sm text-[var(--muted)]">{hint}</p>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-describedby={`${id}-hint`}
        className={`mt-3 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--text)] placeholder:text-[var(--muted)] outline-none transition ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      />
    </div>
  )
}
