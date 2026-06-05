import { useEffect, useState } from "react";
import {
  AQ_QUESTIONS,
  ETHNICITY_OPTIONS,
  RELATION_OPTIONS,
  type EthnicityValue,
  type RelationValue,
} from "../constants/questions";
import type { PredictPayload } from "../types/predict";
import "./Questionnaire.css";

type YesNo = "yes" | "no";

const defaultScores = Array(10).fill(0) as number[];

type QuestionnaireProps = {
  apiOnline: boolean | null;
  modelLoaded: boolean;
  onAnalyze: (payload: PredictPayload) => void;
  onBack: () => void;
  externalError?: string | null;
};

export function Questionnaire({
  apiOnline,
  modelLoaded,
  onAnalyze,
  onBack,
  externalError,
}: QuestionnaireProps) {
  const [scores, setScores] = useState<number[]>(defaultScores);
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState<"m" | "f">("m");
  const [ethnicity, setEthnicity] = useState<EthnicityValue>(
    ETHNICITY_OPTIONS[0].value,
  );
  const [jundice, setJundice] = useState<YesNo>("no");
  const [austim, setAustim] = useState<YesNo>("no");
  const [country, setCountry] = useState("Brazil");
  const [usedAppBefore, setUsedAppBefore] = useState<YesNo>("no");
  const [relation, setRelation] = useState<RelationValue>(
    RELATION_OPTIONS[0].value,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  const setScore = (index: number, value: 0 | 1) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!apiOnline) {
      setError("Ops! A API está offline — liga o backend e tenta de novo.");
      return;
    }
    if (!modelLoaded) {
      setError("O modelo ainda não foi treinado. Rode o treino no backend primeiro.");
      return;
    }

    const ageNum = parseFloat(age);
    if (Number.isNaN(ageNum) || ageNum < 1) {
      setError("Coloca uma idade válida, por favor.");
      return;
    }

    const payload: PredictPayload = {
      A1_Score: scores[0],
      A2_Score: scores[1],
      A3_Score: scores[2],
      A4_Score: scores[3],
      A5_Score: scores[4],
      A6_Score: scores[5],
      A7_Score: scores[6],
      A8_Score: scores[7],
      A9_Score: scores[8],
      A10_Score: scores[9],
      age: ageNum,
      gender,
      ethnicity,
      jundice,
      austim,
      contry_of_res: country.trim(),
      used_app_before: usedAppBefore,
      age_desc: "18 and more",
      relation,
    };

    onAnalyze(payload);
  };

  return (
    <section className="questionnaire section">
      <div className="questionnaire-header">
        <div>
          <h2>Bora responder?</h2>
          <p className="questionnaire-hint">
            Marca o que combina com você em cada frase. Leva poucos minutos e é
            só informativo — sem pressão.
          </p>
        </div>
        <button type="button" className="btn btn-outline" onClick={onBack}>
          Voltar
        </button>
      </div>

      {error ? <div className="form-error">{error}</div> : null}

      <form className="questionnaire-form" onSubmit={handleSubmit}>
        <fieldset className="form-fieldset">
          <legend>Perguntas</legend>
          {AQ_QUESTIONS.map((question, index) => (
            <article key={index} className="question-card">
              <p className="question-label">
                {index + 1}. {question}
              </p>
              <div className="score-toggle" role="group" aria-label={`Resposta ${index + 1}`}>
                <button
                  type="button"
                  className={`chip ${scores[index] === 0 ? "chip-active" : ""}`}
                  onClick={() => setScore(index, 0)}
                >
                  Não
                </button>
                <button
                  type="button"
                  className={`chip chip-yes ${scores[index] === 1 ? "chip-active" : ""}`}
                  onClick={() => setScore(index, 1)}
                >
                  Sim
                </button>
              </div>
            </article>
          ))}
        </fieldset>

        <fieldset className="form-fieldset">
          <legend>Só mais alguns detalhes</legend>

          <label className="form-label">
            Idade
            <input
              className="form-input"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ex.: 25"
              required
            />
          </label>

          <span className="form-label">Gênero</span>
          <div className="chip-row">
            {(["m", "f"] as const).map((g) => (
              <button
                key={g}
                type="button"
                className={`chip ${gender === g ? "chip-active" : ""}`}
                onClick={() => setGender(g)}
              >
                {g === "m" ? "Masculino" : "Feminino"}
              </button>
            ))}
          </div>

          <span className="form-label">Etnia</span>
          <div className="chip-wrap">
            {ETHNICITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`chip ${ethnicity === opt.value ? "chip-active" : ""}`}
                onClick={() => setEthnicity(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="form-label">
            País onde mora
            <input
              className="form-input"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ex.: Brazil"
              required
            />
          </label>

          <span className="form-label">Quem está respondendo?</span>
          <div className="chip-wrap">
            {RELATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`chip ${relation === opt.value ? "chip-active" : ""}`}
                onClick={() => setRelation(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <YesNoField
            label="Teve icterícia quando bebê?"
            value={jundice}
            onChange={setJundice}
          />
          <YesNoField
            label="Alguém da família tem autismo?"
            value={austim}
            onChange={setAustim}
          />
          <YesNoField
            label="Já usou outro app de triagem?"
            value={usedAppBefore}
            onChange={setUsedAppBefore}
          />
        </fieldset>

        <button type="submit" className="btn btn-primary btn-submit">
          Ver meu resultado
        </button>
      </form>
    </section>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div className="yesno-row">
      <span className="form-label">{label}</span>
      <div className="chip-row">
        <button
          type="button"
          className={`chip ${value === "no" ? "chip-active" : ""}`}
          onClick={() => onChange("no")}
        >
          Não
        </button>
        <button
          type="button"
          className={`chip ${value === "yes" ? "chip-active" : ""}`}
          onClick={() => onChange("yes")}
        >
          Sim
        </button>
      </div>
    </div>
  );
}
