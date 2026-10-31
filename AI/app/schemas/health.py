from datetime import datetime, timezone
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Overall health status of the analysis service")
    service: str = Field(default="innogap-analysis-service", description="Service identifier")
    version: str = Field(default="1.0.0", description="API version")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="Current UTC timestamp in ISO-8601 format",
    )
    environment: str = Field(default="development", description="Runtime environment")
