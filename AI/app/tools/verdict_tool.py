from typing import List
from app.schemas.solutions import UnifiedSolution
from app.schemas.tools import VerdictInput, VerdictOutput
from app.tools.base import AgentTool


def compute_deterministic_verdict(solutions: List[UnifiedSolution]) -> VerdictOutput:
    if not solutions:
        return VerdictOutput(
            overallResult="No Similar Solution",
            overallResultNote="No related solutions were found in the sources analyzed.",
        )

    similarity_levels = [
        s.similarity.similarity.capitalize()
        for s in solutions
        if s.similarity and s.similarity.similarity
    ]

    high_count = sum(1 for level in similarity_levels if level == "High")
    medium_count = sum(1 for level in similarity_levels if level == "Medium")
    low_count = sum(1 for level in similarity_levels if level == "Low")

    if high_count > 0:
        return VerdictOutput(
            overallResult="Existing",
            overallResultNote="At least one analyzed source appears to address a highly similar problem or solution area.",
        )

    if medium_count > 0:
        return VerdictOutput(
            overallResult="Partially Existing",
            overallResultNote="Related solutions were found, but the analyzed sources do not appear to completely match the proposed solution.",
        )

    if low_count > 0:
        return VerdictOutput(
            overallResult="Related",
            overallResultNote="Related projects were found, but the analyzed solutions have limited similarity to the proposed idea.",
        )

    return VerdictOutput(
        overallResult="No Similar Solution",
        overallResultNote="No meaningful similarity could be determined from the analyzed sources.",
    )


async def _run_verdict_tool(input_data: VerdictInput) -> VerdictOutput:
    return compute_deterministic_verdict(input_data.solutions)


verdict_tool = AgentTool(
    name="verdict_tool",
    description="Deterministic rule-based aggregator that computes overall verdict ('Existing', 'Partially Existing', 'Related', or 'No Similar Solution') based on highest similarity level found.",
    input_schema=VerdictInput,
    output_schema=VerdictOutput,
    func=_run_verdict_tool,
)
