from typing import Any, Dict, List, Optional


def reconstruct_abstract_text(abstract_inverted_index: Optional[Dict[str, Any]]) -> str:
    """
    Reconstructs an abstract text from OpenAlex's inverted index format:
    { "word": [positions] }
    """
    if not abstract_inverted_index or not isinstance(abstract_inverted_index, dict):
        return ""

    words_with_positions: List[Dict[str, Any]] = []

    for word, positions in abstract_inverted_index.items():
        if not isinstance(positions, list):
            continue
        for pos in positions:
            try:
                words_with_positions.append({
                    "position": int(pos),
                    "word": str(word),
                })
            except (ValueError, TypeError):
                continue

    if not words_with_positions:
        return ""

    words_with_positions.sort(key=lambda item: item["position"])
    return " ".join(item["word"] for item in words_with_positions)


def deduplicate_openalex_works(works: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicates OpenAlex works by id, doi, or title."""
    seen_ids = set()
    seen_dois = set()
    seen_titles = set()
    unique_works: List[Dict[str, Any]] = []

    for work in works:
        if not isinstance(work, dict):
            continue

        work_id = str(work.get("id", "")).strip().lower() if work.get("id") else None
        doi = str(work.get("doi", "")).strip().lower() if work.get("doi") else None
        title = str(work.get("title", "")).strip().lower() if work.get("title") else None

        if not (work_id or doi or title):
            continue

        # Check if any identifier was previously seen
        is_duplicate = False
        if work_id and work_id in seen_ids:
            is_duplicate = True
        if doi and doi in seen_dois:
            is_duplicate = True
        if title and title in seen_titles:
            is_duplicate = True

        if is_duplicate:
            continue

        if work_id:
            seen_ids.add(work_id)
        if doi:
            seen_dois.add(doi)
        if title:
            seen_titles.add(title)

        unique_works.append(work)

    return unique_works
