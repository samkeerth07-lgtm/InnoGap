from typing import Any, Dict, List


def remove_duplicate_repositories(repositories: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicates repositories based on their unique ID or full_name."""
    unique_repositories = []
    seen_ids = set()

    for repo in repositories:
        repo_id = repo.get("id") or repo.get("full_name") or repo.get("name")
        if repo_id is not None:
            if repo_id not in seen_ids:
                seen_ids.add(repo_id)
                unique_repositories.append(repo)
        else:
            unique_repositories.append(repo)

    return unique_repositories
