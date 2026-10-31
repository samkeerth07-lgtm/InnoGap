from typing import Any, Dict


def validate_problem_analysis(analysis: Any) -> bool:
    """
    Validates that problem analysis contains expected structure:
    - searchQueries (non-empty list)
    - keyConcepts (list)
    - technologies (list)
    - actions (list)
    """
    if not analysis:
        return False

    if isinstance(analysis, dict):
        search_queries = analysis.get("searchQueries")
        key_concepts = analysis.get("keyConcepts")
        technologies = analysis.get("technologies")
        actions = analysis.get("actions")
    else:
        search_queries = getattr(analysis, "searchQueries", None)
        key_concepts = getattr(analysis, "keyConcepts", None)
        technologies = getattr(analysis, "technologies", None)
        actions = getattr(analysis, "actions", None)

    if not isinstance(search_queries, list) or len(search_queries) == 0:
        return False

    if not isinstance(key_concepts, list):
        return False

    if not isinstance(technologies, list):
        return False

    if not isinstance(actions, list):
        return False

    return True
