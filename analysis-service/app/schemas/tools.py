from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.solutions import ImplementationInfo, SimilarityInfo, UnifiedSolution


class ToolTrace(BaseModel):
    tool_name: str
    input_summary: str
    duration_ms: float
    success: bool
    error: Optional[str] = None


# 1. Problem Analyzer Tool
class ProblemAnalyzerInput(BaseModel):
    ProblemStatement: str = Field(description="The user's problem statement")
    MySolution: Optional[str] = Field(default="", description="The user's proposed solution")


class ProblemAnalyzerOutput(BaseModel):
    problem: str = Field(default="", description="The core problem identified")
    proposedSolution: str = Field(default="", description="Summarized proposed solution")
    domain: str = Field(default="", description="General domain")
    keyConcepts: List[str] = Field(default_factory=list, description="Extracted key concepts")
    technologies: List[str] = Field(default_factory=list, description="Technologies mentioned or implied")
    actions: List[str] = Field(default_factory=list, description="Important actions e.g. detection, monitoring")
    searchQueries: List[str] = Field(default_factory=list, description="2 to 3 concise, keyword-focused search queries")


# 2. GitHub Search Tool
class GitHubSearchInput(BaseModel):
    searchQueries: List[str] = Field(description="List of search queries")
    ProblemStatement: Optional[str] = Field(default="", description="Problem statement for context")
    MySolution: Optional[str] = Field(default="", description="Proposed solution for context")


class GitHubCandidateRepo(BaseModel):
    id: int
    name: str
    full_name: str
    html_url: str
    description: Optional[str] = ""
    language: Optional[str] = None
    size: Optional[int] = 0
    default_branch: Optional[str] = "main"
    readme: str = ""
    files: List[str] = Field(default_factory=list)
    raw_data: Dict[str, Any] = Field(default_factory=dict)


class GitHubSearchOutput(BaseModel):
    repositories: List[GitHubCandidateRepo] = Field(default_factory=list)


# 3. OpenAlex Search Tool
class OpenAlexSearchInput(BaseModel):
    searchQueries: List[str] = Field(description="List of search queries")


class OpenAlexCandidateWork(BaseModel):
    id: str
    title: str
    doi: Optional[str] = ""
    abstract_text: str = ""
    publication_year: Optional[int] = None
    host_venue: Optional[str] = ""
    type: Optional[str] = ""
    source_url: str = ""
    raw_data: Dict[str, Any] = Field(default_factory=dict)


class OpenAlexSearchOutput(BaseModel):
    works: List[OpenAlexCandidateWork] = Field(default_factory=list)


# 4. Relevance Filter Tool
class RelevanceFilterInput(BaseModel):
    problemStatement: str
    mySolution: str
    title: str
    content: str
    item_type: str = Field(default="paper", description="'paper' or 'repository'")
    technologies: List[str] = Field(default_factory=list)


class RelevanceFilterOutput(BaseModel):
    relevant: bool = Field(description="True if functionally relevant, false otherwise")
    score: int = Field(default=0, ge=0, le=100, description="Relevance score from 0 to 100")
    reason: str = Field(default="", description="Brief reason for the relevance evaluation")


# 5. Paper Analyzer Tool
class PaperAnalyzerInput(BaseModel):
    title: str
    abstractText: str
    publicationYear: Optional[int] = None
    venue: Optional[str] = ""
    doi: Optional[str] = ""
    type: Optional[str] = ""


class PaperAnalyzerOutput(BaseModel):
    problem: str = ""
    solution: str = ""
    technologies: List[str] = Field(default_factory=list)
    capabilities: List[str] = Field(default_factory=list)
    whatItDoes: List[str] = Field(default_factory=list)


# 6. Readme Analyzer Tool
class ReadmeAnalyzerInput(BaseModel):
    readme: str


class ReadmeAnalyzerOutput(BaseModel):
    problem: str = ""
    solution: str = ""
    technologies: List[str] = Field(default_factory=list)
    capabilities: List[str] = Field(default_factory=list)
    whatItDoes: List[str] = Field(default_factory=list)


# 7. Implementation Analyzer Tool
class ImplementationAnalyzerInput(BaseModel):
    readme: str
    files: List[str] = Field(default_factory=list)


class ImplementationAnalyzerOutput(ImplementationInfo):
    pass


# 8. Similarity Analyzer Tool
class SimilarityAnalyzerInput(BaseModel):
    problemStatement: str
    mySolution: str
    existingProblem: str
    existingSolution: str
    existingTechnologies: List[str] = Field(default_factory=list)


class SimilarityAnalyzerOutput(SimilarityInfo):
    pass


# 9. Verdict Tool
class VerdictInput(BaseModel):
    solutions: List[UnifiedSolution] = Field(default_factory=list)


class VerdictOutput(BaseModel):
    overallResult: str = Field(description="Existing, Partially Existing, Related, or No Similar Solution")
    overallResultNote: str = Field(description="Explanation of verdict")


# 10. Gap Comparison Tool
class GapComparisonInput(BaseModel):
    problemStatement: str
    mySolution: str
    existingSolutions: List[Dict[str, Any]] = Field(default_factory=list)


class GapComparisonOutput(BaseModel):
    potentialGap: str = ""
    summary: str = ""
