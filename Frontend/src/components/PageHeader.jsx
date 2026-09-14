import { Bell } from 'lucide-react'

export default function PageHeader({ name }) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {name}! <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Analyze your idea and discover real innovation gaps.
        </p>
      </div>
      <button
        type="button"
        aria-label="Notifications"
        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
      >
        <Bell className="h-5 w-5" />
      </button>
    </div>
  )
}
