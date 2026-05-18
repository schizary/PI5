from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Raiz do projeto (pasta que contém app/, data/, artifacts/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """centraliza paths."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Autism Screening API"
    app_version: str = "1.0.0"
    debug: bool = False

    # Caminhos de dados e modelo
    csv_path: Path = PROJECT_ROOT / "data" / "autism_screening-1.csv"
    model_path: Path = PROJECT_ROOT / "artifacts" / "autism_classifier.joblib"

    # CORS — separar origens por vírgula no .env (ex.: http://localhost:8081)
    cors_origins: str = "*"

    # Treinamento
    test_size: float = 0.2
    random_state: int = 42

    @field_validator("csv_path", "model_path", mode="before")
    @classmethod
    def resolve_path(cls, value: str | Path) -> Path:
        path = Path(value)
        if not path.is_absolute():
            return PROJECT_ROOT / path
        return path

    @property
    def cors_origin_list(self) -> list[str]:
        if self.cors_origins.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
