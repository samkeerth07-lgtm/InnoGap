from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger("innogap")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("InnoGap Python Agentic-AI backend started on port %s", settings.PORT)
    yield
    logger.info("InnoGap Python Agentic-AI backend shutting down")


app = FastAPI(
    title="InnoGap Backend",
    description="Agentic-AI backend for innovation gap analysis, searching open source repositories and academic literature.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware allowing the Frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
