from typing import List, Optional
from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    solutionId: str
    sourceUrl: str
    supportingSnippet: str


class VerificationResult(BaseModel):
    passed: bool
    checks: List[str] = Field(default_factory=list)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
