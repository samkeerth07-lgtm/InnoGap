import pytest
from app.schemas.solutions import SimilarityInfo, UnifiedSolution
from app.tools.verdict_tool import compute_deterministic_verdict


def test_verdict_empty_solutions():
    result = compute_deterministic_verdict([])
    assert result.overallResult == "No Similar Solution"
    assert "No related solutions were found" in result.overallResultNote


def test_verdict_high_similarity():
    solutions = [
        UnifiedSolution(
            id="1",
            name="Repo A",
            similarity=SimilarityInfo(similarity="Low", reason="Somewhat related"),
        ),
        UnifiedSolution(
            id="2",
            name="Repo B",
            similarity=SimilarityInfo(similarity="High", reason="Direct match"),
        ),
    ]
    result = compute_deterministic_verdict(solutions)
    assert result.overallResult == "Existing"
    assert "highly similar" in result.overallResultNote


def test_verdict_medium_similarity():
    solutions = [
        UnifiedSolution(
            id="1",
            name="Repo A",
            similarity=SimilarityInfo(similarity="Low", reason="Minor overlap"),
        ),
        UnifiedSolution(
            id="2",
            name="Repo B",
            similarity=SimilarityInfo(similarity="Medium", reason="Partial overlap"),
        ),
    ]
    result = compute_deterministic_verdict(solutions)
    assert result.overallResult == "Partially Existing"
    assert "partially match" in result.overallResultNote.lower() or "not appear to completely match" in result.overallResultNote.lower()


def test_verdict_low_similarity():
    solutions = [
        UnifiedSolution(
            id="1",
            name="Repo A",
            similarity=SimilarityInfo(similarity="Low", reason="Minor overlap"),
        )
    ]
    result = compute_deterministic_verdict(solutions)
    assert result.overallResult == "Related"
    assert "limited similarity" in result.overallResultNote


def test_verdict_unknown_similarity():
    solutions = [
        UnifiedSolution(
            id="1",
            name="Repo A",
            similarity=SimilarityInfo(similarity="None", reason="No overlap"),
        )
    ]
    result = compute_deterministic_verdict(solutions)
    assert result.overallResult == "No Similar Solution"
