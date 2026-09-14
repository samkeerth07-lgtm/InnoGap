export default function FormField({ label, hint, placeholder, value, onChange, rows = 7 }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
      <p className="mt-1 text-sm text-gray-500">{hint}</p>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-3 w-full resize-none rounded-xl border border-gray-200 p-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}
