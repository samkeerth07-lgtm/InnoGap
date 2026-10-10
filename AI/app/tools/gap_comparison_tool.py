from app.prompts.gap_comparison_prompt import get_gap_comparison_prompt
from app.schemas.tools import GapComparisonInput, GapComparisonOutput
from app.tools.base import AgentTool
from app.utils.llm_client import llm_client


async def _run_gap_comparison(input_data: GapComparisonInput) -> GapComparisonOutput:
    simplified = [
        {
            "name": s.get("name", ""),
            "problem": s.get("problem", ""),
            "solution": s.get("solution", ""),
            "technologies": s.get("technologies", []),
            "similarity": s.get("similarity", {}),
        }
        for s in input_data.existingSolutions
    ]

    prompt = get_gap_comparison_prompt(
        problem_statement=input_data.problemStatement,
        my_solution=input_data.mySolution,
        simplified_solutions=simplified,
    )

    try:
        result = await llm_client.call_json(
            prompt=prompt,
            output_schema=GapComparisonOutput,
            temperature=0.1,
        )
        return result
    except Exception:
        return GapComparisonOutput(
            potentialGap="A clear gap could not be determined from the analyzed sources.",
            summary="Related solutions were found and analyzed, but the comparison could not be completed.",
        )


gap_comparison_tool = AgentTool(
    name="gap_comparison_tool",
    description="Compares the user's idea against all discovered and retained solutions to identify the potential innovation gap and summarize the existing technical landscape.",
    input_schema=GapComparisonInput,
    output_schema=GapComparisonOutput,
    func=_run_gap_comparison,
)
