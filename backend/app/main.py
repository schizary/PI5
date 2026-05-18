"""
Ponto de entrada da API FastAPI.

Executar localmente:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router
from app.config import get_settings
from app.services.prediction_service import ModelNotLoadedError, prediction_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Carrega o modelo na inicialização quando o arquivo existir."""
    settings = get_settings()
    logger.info("Iniciando %s v%s", settings.app_name, settings.app_version)

    if settings.model_path.exists():
        try:
            prediction_service.load_model()
        except Exception as exc:
            logger.warning("Modelo não carregado na inicialização: %s", exc)
    else:
        logger.warning(
            "Modelo ausente em %s. Execute: python -m app.ml.train",
            settings.model_path,
        )

    yield
    logger.info("Encerrando aplicação.")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "API acadêmica para classificação de triagem de autismo (TEA) "
            "com base no dataset AQ-10 / autism screening."
        ),
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        logger.warning("Payload inválido em %s: %s", request.url.path, exc.errors())
        return JSONResponse(
            status_code=422,
            content={"detail": "Dados do formulário inválidos.", "errors": exc.errors()},
        )

    @app.exception_handler(ModelNotLoadedError)
    async def model_not_loaded_handler(
        _: Request,
        exc: ModelNotLoadedError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={"detail": str(exc)},
        )

    return app


app = create_app()
