from fastapi import APIRouter, status
from app.config import settings
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def get_health():
    """
    Primary health check endpoint.
    Reports operational status, service identifier, and API version.
    """
    return HealthResponse(
        status="ok",
        service=settings.SERVICE_NAME,
        version="1.0.0",
        environment=settings.ENVIRONMENT,
    )


@router.get("/api/health", status_code=status.HTTP_200_OK)
async def get_api_health_legacy():
    """
    Legacy health check endpoint matching the Node.js Express contract.
    """
    return {"message": "InnoGap backend is working"}
