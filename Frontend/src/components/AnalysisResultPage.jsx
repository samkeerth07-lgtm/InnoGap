import { ArrowLeft, Bell, CheckCircle2, Lightbulb, User, TrendingUp, Layers, ArrowRight, FileText, Download } from 'lucide-react'
import InfoCard from './InfoCard'
import SolutionCard from './SolutionCard'
import { mockAnalysisResult, similarSolutions } from '../analysisData'

export default function AnalysisResultPage({
  result = mockAnalysisResult,
  onBack,
  onViewAllSources,
  isSaved = false,
  onSaveReport,
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            {result.status}
          </span>
          <h1 className="text-2xl font-semibold leading-snug text-gray-900">{result.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
            {result.description}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
          <p className="mb-2 text-sm font-medium text-gray-700">Overall Result</p>
          <span className="inline-flex items-center rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700">
            {result.overallResult}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{result.overallResultNote}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoCard icon={Lightbulb} iconBg="bg-blue-50 text-blue-500" title="What You Proposed">
          {result.proposed}
        </InfoCard>

        <InfoCard icon={User} iconBg="bg-blue-50 text-blue-500" title="Existing Technologies Found">
          <ul className="list-disc space-y-1 pl-4">
            {result.existingTech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard icon={TrendingUp} iconBg="bg-emerald-50 text-emerald-500" title="Potential Gap">
          {result.potentialGap}
        </InfoCard>
      </div>

      <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Layers className="h-[18px] w-[18px]" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Similar Existing Solutions</h2>
              <p className="text-sm text-gray-500">
                We found a few existing solutions that are related to your idea.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewAllSources}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all sources
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {similarSolutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-blue-50/60 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FileText className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gray-900">Summary</h3>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600">{result.summary}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSaveReport}
          disabled={isSaved}
          className={`flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
            isSaved
              ? 'cursor-default bg-emerald-50 text-emerald-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {isSaved ? 'Saved' : 'Save Report'}
        </button>
      </section>
    </div>
  )
}