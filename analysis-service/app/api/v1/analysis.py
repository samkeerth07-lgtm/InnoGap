import logging
from fastapi import APIRouter, HTTPException, Query, status
from app.agents.orchestrator import orchestrator_agent
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.schemas.errors import ErrorResponse

logger = logging.getLogger("innogap.api.analysis")

router = APIRouter(tags=["analysis"])


@router.post(
    "/api/v1/analyze",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request / Missing parameters"},
        422: {"model": ErrorResponse, "description": "Validation Error"},
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
    },
)
async def analyze_idea_v1(
    request: AnalysisRequest,
    debug: bool = Query(default=False, description="Include execution trace if true"),
):
    """
    Main analysis endpoint (v1):
    Deconstructs problem statement, discovers open-source implementations on GitHub
    and academic literature on OpenAlex, performs functional relevance filtering,
    evaluates similarity, computes the deterministic verdict, and identifies the innovation gap.
    """
    try:
        response = await orchestrator_agent.execute(request, debug=debug)
        return response
    except Exception as e:
        logger.error("Analysis execution error: %s", e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Analysis failed", "message": str(e)},
        )


@router.post(
    "/api/analysis",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=True,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request"},
        422: {"model": ErrorResponse, "description": "Validation Error"},
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
    },
)
async def analyze_idea_legacy(
    request: AnalysisRequest,
    debug: bool = Query(default=False, description="Include execution trace if true"),
):
    """
    Gateway compatibility endpoint:
    Mirrors POST /api/v1/analyze for backwards-compatibility with Express API gateway.
    """
    return await analyze_idea_v1(request, debug=debug)
