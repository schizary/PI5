"""
script de treinamento do classificador.
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from app.config import get_settings
from app.ml.constants import (
    FEATURE_COLUMNS,
    INVERSE_TARGET_LABELS,
    SCORE_COLUMNS,
    TARGET_COLUMN,
    TARGET_LABELS,
)
from app.ml.preprocessing import build_model_pipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


def load_dataset(csv_path: Path) -> pd.DataFrame:
    """carrega e valida o CSV."""
    if not csv_path.exists():
        raise FileNotFoundError(f"arquivo CSV não encontrado: {csv_path}")

    df = pd.read_csv(csv_path)
    missing = set(FEATURE_COLUMNS + [TARGET_COLUMN]) - set(df.columns)
    if missing:
        raise ValueError(f"colunas ausentes no CSV: {sorted(missing)}")

    return df


def prepare_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """faz normaluzacao e calcula o resultado."""
    data = df.copy()

    # Garante pontuação total (soma das 10 perguntas AQ-10)
    if data["result"].isna().any():
        data["result"] = data[SCORE_COLUMNS].sum(axis=1)
    else:
        computed = data[SCORE_COLUMNS].sum(axis=1)
        data["result"] = data["result"].fillna(computed)

    X = data[FEATURE_COLUMNS].copy()
    y = (
        data[TARGET_COLUMN]
        .astype(str)
        .str.strip()
        .str.upper()
        .map(TARGET_LABELS)
    )

    if y.isna().any():
        invalid = data.loc[y.isna(), TARGET_COLUMN].unique()
        raise ValueError(f"valores inválidos em '{TARGET_COLUMN}': {invalid}")

    return X, y


def train_and_save() -> float:
    """treina o modelo, exibe as metricas ."""
    settings = get_settings()
    logger.info("Carregando dataset: %s", settings.csv_path)

    df = load_dataset(settings.csv_path)
    X, y = prepare_features(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=settings.test_size,
        random_state=settings.random_state,
        stratify=y,
    )

    pipeline = build_model_pipeline(random_state=settings.random_state)
    logger.info("iniciando treinamento ...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    logger.info("porcentagem de precisao no conjunto de teste: %.4f", accuracy)
    logger.info(
        "\n%s",
        classification_report(
            y_test,
            y_pred,
            target_names=[INVERSE_TARGET_LABELS[i] for i in sorted(INVERSE_TARGET_LABELS)],
        ),
    )

    settings.model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, settings.model_path)
    logger.info("model salvo em: %s", settings.model_path)

    return accuracy


def main() -> None:
    try:
        accuracy = train_and_save()
        print(f"\nprecisao: {accuracy:.4f}")
    except Exception as exc:
        logger.exception("FALHA NO TREINAMENTO: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
