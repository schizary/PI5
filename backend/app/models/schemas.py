from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.ml.constants import SCORE_COLUMNS


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    model_loaded: bool


class PredictRequest(BaseModel):
    """
    dados do formulário, ta meio ruim de entender
    """

    model_config = ConfigDict(populate_by_name=True)

    A1_Score: int = Field(..., ge=0, le=1, description="Resposta pergunta 1 (0 ou 1)")
    A2_Score: int = Field(..., ge=0, le=1)
    A3_Score: int = Field(..., ge=0, le=1)
    A4_Score: int = Field(..., ge=0, le=1)
    A5_Score: int = Field(..., ge=0, le=1)
    A6_Score: int = Field(..., ge=0, le=1)
    A7_Score: int = Field(..., ge=0, le=1)
    A8_Score: int = Field(..., ge=0, le=1)
    A9_Score: int = Field(..., ge=0, le=1)
    A10_Score: int = Field(..., ge=0, le=1)

    age: float = Field(..., ge=0, le=120, description="Idade em anos")
    gender: Literal["m", "f"] = Field(..., description="Gênero: m ou f")
    ethnicity: str = Field(..., min_length=1, max_length=100)
    jundice: Literal["yes", "no"] = Field(..., description="Icterícia ao nascer")
    austim: Literal["yes", "no"] = Field(
        ...,
        description="Histórico familiar de autismo (coluna 'austim' do dataset)",
    )
    contry_of_res: str = Field(..., min_length=1, max_length=100, alias="country")
    used_app_before: Literal["yes", "no"]
    age_desc: Literal["18 and more"] = Field(
        default="18 and more",
        description="Faixa etária (dataset utiliza principalmente '18 and more')",
    )
    relation: str = Field(
        ...,
        min_length=1,
        max_length=80,
        description="Ex.: Self, Parent, Relative, Health care professional",
    )

    result: float | None = Field(
        default=None,
        ge=0,
        le=10,
        description="Soma das pontuações A1–A10; calculada automaticamente se omitida",
    )

    @field_validator(
        "ethnicity",
        "contry_of_res",
        "relation",
        mode="before",
    )
    @classmethod
    def strip_strings(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()
        return value

    @model_validator(mode="after")
    def compute_result(self) -> "PredictRequest":
        scores = [getattr(self, col) for col in SCORE_COLUMNS]
        total = float(sum(scores))
        if self.result is None:
            self.result = total
        elif abs(self.result - total) > 0.01:
            # Prioriza consistência com as respostas do questionário
            self.result = total
        return self

    def to_feature_dict(self) -> dict:
        """Converte para dict compatível com o DataFrame de treino."""
        return {
            "A1_Score": self.A1_Score,
            "A2_Score": self.A2_Score,
            "A3_Score": self.A3_Score,
            "A4_Score": self.A4_Score,
            "A5_Score": self.A5_Score,
            "A6_Score": self.A6_Score,
            "A7_Score": self.A7_Score,
            "A8_Score": self.A8_Score,
            "A9_Score": self.A9_Score,
            "A10_Score": self.A10_Score,
            "age": self.age,
            "gender": self.gender,
            "ethnicity": self.ethnicity,
            "jundice": self.jundice,
            "austim": self.austim,
            "contry_of_res": self.contry_of_res,
            "used_app_before": self.used_app_before,
            "result": self.result,
            "age_desc": self.age_desc,
            "relation": self.relation,
        }


class PredictResponse(BaseModel):
    classification: Literal["YES", "NO"]
    probability: float = Field(..., ge=0, le=1, description="Confiança na classe predita")
    probabilities: dict[str, float] = Field(
        ...,
        description="Probabilidades por classe (NO e YES)",
    )
    message: str
