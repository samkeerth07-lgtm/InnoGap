import { useState } from 'react'

import Sidebar from './components/Sidebar'
import PageHeader from './components/PageHeader'
import DashboardStats from './components/DashboardStats'
import RecentAnalyses from './components/RecentAnalyses'
import HowItWorks from './components/HowItWorks'

import NewAnalysisPage from './components/NewAnalysisPage'
import AnalysisResultPage from './components/AnalysisResultPage'
import SourcesPage from './components/SourcesPage'
import MyAnalysesPage from './components/MyAnalysesPage'
import SavedIdeasPage from './components/SavedIdeasPage'

import { initialAnalyses } from './data'
import { mockAnalysisResult } from './analysisData'

import {
  DEFAULT_NEW_ANALYSIS_ICON,
  DEFAULT_NEW_ANALYSIS_ICON_BG,
} from './components/analysisIcons'


function truncate(text, max = 60) {
  const trimmed = text.trim()

  return trimmed.length > max
    ? `${trimmed.slice(0, max - 1)}…`
    : trimmed
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


  // -----------------------------------
  // Open analysis result
  // -----------------------------------
  const openResult = (result) => {
    setActiveResult(result)
    setPage('analysis-result')
  }


  // -----------------------------------
  // Select an existing analysis
  // -----------------------------------
  const handleSelectAnalysis = async (item) => {
    try {
      // If result is already available,
      // open it directly.
      if (item.resultData) {
        openResult(item.resultData)
        return
      }

      const problemStatement =
        item.problemStatement ?? item.title

      const mySolution =
        item.mySolution ?? ''

      const response = await fetch(
        'http://localhost:5000/api/analysis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ProblemStatement: problemStatement,
            MySolution: mySolution,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Analysis request failed with status ${response.status}`
        )
      }

      const result = await response.json()

      openResult(result)

    } catch (error) {
      console.error(
        'Unable to open analysis:',
        error
      )
    }
  }


  // -----------------------------------
  // Select saved idea
  // -----------------------------------
  const handleSelectSavedIdea = (item) => {
    openResult(
      item.resultData ?? mockAnalysisResult
    )
  }


  // -----------------------------------
  // Submit new analysis
  // -----------------------------------
  const handleSubmitAnalysis = async ({
    problem,
    solution,
  }) => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/analysis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ProblemStatement: problem,
            MySolution: solution,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Analysis request failed with status ${response.status}`
        )
      }

      const result = await response.json()

      const newEntry = {
        id: `local-${Date.now()}`,

        title: truncate(problem),

        icon: DEFAULT_NEW_ANALYSIS_ICON,

        iconBg:
          DEFAULT_NEW_ANALYSIS_ICON_BG,

        result:
          result.overallResult?.toUpperCase() ||
          'ANALYZED',

        date: formatToday(),

        resultData: result,

        problemStatement: problem,

        mySolution: solution,
      }

      // Put newest analysis at top
      setAnalyses((prev) => [
        newEntry,
        ...prev,
      ])

      // Open result
      openResult(result)

    } catch (error) {
      console.error(
        'Unable to submit analysis:',
        error
      )
    }
  }


  // -----------------------------------
  // Save current report
  // -----------------------------------
  const handleSaveReport = () => {
    const alreadySaved =
      savedIdeas.some(
        (item) =>
          item.title === activeResult.title
      )

    if (alreadySaved) {
      return
    }

    const newSavedIdea = {
      id: `saved-${Date.now()}`,

      title: activeResult.title,

      icon: 'bookmark',

      iconBg:
        'bg-blue-50 text-blue-500',

      result:
        activeResult.overallResult?.toUpperCase() ||
        'ANALYZED',

      date: formatToday(),

      resultData: activeResult,
    }

    setSavedIdeas((prev) => [
      newSavedIdea,
      ...prev,
    ])
  }


  // -----------------------------------
  // Check whether current report is saved
  // -----------------------------------
  const isActiveResultSaved =
    savedIdeas.some(
      (item) =>
        item.title === activeResult.title
    )


  // -----------------------------------
  // Sidebar active state
  // -----------------------------------
  const sidebarActive =
    page === 'analysis-result' ||
    page === 'sources'
      ? 'new-analysis'
      : page


  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* =========================================
          FIXED SIDEBAR
      ========================================== */}
      <Sidebar
        active={sidebarActive}
        onNavigate={setPage}
      />


      {/* =========================================
          SCROLLABLE MAIN AREA
      ========================================== */}
      <main
        className="
          min-h-0
          min-w-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          bg-slate-50
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1500px]
            px-6
            py-5
            lg:px-8
          "
        >

          {/* =====================================
              DASHBOARD
          ====================================== */}
          {page === 'dashboard' && (
            <>
              <PageHeader
                onStartAnalysis={() =>
                  setPage('new-analysis')
                }
              />

              <DashboardStats />

              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  xl:grid-cols-[minmax(0,1fr)_360px]
                "
              >
                <RecentAnalyses
                  analyses={analyses}
                  onSelect={handleSelectAnalysis}
                  onViewAll={() =>
                    setPage('my-analyses')
                  }
                />

                <HowItWorks />
              </div>
            </>
          )}


          {/* =====================================
              NEW ANALYSIS
          ====================================== */}
          {page === 'new-analysis' && (
            <NewAnalysisPage
              onSubmit={handleSubmitAnalysis}
            />
          )}


          {/* =====================================
              MY ANALYSES
          ====================================== */}
          {page === 'my-analyses' && (
            <MyAnalysesPage
              analyses={analyses}
              onSelect={handleSelectAnalysis}
            />
          )}


          {/* =====================================
              SAVED IDEAS
          ====================================== */}
          {page === 'saved-ideas' && (
            <SavedIdeasPage
              savedIdeas={savedIdeas}
              onSelect={handleSelectSavedIdea}
            />
          )}


          {/* =====================================
              ANALYSIS RESULT
          ====================================== */}
          {page === 'analysis-result' && (
            <AnalysisResultPage
              result={activeResult}
              onBack={() =>
                setPage('dashboard')
              }
              onViewAllSources={() =>
                setPage('sources')
              }
              isSaved={isActiveResultSaved}
              onSaveReport={handleSaveReport}
            />
          )}


          {/* =====================================
              SOURCES
          ====================================== */}
          {page === 'sources' && (
            <SourcesPage
              sources={
                activeResult.similarSolutions || []
              }
              onBackToResults={() =>
                setPage('analysis-result')
              }
              onBackToSummary={() =>
                setPage('analysis-result')
              }
            />
          )}

        </div>
      </main>
    </div>
  )
}