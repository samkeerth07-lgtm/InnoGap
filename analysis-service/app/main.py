import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import router as api_router
from app.config import settings
from app.schemas.errors import ErrorResponse

# Configure structured logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger("innogap.service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "InnoGap Analysis Service starting up on %s:%s (env=%s, model=%s)",
        settings.HOST,
        settings.PORT,
        settings.ENVIRONMENT,
        settings.OPENROUTER_MODEL,
    )
    yield
    logger.info("InnoGap Analysis Service shutting down")


app = FastAPI(
    title="InnoGap Analysis Service",
    description="Dedicated agentic AI analysis microservice for InnoGap. Evaluates novel software concepts, searches GitHub and OpenAlex, detects existing prior art, and identifies innovation gaps.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Basic Request Logging Middleware
@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    start_time = time.perf_counter()
    client_ip = request.client.host if request.client else "unknown"
    logger.info("[REQUEST] %s %s (from %s)", request.method, request.url.path, client_ip)

    try:
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "[RESPONSE] %s %s -> status=%s (took %.2fms)",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        return response
    except Exception as exc:
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.error(
            "[ERROR] %s %s unhandled failure after %.2fms: %s",
            request.method,
            request.url.path,
            duration_ms,
            exc,
            exc_info=True,
        )
        raise exc


# Consistent Error Responses: Pydantic Validation Error (422)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    formatted_errors = [
        {"field": ".".join(str(loc) for loc in err["loc"]), "message": err["msg"]}
        for err in errors
    ]
    return JSONResponse(
        status_code=getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422),
        content=ErrorResponse(
            error="Validation Error",
            message="Invalid request payload or query parameters.",
            details=formatted_errors,
        ).model_dump(),
    )


# Consistent Error Responses: HTTP Exception (4xx/5xx)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    detail = exc.detail
    if isinstance(detail, dict):
        err_msg = detail.get("error", "HTTP Error")
        message = detail.get("message", None)
        details = detail.get("details", None)
    else:
        err_msg = str(detail)
        message = None
        details = None

    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=err_msg,
            message=message,
            details=details,
        ).model_dump(),
    )


# Consistent Error Responses: Generic Unhandled Exception (500)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled server exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="Internal Server Error",
            message=str(exc) if settings.DEBUG else "An unexpected error occurred while processing the request.",
        ).model_dump(),
    )


# Root Discovery Endpoint
@app.get("/", tags=["discovery"], include_in_schema=False)
async def root_discovery():
    return {
        "service": settings.SERVICE_NAME,
        "version": "1.0.0",
        "status": "healthy",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "health": "GET /health",
            "analyze_v1": "POST /api/v1/analyze",
            "analyze_legacy": "POST /api/analysis",
        },
    }


# Mount API Routes
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
