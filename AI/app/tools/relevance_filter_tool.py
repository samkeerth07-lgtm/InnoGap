from app.prompts.relevance_filter_prompt import (
    get_paper_relevance_prompt,
    get_repository_relevance_prompt,
)
from app.schemas.tools import RelevanceFilterInput, RelevanceFilterOutput
from app.tools.base import AgentTool
from app.utils.llm_client import llm_client


async def _run_relevance_filter(input_data: RelevanceFilterInput) -> RelevanceFilterOutput:
    if input_data.item_type == "repository":
        prompt = get_repository_relevance_prompt(
            problem_statement=input_data.problemStatement,
            my_solution=input_data.mySolution,
            name=input_data.title,
            description=input_data.content[:500] if input_data.content else "",
            technologies=input_data.technologies,
            readme_excerpt=input_data.content[:2000] if input_data.content else "",
        )
    else:
        prompt = get_paper_relevance_prompt(
            problem_statement=input_data.problemStatement,
            my_solution=input_data.mySolution,
            title=input_data.title,
            abstract=input_data.content,
        )

    try:
        result = await llm_client.call_json(
            prompt=prompt,
            output_schema=RelevanceFilterOutput,
            temperature=0.1,
        )
        # Enforce that score >= 50 is required for relevant=True
        is_relevant = bool(result.relevant and result.score >= 50)
        return RelevanceFilterOutput(
            relevant=is_relevant,
            score=result.score,
            reason=result.reason or "Evaluated based on functional problem alignment.",
        )
    except Exception as e:
        return RelevanceFilterOutput(
            relevant=False,
            score=0,
            reason=f"Relevance evaluation fallback: {str(e)}",
        )


relevance_filter_tool = AgentTool(
    name="relevance_filter_tool",
    description="Evaluates functional relevance of a paper or repository against the user's idea; rejects buzzword matches; requires score >= 50 to pass.",
    input_schema=RelevanceFilterInput,
    output_schema=RelevanceFilterOutput,
    func=_run_relevance_filter,
)
