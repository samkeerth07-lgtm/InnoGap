import asyncio
import base64
import re
from typing import Any, Dict, List, Optional
import httpx

from app.config import settings
from app.schemas.tools import GitHubCandidateRepo, GitHubSearchInput, GitHubSearchOutput
from app.tools.base import AgentTool
from app.utils.deduplicate import remove_duplicate_repositories

GITHUB_API_URL = "https://api.github.com"
MAX_RESULTS_PER_QUERY = 5
MAX_REPOSITORIES = 10
MAX_VIABLE_REPOSITORIES = 4
CODE_EXTENSION_REGEX = re.compile(
    r"\.(js|jsx|ts|tsx|py|java|cpp|c|cs|go|rs|php|rb|swift|kt|scala|m|h|hpp)$",
    re.IGNORECASE,
)


def _github_headers() -> Dict[str, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "InnoGap-AgenticAI/1.0",
    }
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    return headers


async def _get_repository_readme(client: httpx.AsyncClient, full_name: str) -> str:
    try:
        url = f"{GITHUB_API_URL}/repos/{full_name}/readme"
        resp = await client.get(url, timeout=8.0)
        if resp.status_code != 200:
            return ""
        data = resp.json()
        if data.get("encoding") != "base64" or not data.get("content"):
            return ""
        raw_b64 = data["content"].replace("\n", "")
        return base64.b64decode(raw_b64).decode("utf-8", errors="replace")
    except Exception as e:
        return ""


async def _get_repository_files(
    client: httpx.AsyncClient, full_name: str, default_branch: str = "main"
) -> List[str]:
    try:
        branch = default_branch or "main"
        url = f"{GITHUB_API_URL}/repos/{full_name}/git/trees/{branch}?recursive=1"
        resp = await client.get(url, timeout=8.0)
        if resp.status_code != 200:
            return []
        data = resp.json()
        tree = data.get("tree", [])
        return [entry["path"] for entry in tree if entry.get("type") == "blob" and "path" in entry]
    except Exception:
        return []


async def _search_query(client: httpx.AsyncClient, query: str) -> List[Dict[str, Any]]:
    try:
        params = {
            "q": query,
            "sort": "stars",
            "order": "desc",
            "per_page": str(MAX_RESULTS_PER_QUERY),
        }
        resp = await client.get(f"{GITHUB_API_URL}/search/repositories", params=params, timeout=10.0)
        if resp.status_code != 200:
            return []
        data = resp.json()
        return data.get("items", []) or []
    except Exception:
        return []


async def _inspect_candidate(
    client: httpx.AsyncClient, repo_item: Dict[str, Any]
) -> Optional[GitHubCandidateRepo]:
    full_name = repo_item.get("full_name") or repo_item.get("name")
    if not full_name:
        return None

    readme, files = await asyncio.gather(
        _get_repository_readme(client, full_name),
        _get_repository_files(client, full_name, repo_item.get("default_branch", "main")),
    )

    trimmed_readme = readme.strip() if isinstance(readme, str) else ""
    if len(trimmed_readme) < 150:
        return None

    # Check if code files exist
    has_code_file = any(CODE_EXTENSION_REGEX.search(f) for f in files)
    has_language_code = bool(repo_item.get("language")) and (repo_item.get("size") or 0) > 0

    if not (has_code_file or has_language_code):
        return None

    return GitHubCandidateRepo(
        id=repo_item.get("id", 0),
        name=repo_item.get("name", ""),
        full_name=full_name,
        html_url=repo_item.get("html_url", f"https://github.com/{full_name}"),
        description=repo_item.get("description") or "",
        language=repo_item.get("language"),
        size=repo_item.get("size", 0),
        default_branch=repo_item.get("default_branch", "main"),
        readme=trimmed_readme,
        files=files,
        raw_data=repo_item,
    )


async def _run_github_search(input_data: GitHubSearchInput) -> GitHubSearchOutput:
    clean_queries = [
        q.strip() for q in input_data.searchQueries if isinstance(q, str) and q.strip()
    ]
    if not clean_queries:
        return GitHubSearchOutput(repositories=[])

    async with httpx.AsyncClient(headers=_github_headers()) as client:
        # Search queries concurrently
        search_results = await asyncio.gather(
            *[_search_query(client, q) for q in clean_queries]
        )
        flat_results = [item for sublist in search_results for item in sublist]
        deduped = remove_duplicate_repositories(flat_results)[:MAX_REPOSITORIES]

        # Inspect candidate repositories concurrently
        candidate_tasks = [_inspect_candidate(client, repo) for repo in deduped]
        inspected = await asyncio.gather(*candidate_tasks)

        viable = [r for r in inspected if r is not None][:MAX_VIABLE_REPOSITORIES]
        return GitHubSearchOutput(repositories=viable)


github_search_tool = AgentTool(
    name="github_search_tool",
    description="Searches GitHub repositories by queries, fetches decoded README and git tree, enforces code existence & minimum 150-char README, returning up to 4 viable repos.",
    input_schema=GitHubSearchInput,
    output_schema=GitHubSearchOutput,
    func=_run_github_search,
)
