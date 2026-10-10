from app.prompts.problem_analyzer_prompt import get_problem_analyzer_prompt
from app.schemas.tools import ProblemAnalyzerInput, ProblemAnalyzerOutput
from app.tools.base import AgentTool
from app.utils.llm_client import llm_client


async def _run_problem_analyzer(input_data: ProblemAnalyzerInput) -> ProblemAnalyzerOutput:
    prompt = get_problem_analyzer_prompt(
        problem_statement=input_data.ProblemStatement,
        my_solution=input_data.MySolution or "",
    )
    result = await llm_client.call_json(
        prompt=prompt,
        output_schema=ProblemAnalyzerOutput,
        temperature=0.1,
    )
    return result


problem_analyzer_tool = AgentTool(
    name="problem_analyzer_tool",
    description="Deconstructs user's ProblemStatement and MySolution to extract domain, key concepts, technologies, actions, and 2-3 GitHub/academic search queries.",
    input_schema=ProblemAnalyzerInput,
    output_schema=ProblemAnalyzerOutput,
    func=_run_problem_analyzer,
)
