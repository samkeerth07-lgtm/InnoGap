from fastapi import APIRouter, HTTPException, Query, status
from app.agents.orchestrator import orchestrator_agent
from app.schemas.analysis import AnalysisRequest, AnalysisResponse

router = APIRouter(prefix="/api", tags=["analysis"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint matching Node.js backend contract."""
    return {"message": "InnoGap backend is working"}


@router.post("/analysis", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_problem(
    request: AnalysisRequest,
    debug: bool = Query(default=False, description="Include execution trace if true"),
):
    """
    Main analysis endpoint:
    Deconstructs problem statement, searches GitHub and OpenAlex, evaluates candidates,
    calculates verdict, determines the innovation gap, and executes verification pass.
    """
    if not request.ProblemStatement or not request.ProblemStatement.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "ProblemStatement is required"},
        )

    try:
        response = await orchestrator_agent.execute(request, debug=debug)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Analysis failed", "message": str(e)},
        )
