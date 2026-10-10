import json
import re
from typing import Any, Dict, Optional, Type, TypeVar
from pydantic import BaseModel
from openai import AsyncOpenAI
from app.config import settings

T = TypeVar("T", bound=BaseModel)


def clean_and_extract_json(text: str) -> Dict[str, Any]:
    """
    Tolerantly extracts and parses JSON from model response text:
    - Strips markdown code blocks (```json ... ```)
    - Finds the outer-most balanced or first {...} JSON object
    """
    if not text or not isinstance(text, str):
        raise ValueError("Empty or non-string response text received from LLM.")

    # Remove code blocks
    cleaned = re.sub(r"^```[a-zA-Z]*\n?", "", text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE)
    cleaned = cleaned.strip()

    # Try direct parse first
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Find the outer JSON object { ... }
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start : end + 1]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            # Try to fix common json issues like trailing commas
            fixed = re.sub(r",\s*([}\]])", r"\1", candidate)
            return json.loads(fixed)

    raise ValueError(f"Could not locate a valid JSON object in text: {text[:200]}...")


class LLMClient:
    def __init__(self):
        api_key = settings.OPENROUTER_API_KEY or "dummy_key"
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url=settings.OPENROUTER_BASE_URL,
        )
        self.model = settings.OPENROUTER_MODEL

    async def call_json(
        self,
        prompt: str,
        output_schema: Type[T],
        temperature: float = 0.1,
        system_prompt: Optional[str] = None,
        max_retries: int = 2,
    ) -> T:
        """
        Executes an LLM chat completion expecting JSON matching output_schema.
        Retries up to max_retries times upon JSON parse or validation failure.
        """
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        last_error = None

        for attempt in range(max_retries + 1):
            try:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature,
                )

                content = response.choices[0].message.content or ""
                parsed_json = clean_and_extract_json(content)
                validated_obj = output_schema.model_validate(parsed_json)
                return validated_obj

            except Exception as e:
                last_error = e
                # On retry, instruct model to strictly format valid JSON
                if attempt < max_retries:
                    retry_msg = (
                        f"Your previous response was invalid JSON or did not match the expected schema ({str(e)}). "
                        "Please output ONLY the raw, strictly valid JSON object conforming to the required schema."
                    )
                    messages.append({"role": "user", "content": retry_msg})

        raise RuntimeError(
            f"Failed to obtain valid response from LLM after {max_retries + 1} attempts: {last_error}"
        )


llm_client = LLMClient()
