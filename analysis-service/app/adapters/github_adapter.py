from typing import Any, Dict, Optional
from app.schemas.solutions import ImplementationInfo, UnifiedSolution
from app.schemas.tools import GitHubCandidateRepo, ReadmeAnalyzerOutput


def adapt_github_repository(
    repo: GitHubCandidateRepo,
    readme_analysis: Optional[ReadmeAnalyzerOutput] = None,
    implementation_analysis: Optional[ImplementationInfo] = None,
) -> UnifiedSolution:
    capabilities = (
        readme_analysis.capabilities
        if readme_analysis and readme_analysis.capabilities
        else ([repo.language] if repo.language else ["Programming"])
    )

    description = (
        readme_analysis.solution
        if readme_analysis and readme_analysis.solution
        else (repo.description or "No description available.")
    )

    return UnifiedSolution(
        id=f"github-{repo.id}",
        name=repo.name,
        type="Open Source Project",
        icon="cpu",
        iconBg="bg-gray-900 text-white",
        description=description,
        capabilities=capabilities,
        problem=readme_analysis.problem if readme_analysis else "",
        solution=readme_analysis.solution if readme_analysis else "",
        technologies=readme_analysis.technologies if readme_analysis else [],
        whatItDoes=readme_analysis.whatItDoes if readme_analysis else [],
        sourceUrl=repo.html_url,
        implementation=implementation_analysis,
    )
