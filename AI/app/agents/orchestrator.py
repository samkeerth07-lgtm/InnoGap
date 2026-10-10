import asyncio
import logging
from typing import Any, Dict, List, Optional, TypedDict

from langgraph.graph import END, START, StateGraph

from app.adapters.github_adapter import adapt_github_repository
from app.adapters.openalex_adapter import adapt_openalex_work
from app.agents.verifier import verifier_agent
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.schemas.solutions import UnifiedSolution
from app.schemas.tools import (
    GapComparisonInput,
    GitHubCandidateRepo,
    GitHubSearchInput,
    ImplementationAnalyzerInput,
    OpenAlexCandidateWork,
    OpenAlexSearchInput,
    PaperAnalyzerInput,
    ProblemAnalyzerInput,
    ProblemAnalyzerOutput,
    ReadmeAnalyzerInput,
    RelevanceFilterInput,
    SimilarityAnalyzerInput,
    ToolTrace,
    VerdictInput,
)
from app.schemas.verification import VerificationResult
from app.tools import (
    gap_comparison_tool,
    github_search_tool,
    implementation_analyzer_tool,
    openalex_search_tool,
    paper_analyzer_tool,
    problem_analyzer_tool,
    readme_analyzer_tool,
    relevance_filter_tool,
    similarity_analyzer_tool,
    verdict_tool,
)
from app.utils.validators import validate_problem_analysis

logger = logging.getLogger("innogap.orchestrator")


class OrchestratorState(TypedDict):
    problem_statement: str
    my_solution: str
    problem_analysis: Optional[ProblemAnalyzerOutput]
    github_repos: List[GitHubCandidateRepo]
    openalex_works: List[OpenAlexCandidateWork]
    evaluated_solutions: List[UnifiedSolution]
    overall_result: str
    overall_result_note: str
    potential_gap: str
    summary: str
    verification: Optional[VerificationResult]
    reanalysis_count: int
    trace: List[ToolTrace]


class OrchestratorAgent:
    """
    Multi-Agent Orchestrator powered by LangGraph.
    Plans, delegates, routes state between tools and agents, and handles re-analysis.
    Does NOT perform analysis itself; all domain logic is strictly delegated to tools.
    """

    def __init__(self):
        self.workflow = self._build_graph()

    def _build_graph(self):
        graph = StateGraph(OrchestratorState)

        graph.add_node("analyze_problem", self._step_analyze_problem)
        graph.add_node("search_sources", self._step_search_sources)
        graph.add_node("evaluate_candidates", self._step_evaluate_candidates)
        graph.add_node("synthesize_verdict_and_gap", self._step_synthesize)
        graph.add_node("verify_results", self._step_verify)
        graph.add_node("reanalyze_failing", self._step_reanalyze)

        # Edges
        graph.add_edge(START, "analyze_problem")
        graph.add_edge("analyze_problem", "search_sources")
        graph.add_edge("search_sources", "evaluate_candidates")
        graph.add_edge("evaluate_candidates", "synthesize_verdict_and_gap")
        graph.add_edge("synthesize_verdict_and_gap", "verify_results")

        # Conditional Edge after Verification
        def check_verification_outcome(state: OrchestratorState) -> str:
            verification = state.get("verification")
            if verification and not verification.passed and state.get("reanalysis_count", 0) < 1:
                logger.info("Verification flagged items. Triggering single re-analysis pass.")
                return "reanalyze_failing"
            return END

        graph.add_conditional_edges(
            "verify_results",
            check_verification_outcome,
            {
                "reanalyze_failing": "reanalyze_failing",
                END: END,
            },
        )
        graph.add_edge("reanalyze_failing", "synthesize_verdict_and_gap")

        return graph.compile()

    async def _step_analyze_problem(self, state: OrchestratorState) -> Dict[str, Any]:
        trace = state.get("trace", [])
        input_data = ProblemAnalyzerInput(
            ProblemStatement=state["problem_statement"],
            MySolution=state["my_solution"],
        )
        analysis: ProblemAnalyzerOutput = await problem_analyzer_tool.run(
            input_data, trace_collector=trace
        )

        if not validate_problem_analysis(analysis):
            # Fallback queries if AI returned incomplete lists
            if not analysis.searchQueries:
                analysis.searchQueries = [state["problem_statement"][:60]]

        return {
            "problem_analysis": analysis,
            "trace": trace,
        }

    async def _step_search_sources(self, state: OrchestratorState) -> Dict[str, Any]:
        trace = state.get("trace", [])
        analysis = state["problem_analysis"]
        queries = analysis.searchQueries if analysis else [state["problem_statement"][:60]]

        github_task = github_search_tool.run(
            GitHubSearchInput(
                searchQueries=queries,
                ProblemStatement=state["problem_statement"],
                MySolution=state["my_solution"],
            ),
            trace_collector=trace,
        )

        openalex_task = openalex_search_tool.run(
            OpenAlexSearchInput(searchQueries=queries),
            trace_collector=trace,
        )

        github_res, openalex_res = await asyncio.gather(
            github_task, openalex_task, return_exceptions=True
        )

        repos = github_res.repositories if not isinstance(github_res, Exception) else []
        works = openalex_res.works if not isinstance(openalex_res, Exception) else []

        return {
            "github_repos": repos,
            "openalex_works": works,
            "trace": trace,
        }

    async def _evaluate_paper(
        self, work: OpenAlexCandidateWork, state: OrchestratorState
    ) -> Optional[UnifiedSolution]:
        trace = state.get("trace", [])
        # 1. Relevance check
        relevance = await relevance_filter_tool.run(
            RelevanceFilterInput(
                problemStatement=state["problem_statement"],
                mySolution=state["my_solution"],
                title=work.title,
                content=work.abstract_text,
                item_type="paper",
            ),
            trace_collector=trace,
        )
        if not relevance.relevant or relevance.score < 50:
            return None

        # 2. Paper analyzer
        paper_analysis = await paper_analyzer_tool.run(
            PaperAnalyzerInput(
                title=work.title,
                abstractText=work.abstract_text,
                publicationYear=work.publication_year,
                venue=work.host_venue,
                doi=work.doi,
                type=work.type,
            ),
            trace_collector=trace,
        )

        # 3. Adapter
        adapted = adapt_openalex_work(work, paper_analysis)

        # 4. Similarity analyzer
        similarity = await similarity_analyzer_tool.run(
            SimilarityAnalyzerInput(
                problemStatement=state["problem_statement"],
                mySolution=state["my_solution"],
                existingProblem=adapted.problem or adapted.description,
                existingSolution=adapted.solution or adapted.description,
                existingTechnologies=adapted.technologies,
            ),
            trace_collector=trace,
        )

        adapted.similarity = similarity
        return adapted

    async def _evaluate_repo(
        self, repo: GitHubCandidateRepo, state: OrchestratorState
    ) -> Optional[UnifiedSolution]:
        trace = state.get("trace", [])
        # 1. Relevance check
        techs = [repo.language] if repo.language else []
        relevance = await relevance_filter_tool.run(
            RelevanceFilterInput(
                problemStatement=state["problem_statement"],
                mySolution=state["my_solution"],
                title=repo.name,
                content=repo.readme[:2000],
                item_type="repository",
                technologies=techs,
            ),
            trace_collector=trace,
        )
        if not relevance.relevant or relevance.score < 50:
            return None

        # 2. Parallel Deep Analysis: Readme Analysis + Implementation Analysis
        readme_task = readme_analyzer_tool.run(
            ReadmeAnalyzerInput(readme=repo.readme), trace_collector=trace
        )
        impl_task = implementation_analyzer_tool.run(
            ImplementationAnalyzerInput(readme=repo.readme, files=repo.files),
            trace_collector=trace,
        )
        readme_analysis, impl_analysis = await asyncio.gather(readme_task, impl_task)

        # 3. Adapter
        adapted = adapt_github_repository(repo, readme_analysis, impl_analysis)

        # 4. Similarity analyzer
        similarity = await similarity_analyzer_tool.run(
            SimilarityAnalyzerInput(
                problemStatement=state["problem_statement"],
                mySolution=state["my_solution"],
                existingProblem=adapted.problem or adapted.description,
                existingSolution=adapted.solution or adapted.description,
                existingTechnologies=adapted.technologies,
            ),
            trace_collector=trace,
        )

        adapted.similarity = similarity
        return adapted

    async def _step_evaluate_candidates(self, state: OrchestratorState) -> Dict[str, Any]:
        tasks = []
        for repo in state.get("github_repos", []):
            tasks.append(self._evaluate_repo(repo, state))
        for work in state.get("openalex_works", []):
            tasks.append(self._evaluate_paper(work, state))

        results = await asyncio.gather(*tasks, return_exceptions=True)
        valid_solutions: List[UnifiedSolution] = [
            sol for sol in results if isinstance(sol, UnifiedSolution)
        ]

        # Deduplicate solutions by sourceUrl or id
        seen = set()
        deduped: List[UnifiedSolution] = []
        for s in valid_solutions:
            key = s.sourceUrl or s.id
            if key not in seen:
                seen.add(key)
                deduped.append(s)

        return {"evaluated_solutions": deduped}

    async def _step_synthesize(self, state: OrchestratorState) -> Dict[str, Any]:
        trace = state.get("trace", [])
        solutions = state.get("evaluated_solutions", [])

        # 1. Deterministic Verdict Tool
        verdict = await verdict_tool.run(
            VerdictInput(solutions=solutions), trace_collector=trace
        )

        # 2. Gap Comparison Tool
        serialized_solutions = [s.model_dump() for s in solutions]
        gap_res = await gap_comparison_tool.run(
            GapComparisonInput(
                problemStatement=state["problem_statement"],
                mySolution=state["my_solution"],
                existingSolutions=serialized_solutions,
            ),
            trace_collector=trace,
        )

        return {
            "overall_result": verdict.overallResult,
            "overall_result_note": verdict.overallResultNote,
            "potential_gap": gap_res.potentialGap,
            "summary": gap_res.summary,
            "trace": trace,
        }

    async def _step_verify(self, state: OrchestratorState) -> Dict[str, Any]:
        is_reanalysis = state.get("reanalysis_count", 0) > 0
        verification, _ = await verifier_agent.verify(
            problem_statement=state["problem_statement"],
            my_solution=state["my_solution"],
            solutions=state.get("evaluated_solutions", []),
            overall_result=state.get("overall_result", ""),
            potential_gap=state.get("potential_gap", ""),
            is_reanalysis_pass=is_reanalysis,
        )
        return {"verification": verification}

    async def _step_reanalyze(self, state: OrchestratorState) -> Dict[str, Any]:
        trace = state.get("trace", [])
        solutions = state.get("evaluated_solutions", [])
        count = state.get("reanalysis_count", 0) + 1

        # Re-check similarity for any items that lacked overlap or detail
        for s in solutions:
            if s.similarity and (not s.similarity.reason or len(s.similarity.reason.strip()) < 10):
                sim = await similarity_analyzer_tool.run(
                    SimilarityAnalyzerInput(
                        problemStatement=state["problem_statement"],
                        mySolution=state["my_solution"],
                        existingProblem=s.problem or s.description,
                        existingSolution=s.solution or s.description,
                        existingTechnologies=s.technologies,
                    ),
                    trace_collector=trace,
                )
                s.similarity = sim

        return {
            "evaluated_solutions": solutions,
            "reanalysis_count": count,
            "trace": trace,
        }

    async def execute(
        self, request: AnalysisRequest, debug: bool = False
    ) -> AnalysisResponse:
        """Entry point called by the FastAPI route."""
        initial_state: OrchestratorState = {
            "problem_statement": request.ProblemStatement,
            "my_solution": request.MySolution or "",
            "problem_analysis": None,
            "github_repos": [],
            "openalex_works": [],
            "evaluated_solutions": [],
            "overall_result": "No Similar Solution",
            "overall_result_note": "",
            "potential_gap": "",
            "summary": "",
            "verification": None,
            "reanalysis_count": 0,
            "trace": [],
        }

        final_state = await self.workflow.ainvoke(initial_state)

        analysis = final_state.get("problem_analysis")
        technologies = analysis.technologies if analysis else []

        return AnalysisResponse(
            status="Analysis Complete",
            title=request.ProblemStatement,
            description="The system analyzes your idea, searches for existing solutions, compares capabilities and identifies the gap in the current landscape.",
            overallResult=final_state.get("overall_result", "No Similar Solution"),
            overallResultNote=final_state.get("overall_result_note", ""),
            proposed=request.MySolution or "No proposed solution provided.",
            existingTech=technologies,
            potentialGap=final_state.get(
                "potential_gap",
                "Potential gap will be identified after comparing your idea with the discovered solutions.",
            ),
            summary=final_state.get(
                "summary",
                "The system found potentially related solutions from GitHub and research sources based on the problem and solution concepts identified by the AI.",
            ),
            similarSolutions=final_state.get("evaluated_solutions", []),
            verification=final_state.get(
                "verification",
                VerificationResult(
                    passed=True,
                    checks=["Verification completed."],
                    confidence=1.0,
                    evidence=[],
                    warnings=[],
                ),
            ),
            trace=final_state.get("trace", []) if debug else None,
        )


orchestrator_agent = OrchestratorAgent()
