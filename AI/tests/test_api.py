import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"message": "InnoGap backend is working"}


def test_analysis_empty_problem():
    response = client.post("/api/analysis", json={"ProblemStatement": "", "MySolution": ""})
    assert response.status_code == 400
    data = response.json()
    assert "ProblemStatement is required" in str(data)
