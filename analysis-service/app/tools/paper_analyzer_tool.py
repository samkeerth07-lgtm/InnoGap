from app.prompts.paper_analyzer_prompt import get_paper_analyzer_prompt
from app.schemas.tools import PaperAnalyzerInput, PaperAnalyzerOutput
from app.tools.base import AgentTool
from app.utils.llm_client import llm_client


async def _run_paper_analyzer(input_data: PaperAnalyzerInput) -> PaperAnalyzerOutput:
    paper_info = {
        "title": input_data.title,
        "abstract": input_data.abstractText,
        "metadata": {
            "publicationYear": input_data.publicationYear,
            "venue": input_data.venue,
            "doi": input_data.doi,
            "type": input_data.type,
        },
    }
    prompt = get_paper_analyzer_prompt(paper_info)
    try:
        result = await llm_client.call_json(
            prompt=prompt,
            output_schema=PaperAnalyzerOutput,
            temperature=0.1,
        )
        return result
    except Exception:
        return PaperAnalyzerOutput(
            problem="",
            solution=input_data.abstractText[:300] if input_data.abstractText else "",
            technologies=[],
            capabilities=[],
            whatItDoes=[],
        )


paper_analyzer_tool = AgentTool(
    name="paper_analyzer_tool",
    description="Analyzes research paper title, abstract, and metadata using LLM to extract problem, methodology, technologies, capabilities, and 3-6 whatItDoes actions.",
    input_schema=PaperAnalyzerInput,
    output_schema=PaperAnalyzerOutput,
    func=_run_paper_analyzer,
)
