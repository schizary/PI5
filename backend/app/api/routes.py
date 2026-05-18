import logging

from fastapi import APIRouter, HTTPException, status

from app.config import get_settings
from app.models.schemas import HealthResponse, PredictRequest, PredictResponse
from app.services.prediction_service import ModelNotLoadedError, prediction_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Sistema"])
def health_check() -> HealthResponse:
    """Verifica se a API está no ar e se o modelo está disponível."""
    settings = get_settings()
    model_loaded = prediction_service.is_loaded or settings.model_path.exists()

    return HealthResponse(
        status="ok",
        app=settings.app_name,
        version=settings.app_version,
        model_loaded=model_loaded,
    )


@router.post(
    "/predict",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    tags=["Classificação"],
    summary="Classificar respostas do formulário",
)
def predict(payload: PredictRequest) -> PredictResponse:
    """
    Recebe as respostas do formulário do app mobile,
    executa o modelo treinado e retorna a classificação com probabilidades.
    """
    try:
        result = prediction_service.predict(payload)
        logger.info(
            "Predição realizada: class=%s prob=%.4f",
            result.classification,
            result.probability,
        )
        return result
    except ModelNotLoadedError as exc:
        logger.error(str(exc))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.exception("Erro inesperado na predição: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao processar a predição.",
        ) from exc
