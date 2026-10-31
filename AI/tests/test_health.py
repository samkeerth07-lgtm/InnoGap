from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_primary_health_check_returns_200():
    """Test that GET /health returns HTTP 200 and expected health metadata."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "innogap-analysis-service"
    assert data["version"] == "1.0.0"
    assert "timestamp" in data
    assert "environment" in data


def test_legacy_health_check_returns_200():
    """Test that GET /api/health retains backwards-compatibility contract."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"message": "InnoGap backend is working"}


def test_root_discovery_endpoint_returns_200():
    """Test that GET / returns service discovery information."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "innogap-analysis-service"
    assert "endpoints" in data
    assert "health" in data["endpoints"]
    assert "analyze_v1" in data["endpoints"]
