import asyncio
from typing import Any, Dict, List
import httpx

from app.schemas.tools import (
    OpenAlexCandidateWork,
    OpenAlexSearchInput,
    OpenAlexSearchOutput,
)
from app.tools.base import AgentTool
from app.utils.openalex_utils import (
    deduplicate_openalex_works,
    reconstruct_abstract_text,
)

OPENALEX_API_URL = "https://api.openalex.org/works"


async def _search_openalex_query(client: httpx.AsyncClient, query: str) -> List[Dict[str, Any]]:
    try:
        params = {
            "search": query,
            "per-page": "5",
        }
        resp = await client.get(OPENALEX_API_URL, params=params, timeout=10.0)
        if resp.status_code != 200:
            return []
        data = resp.json()
        results = data.get("results", [])
        return results if isinstance(results, list) else []
    except Exception:
        return []


async def _run_openalex_search(input_data: OpenAlexSearchInput) -> OpenAlexSearchOutput:
    clean_queries = [
        q.strip() for q in input_data.searchQueries if isinstance(q, str) and q.strip()
    ]
    if not clean_queries:
        return OpenAlexSearchOutput(works=[])

    headers = {
        "User-Agent": "InnoGap-AgenticAI/1.0 (mailto:info@innogap.org)",
        "Accept": "application/json",
    }

    async with httpx.AsyncClient(headers=headers) as client:
        search_results = await asyncio.gather(
            *[_search_openalex_query(client, q) for q in clean_queries]
        )
        flat_results = [item for sublist in search_results for item in sublist]
        unique_works = deduplicate_openalex_works(flat_results)

        candidate_works: List[OpenAlexCandidateWork] = []
        for work in unique_works:
            title = work.get("title") or "Untitled research paper"
            raw_doi = work.get("doi") or ""
            clean_doi = str(raw_doi).replace("https://doi.org/", "").replace("http://doi.org/", "").strip()
            source_url = f"https://doi.org/{clean_doi}" if clean_doi else (work.get("id") or "")

            abstract_text = reconstruct_abstract_text(work.get("abstract_inverted_index"))
            venue_obj = work.get("host_venue") or work.get("primary_location", {}).get("source") or {}
            venue_name = venue_obj.get("display_name", "") if isinstance(venue_obj, dict) else ""

            candidate_works.append(
                OpenAlexCandidateWork(
                    id=str(work.get("id") or title),
                    title=title,
                    doi=clean_doi,
                    abstract_text=abstract_text,
                    publication_year=work.get("publication_year"),
                    host_venue=venue_name,
                    type=work.get("type", ""),
                    source_url=source_url,
                    raw_data=work,
                )
            )

        return OpenAlexSearchOutput(works=candidate_works)


openalex_search_tool = AgentTool(
    name="openalex_search_tool",
    description="Queries OpenAlex API for research papers matching queries, reconstructs abstracts from inverted indices, and deduplicates papers by ID, DOI, or title.",
    input_schema=OpenAlexSearchInput,
    output_schema=OpenAlexSearchOutput,
    func=_run_openalex_search,
)
