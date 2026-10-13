export default function FormField({ id, label, hint, placeholder, value, onChange, rows = 7 }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[#202426]">{label}</label>
      <p id={`${id}-hint`} className="mt-1 text-sm text-slate-500">{hint}</p>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={`${id}-hint`}
        className="mt-3 w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#292d2e] focus:ring-2 focus:ring-[#e6ff1f]/40"
      />
    </div>
  )
}
