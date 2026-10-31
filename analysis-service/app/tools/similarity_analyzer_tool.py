from app.prompts.similarity_analyzer_prompt import get_similarity_analyzer_prompt
from app.schemas.tools import SimilarityAnalyzerInput, SimilarityAnalyzerOutput
from app.tools.base import AgentTool
from app.utils.llm_client import llm_client


async def _run_similarity_analyzer(
    input_data: SimilarityAnalyzerInput,
) -> SimilarityAnalyzerOutput:
    prompt = get_similarity_analyzer_prompt(
        problem_statement=input_data.problemStatement,
        my_solution=input_data.mySolution,
        existing_problem=input_data.existingProblem,
        existing_solution=input_data.existingSolution,
        existing_technologies=input_data.existingTechnologies,
    )
    try:
        result = await llm_client.call_json(
            prompt=prompt,
            output_schema=SimilarityAnalyzerOutput,
            temperature=0.1,
        )
        # Normalize similarity level to title case ("High", "Medium", "Low")
        norm = result.similarity.capitalize()
        if norm not in ("High", "Medium", "Low"):
            norm = "Low"
        return SimilarityAnalyzerOutput(
            similarity=norm,
            reason=result.reason or "Evaluated based on functional comparison.",
            overlap=result.overlap or [],
            differences=result.differences or [],
        )
    except Exception as e:
        return SimilarityAnalyzerOutput(
            similarity="Low",
            reason=f"Similarity analysis could not be completed: {str(e)}",
            overlap=[],
            differences=[],
        )


similarity_analyzer_tool = AgentTool(
    name="similarity_analyzer_tool",
    description="Compares the user's idea against an existing solution to output similarity ('High', 'Medium', or 'Low'), reason, conceptual overlaps, and key differences.",
    input_schema=SimilarityAnalyzerInput,
    output_schema=SimilarityAnalyzerOutput,
    func=_run_similarity_analyzer,
)
