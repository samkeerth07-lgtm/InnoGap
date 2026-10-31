from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from app.schemas.solutions import UnifiedSolution
from app.schemas.verification import VerificationResult
from app.schemas.tools import ToolTrace


class AnalysisRequest(BaseModel):
    ProblemStatement: str = Field(
        ...,
        min_length=3,
        max_length=5000,
        description="The problem statement or innovation idea to investigate",
        examples=["Detecting hallucinations in Retrieval-Augmented Generation pipelines in real time"],
    )
    MySolution: Optional[str] = Field(
        default="",
        max_length=5000,
        description="User's proposed solution, approach, or hypothesis",
        examples=["An agentic verification framework cross-checking retrieved context using NLI"],
    )

    @field_validator("ProblemStatement")
    @classmethod
    def validate_problem_statement_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("ProblemStatement cannot be empty or blank")
        return v.strip()

    @field_validator("MySolution")
    @classmethod
    def clean_my_solution(cls, v: Optional[str]) -> str:
        if v is None:
            return ""
        return v.strip()


class AnalysisResponse(BaseModel):
    status: str = "Analysis Complete"
    title: str
    description: str = "The system analyzes your idea, searches for existing solutions, compares capabilities and identifies the gap in the current landscape."
    overallResult: str
    overallResultNote: str
    proposed: str
    existingTech: List[str] = Field(default_factory=list)
    potentialGap: str
    summary: str
    similarSolutions: List[UnifiedSolution] = Field(default_factory=list)
    verification: VerificationResult
    trace: Optional[List[ToolTrace]] = None
