from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.solutions import UnifiedSolution
from app.schemas.verification import VerificationResult
from app.schemas.tools import ToolTrace


class AnalysisRequest(BaseModel):
    ProblemStatement: str = Field(description="The problem statement provided by the user")
    MySolution: Optional[str] = Field(default="", description="The optional solution proposed by the user")


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
