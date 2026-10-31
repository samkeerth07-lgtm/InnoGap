from typing import Any, List, Optional
from pydantic import BaseModel, Field


class ImplementationEvidence(BaseModel):
    type: str
    description: str
    url: Optional[str] = None


class ImplementationInfo(BaseModel):
    codeAvailable: bool = False
    demoAvailable: bool = False
    demoUrl: Optional[str] = None
    prototypeMentioned: bool = False
    prototypeUrl: Optional[str] = None
    deploymentMentioned: bool = False
    deploymentUrl: Optional[str] = None
    runInstructionsAvailable: bool = False
    evidence: List[ImplementationEvidence] = Field(default_factory=list)


class SimilarityInfo(BaseModel):
    similarity: str = Field(
        default="Low",
        description="Similarity rating: 'High', 'Medium', or 'Low'"
    )
    reason: str = Field(
        default="",
        description="Reason for the assigned similarity level"
    )
    overlap: List[str] = Field(
        default_factory=list,
        description="Overlapping concepts or capabilities"
    )
    differences: List[str] = Field(
        default_factory=list,
        description="Differences between the proposed idea and existing project"
    )


class UnifiedSolution(BaseModel):
    id: str
    name: str
    type: str = Field(
        default="Open Source Project",
        description="'Open Source Project' or 'Research Paper'"
    )
    icon: Optional[str] = "cpu"
    iconBg: Optional[str] = "bg-gray-900 text-white"
    description: str = ""
    capabilities: List[str] = Field(default_factory=list)
    problem: str = ""
    solution: str = ""
    technologies: List[str] = Field(default_factory=list)
    whatItDoes: List[str] = Field(default_factory=list)
    sourceUrl: str = ""
    implementation: Optional[ImplementationInfo] = None
    similarity: SimilarityInfo = Field(default_factory=SimilarityInfo)
