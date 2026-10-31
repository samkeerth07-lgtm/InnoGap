from app.prompts.readme_analyzer_prompt import get_readme_analyzer_prompt
from app.schemas.tools import ReadmeAnalyzerInput, ReadmeAnalyzerOutput
from app.tools.base import AgentTool
from app.utils.llm_client import llm_client


async def _run_readme_analyzer(input_data: ReadmeAnalyzerInput) -> ReadmeAnalyzerOutput:
    readme_text = input_data.readme or ""
    truncated = readme_text[:4000] if len(readme_text) > 4000 else readme_text

    prompt = get_readme_analyzer_prompt(truncated)
    try:
        result = await llm_client.call_json(
            prompt=prompt,
            output_schema=ReadmeAnalyzerOutput,
            temperature=0.1,
        )
        return result
    except Exception:
        return ReadmeAnalyzerOutput(
            problem="",
            solution=truncated[:300],
            technologies=[],
            capabilities=[],
            whatItDoes=[],
        )


readme_analyzer_tool = AgentTool(
    name="readme_analyzer_tool",
    description="Analyzes GitHub README content (truncated to 4000 chars) to extract problem, system solution, technologies, capabilities, and 3-6 whatItDoes actions.",
    input_schema=ReadmeAnalyzerInput,
    output_schema=ReadmeAnalyzerOutput,
    func=_run_readme_analyzer,
)
