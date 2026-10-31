from typing import Optional
from app.schemas.solutions import UnifiedSolution
from app.schemas.tools import OpenAlexCandidateWork, PaperAnalyzerOutput


def adapt_openalex_work(
    work: OpenAlexCandidateWork,
    paper_analysis: Optional[PaperAnalyzerOutput] = None,
) -> UnifiedSolution:
    title = work.title or "Untitled research paper"

    description = (
        paper_analysis.solution
        if paper_analysis and paper_analysis.solution
        else (work.abstract_text[:300] if work.abstract_text else "No description available.")
    )

    clean_id = work.id.replace("https://openalex.org/", "")

    return UnifiedSolution(
        id=f"openalex-{clean_id or title}",
        name=title,
        type="Research Paper",
        icon="brain",
        iconBg="bg-violet-100 text-violet-700",
        description=description,
        capabilities=paper_analysis.capabilities if paper_analysis else [],
        problem=paper_analysis.problem if paper_analysis else "",
        solution=paper_analysis.solution if paper_analysis else "",
        technologies=paper_analysis.technologies if paper_analysis else [],
        whatItDoes=paper_analysis.whatItDoes if paper_analysis else [],
        sourceUrl=work.source_url,
        implementation=None,
    )
