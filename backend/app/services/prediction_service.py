from __future__ import annotations

import logging
from pathlib import Path

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline

from app.config import Settings, get_settings
from app.ml.constants import FEATURE_COLUMNS, INVERSE_TARGET_LABELS
from app.models.schemas import PredictRequest, PredictResponse

logger = logging.getLogger(__name__)


class ModelNotLoadedError(Exception):
    """manda quando o modelo nao esta carregando."""


class PredictionService:
    """logica de predicao."""

    def __init__(self, settings: Settings | None = None) -> None:
        self._settings = settings or get_settings()
        self._pipeline: Pipeline | None = None

    @property
    def is_loaded(self) -> bool:
        return self._pipeline is not None

    @property
    def model_path(self) -> Path:
        return self._settings.model_path

    def load_model(self) -> None:
        """carrega o pipeline treinado."""
        path = self.model_path
        if not path.exists():
            raise ModelNotLoadedError(
                f"model nao encontrado em '{path}'. "
                "Execute: python -m app.ml.train"
            )

        self._pipeline = joblib.load(path)

    def predict(self, payload: PredictRequest) -> PredictResponse:
        """faz a classificacao."""
        if self._pipeline is None:
            self.load_model()

        assert self._pipeline is not None

        record = payload.to_feature_dict()
        df = pd.DataFrame([record], columns=FEATURE_COLUMNS)

        prediction = int(self._pipeline.predict(df)[0])
        proba = self._pipeline.predict_proba(df)[0]

        label = INVERSE_TARGET_LABELS[prediction]
        confidence = float(proba[prediction])

        probabilities = {
            INVERSE_TARGET_LABELS[i]: float(proba[i])
            for i in range(len(proba))
        }

        message = (
            "Indicativo de triagem positiva para TEA (autismo)."
            if label == "YES"
            else "Triagem sem indicativo forte para TEA."
        )

        return PredictResponse(
            classification=label,  # type: ignore[arg-type]
            probability=round(confidence, 4),
            probabilities={
                "NO": round(probabilities.get("NO", 0.0), 4),
                "YES": round(probabilities.get("YES", 0.0), 4),
            },
            message=message,
        )


# Instância única reutilizada pelos endpoints
prediction_service = PredictionService()
