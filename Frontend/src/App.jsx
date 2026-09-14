import { useState } from 'react'
import Sidebar from './components/Sidebar'
import PageHeader from './components/PageHeader'
import StartAnalysisCard from './components/StartAnalysisCard'
import RecentAnalyses from './components/RecentAnalyses'
import HowItWorks from './components/HowItWorks'
import NewAnalysisPage from './components/NewAnalysisPage'
import AnalysisResultPage from './components/AnalysisResultPage'
import SourcesPage from './components/SourcesPage'
import MyAnalysesPage from './components/MyAnalysesPage'
import SavedIdeasPage from './components/SavedIdeasPage'
import { initialAnalyses } from './data'
import { mockAnalysisResult } from './analysisData'
import { DEFAULT_NEW_ANALYSIS_ICON, DEFAULT_NEW_ANALYSIS_ICON_BG } from './components/analysisIcons'

function truncate(text, max = 60) {
  const trimmed = text.trim()
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed
}

function formatToday() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [analyses, setAnalyses] = useState(initialAnalyses)
  const [savedIdeas, setSavedIdeas] = useState([])
  const [activeResult, setActiveResult] = useState(mockAnalysisResult)

  const openResult = (result) => {
    setActiveResult(result)
    setPage('analysis-result')
  }

  const handleSelectAnalysis = (item) => {
    openResult(item.resultData ?? mockAnalysisResult)
  }

  const handleSelectSavedIdea = (item) => {
    openResult(item.resultData ?? mockAnalysisResult)
  }

  const handleSubmitAnalysis = ({ problem, solution }) => {
    // TODO: replace with a real API call using `problem` and `solution`.
    // The mock result below is used for every new analysis for now —
    // swap this for whatever the API returns.
    const result = mockAnalysisResult

    const newEntry = {
      id: `local-${Date.now()}`,
      title: truncate(problem),
      icon: DEFAULT_NEW_ANALYSIS_ICON,
      iconBg: DEFAULT_NEW_ANALYSIS_ICON_BG,
      result: result.overallResult.toUpperCase(),
      date: formatToday(),
      resultData: result,
    }

    setAnalyses((prev) => [newEntry, ...prev])
    openResult(result)
  }

  const handleSaveReport = () => {
    const alreadySaved = savedIdeas.some((item) => item.title === activeResult.title)
    if (alreadySaved) return

    const newSavedIdea = {
      id: `saved-${Date.now()}`,
      title: activeResult.title,
      icon: 'bookmark',
      iconBg: 'bg-blue-50 text-blue-500',
      result: activeResult.overallResult.toUpperCase(),
      date: formatToday(),
      resultData: activeResult,
    }

    setSavedIdeas((prev) => [newSavedIdea, ...prev])
  }

  const isActiveResultSaved = savedIdeas.some((item) => item.title === activeResult.title)

  // "analysis-result" and "sources" both belong to the New Analysis flow,
  // so keep that nav item highlighted while viewing either screen.
  const sidebarActive =
    page === 'analysis-result' || page === 'sources' ? 'new-analysis' : page

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={sidebarActive} onNavigate={setPage} />
      <main className="flex-1 px-10 py-8">
        {page === 'dashboard' && (
          <div className="mx-auto max-w-5xl">
            <PageHeader name="Ananya" />
            <StartAnalysisCard onStart={() => setPage('new-analysis')} />
            <RecentAnalyses
              analyses={analyses}
              onSelect={handleSelectAnalysis}
              onViewAll={() => setPage('my-analyses')}
            />
            <HowItWorks />
          </div>
        )}

        {page === 'new-analysis' && <NewAnalysisPage onSubmit={handleSubmitAnalysis} />}

        {page === 'my-analyses' && (
          <MyAnalysesPage analyses={analyses} onSelect={handleSelectAnalysis} />
        )}

        {page === 'saved-ideas' && (
          <SavedIdeasPage savedIdeas={savedIdeas} onSelect={handleSelectSavedIdea} />
        )}

        {page === 'analysis-result' && (
          <AnalysisResultPage
            result={activeResult}
            onBack={() => setPage('dashboard')}
            onViewAllSources={() => setPage('sources')}
            isSaved={isActiveResultSaved}
            onSaveReport={handleSaveReport}
          />
        )}

        {page === 'sources' && (
          <SourcesPage
            onBackToResults={() => setPage('analysis-result')}
            onBackToSummary={() => setPage('analysis-result')}
          />
        )}
      </main>
    </div>
  )
}