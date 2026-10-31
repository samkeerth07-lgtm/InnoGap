import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_missing_problem_statement_fails_validation():
    """Missing ProblemStatement must return 422 with validation error details."""
    response = client.post("/api/v1/analyze", json={"MySolution": "Some solution"})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"
    assert "details" in data
    assert any("ProblemStatement" in str(d) for d in data["details"])


def test_empty_string_problem_statement_fails_validation():
    """Empty ProblemStatement string must return 422."""
    response = client.post("/api/v1/analyze", json={"ProblemStatement": "", "MySolution": ""})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"


def test_whitespace_only_problem_statement_fails_validation():
    """Whitespace-only ProblemStatement must return 422."""
    response = client.post(
        "/api/v1/analyze", json={"ProblemStatement": "   \n  \t  ", "MySolution": ""}
    )
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"


def test_too_short_problem_statement_fails_validation():
    """ProblemStatement with fewer than 3 characters must return 422."""
    response = client.post("/api/v1/analyze", json={"ProblemStatement": "ab"})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"


def test_non_string_problem_statement_fails_validation():
    """Numeric or boolean ProblemStatement must return 422."""
    response = client.post("/api/v1/analyze", json={"ProblemStatement": 12345})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"


def test_empty_json_body_fails_validation():
    """Empty JSON body must return 422."""
    response = client.post("/api/v1/analyze", json={})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"
