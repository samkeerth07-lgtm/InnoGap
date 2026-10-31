import pytest
from app.utils.deduplicate import remove_duplicate_repositories
from app.utils.openalex_utils import deduplicate_openalex_works


def test_remove_duplicate_repositories():
    repos = [
        {"id": 101, "name": "repo-a", "full_name": "user/repo-a"},
        {"id": 102, "name": "repo-b", "full_name": "user/repo-b"},
        {"id": 101, "name": "repo-a-dup", "full_name": "user/repo-a"},
        {"id": 103, "name": "repo-c", "full_name": "user/repo-c"},
    ]
    unique = remove_duplicate_repositories(repos)
    assert len(unique) == 3
    assert [r["id"] for r in unique] == [101, 102, 103]


def test_deduplicate_openalex_works():
    works = [
        {"id": "W1", "title": "Paper One", "doi": "10.1234/1"},
        {"id": "W2", "title": "Paper Two", "doi": "10.1234/2"},
        {"id": "W3", "title": "Paper One", "doi": "10.1234/1"},  # duplicate doi
        {"id": "W1", "title": "Paper One Different", "doi": "10.1234/3"},  # duplicate id
    ]
    unique = deduplicate_openalex_works(works)
    assert len(unique) == 2
    assert unique[0]["id"] == "W1"
    assert unique[1]["id"] == "W2"
