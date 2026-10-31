from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.analysis import AnalysisResponse
from app.schemas.verification import VerificationResult

client = TestClient(app)

MOCK_RESPONSE = AnalysisResponse(
    status="Analysis Complete",
    title="Real-time RAG Hallucination Detection",
    description="Analysis description test",
    overallResult="Partially Existing",
    overallResultNote="Found matching open source tools",
    proposed="Verification via NLI",
    existingTech=["Python", "FastAPI", "FAISS"],
    potentialGap="Real-time sub-100ms validation on edge devices",
    summary="Found 2 related repos and 1 paper",
    similarSolutions=[],
    verification=VerificationResult(
        passed=True,
        checks=["Evidence verified"],
        confidence=0.95,
        evidence=[],
        warnings=[],
    ),
)


def test_analyze_v1_success_with_orchestrator():
    """POST /api/v1/analyze delegates to orchestrator and returns 200."""
    with patch("app.api.v1.analysis.orchestrator_agent.execute", new_callable=AsyncMock) as mock_exec:
        mock_exec.return_value = MOCK_RESPONSE
        response = client.post(
            "/api/v1/analyze",
            json={
                "ProblemStatement": "Real-time RAG Hallucination Detection",
                "MySolution": "Verification via NLI",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["overallResult"] == "Partially Existing"
        assert data["title"] == "Real-time RAG Hallucination Detection"
        assert data["potentialGap"] == "Real-time sub-100ms validation on edge devices"
        assert mock_exec.called


def test_analyze_legacy_endpoint_success():
    """POST /api/analysis (gateway compatibility) behaves identically."""
    with patch("app.api.v1.analysis.orchestrator_agent.execute", new_callable=AsyncMock) as mock_exec:
        mock_exec.return_value = MOCK_RESPONSE
        response = client.post(
            "/api/analysis",
            json={
                "ProblemStatement": "Real-time RAG Hallucination Detection",
                "MySolution": "Verification via NLI",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["overallResult"] == "Partially Existing"


def test_orchestrator_failure_returns_500_structured_error():
    """When orchestrator raises an unexpected exception, API returns 500 with structured JSON."""
    with patch("app.api.v1.analysis.orchestrator_agent.execute", new_callable=AsyncMock) as mock_exec:
        mock_exec.side_effect = RuntimeError("OpenRouter API connection failed")
        response = client.post(
            "/api/v1/analyze",
            json={
                "ProblemStatement": "Valid problem statement for testing failure",
            },
        )
        assert response.status_code == 500
        data = response.json()
        assert "error" in data
        assert "OpenRouter API connection failed" in str(data)


def test_unknown_route_returns_404_structured_error():
    """Calling an unknown route returns 404 with structured error response."""
    response = client.get("/nonexistent-endpoint-path")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
