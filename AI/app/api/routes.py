from fastapi import APIRouter
from app.api.health import router as health_router
from app.api.v1.analysis import router as analysis_router

router = APIRouter()
router.include_router(health_router)
router.include_router(analysis_router)

__all__ = ["router", "health_router", "analysis_router"]
