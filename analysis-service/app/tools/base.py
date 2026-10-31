import time
from typing import Any, Callable, Dict, Generic, Optional, Type, TypeVar
from pydantic import BaseModel
from app.schemas.tools import ToolTrace

InputT = TypeVar("InputT", bound=BaseModel)
OutputT = TypeVar("OutputT", bound=BaseModel)


class AgentTool(Generic[InputT, OutputT]):
    def __init__(
        self,
        name: str,
        description: str,
        input_schema: Type[InputT],
        output_schema: Type[OutputT],
        func: Callable[..., Any],
    ):
        self.name = name
        self.description = description
        self.input_schema = input_schema
        self.output_schema = output_schema
        self.func = func

    def get_tool_definition(self) -> Dict[str, Any]:
        """Exposes the tool as an OpenAI/OpenRouter compatible function-calling tool definition."""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.input_schema.model_json_schema(),
            },
        }

    async def run(self, input_data: InputT, trace_collector: Optional[list] = None) -> OutputT:
        start_time = time.perf_counter()
        success = True
        error_msg = None
        result: OutputT = None

        try:
            result = await self.func(input_data)
            return result
        except Exception as e:
            success = False
            error_msg = str(e)
            raise
        finally:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            if trace_collector is not None:
                summary = str(input_data.model_dump())
                if len(summary) > 120:
                    summary = summary[:117] + "..."
                trace_collector.append(
                    ToolTrace(
                        tool_name=self.name,
                        input_summary=summary,
                        duration_ms=duration_ms,
                        success=success,
                        error=error_msg,
                    )
                )
