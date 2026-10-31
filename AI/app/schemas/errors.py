from typing import Any, Optional
from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    error: str = Field(..., description="High-level error code or summary message")
    message: Optional[str] = Field(default=None, description="Detailed explanatory message")
    details: Optional[Any] = Field(default=None, description="Detailed context or field-level validation errors")
