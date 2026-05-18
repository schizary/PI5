from typing import Final

# Colunas de entrada (questionário + metadados)
FEATURE_COLUMNS: Final[list[str]] = [
    "A1_Score",
    "A2_Score",
    "A3_Score",
    "A4_Score",
    "A5_Score",
    "A6_Score",
    "A7_Score",
    "A8_Score",
    "A9_Score",
    "A10_Score",
    "age",
    "gender",
    "ethnicity",
    "jundice",
    "austim",
    "contry_of_res",
    "used_app_before",
    "result",
    "age_desc",
    "relation",
]

TARGET_COLUMN: Final[str] = "Class/ASD"

# Mapeamento do alvo para o classificador
TARGET_LABELS: Final[dict[str, int]] = {"NO": 0, "YES": 1}
INVERSE_TARGET_LABELS: Final[dict[int, str]] = {0: "NO", 1: "YES"}

# Colunas categóricas tratadas com OneHotEncoder
CATEGORICAL_COLUMNS: Final[list[str]] = [
    "gender",
    "ethnicity",
    "jundice",
    "austim",
    "contry_of_res",
    "used_app_before",
    "age_desc",
    "relation",
]

NUMERIC_COLUMNS: Final[list[str]] = [
    "A1_Score",
    "A2_Score",
    "A3_Score",
    "A4_Score",
    "A5_Score",
    "A6_Score",
    "A7_Score",
    "A8_Score",
    "A9_Score",
    "A10_Score",
    "age",
    "result",
]

SCORE_COLUMNS: Final[list[str]] = [
    "A1_Score",
    "A2_Score",
    "A3_Score",
    "A4_Score",
    "A5_Score",
    "A6_Score",
    "A7_Score",
    "A8_Score",
    "A9_Score",
    "A10_Score",
]
