import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current working directory or AI directory or root directory
env_paths = [
    Path.cwd() / ".env",
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent / "Backend" / ".env",
]

for p in env_paths:
    if p.is_file():
        load_dotenv(dotenv_path=p, override=False)
        break
else:
    load_dotenv()


class Settings:
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = os.getenv(
        "OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"
    )
    OPENROUTER_MODEL: str = os.getenv(
        "OPENROUTER_MODEL", "openrouter/free"
    )
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "5000"))
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]


settings = Settings()
