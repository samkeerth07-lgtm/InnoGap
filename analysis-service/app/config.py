import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Search for .env across current working directory, service directory, and parent repo roots
env_paths = [
    Path.cwd() / ".env",
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent / "Backend" / ".env",
    Path(__file__).resolve().parent.parent.parent / "AI" / ".env",
]

for p in env_paths:
    if p.is_file():
        load_dotenv(dotenv_path=p, override=False)
        break
else:
    load_dotenv()


class Settings:
    SERVICE_NAME: str = os.getenv("SERVICE_NAME", "innogap-analysis-service")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() in ("true", "1", "yes")

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # OpenRouter LLM Configuration
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = os.getenv(
        "OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"
    )
    OPENROUTER_MODEL: str = os.getenv(
        "OPENROUTER_MODEL", "openrouter/free"
    )

    # External Provider Credentials
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    OPENALEX_API_KEY: str = os.getenv("OPENALEX_API_KEY", "")

    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:5000,http://127.0.0.1:5000",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
