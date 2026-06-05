import { useEffect, useState } from "react";
import { predict } from "../services/api";
import type { PredictPayload, PredictResponse } from "../types/predict";
import "./AnalysisLoading.css";

type AnalysisLoadingProps = {
  payload: PredictPayload;
  onComplete: (result: PredictResponse) => void;
  onError: (message: string) => void;
};

const MIN_DURATION_MS = 2800;

export function AnalysisLoading({
  payload,
  onComplete,
  onError,
}: AnalysisLoadingProps) {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [statusText, setStatusText] = useState("Lendo suas respostas…");

  useEffect(() => {
    let cancelled = false;
    let apiResult: PredictResponse | null = null;
    let apiError: string | null = null;
    const start = Date.now();

    predict(payload)
      .then((result) => {
        apiResult = result;
      })
      .catch((err) => {
        apiError =
          err instanceof Error ? err.message : "Erro ao consultar a API.";
      });

    const interval = setInterval(() => {
      if (cancelled) return;
      const elapsed = Date.now() - start;
      const target = apiResult
        ? Math.round(apiResult.probabilities.YES * 100)
        : Math.min(88, Math.floor((elapsed / MIN_DURATION_MS) * 88));

      setDisplayPercent(target);

      if (elapsed < MIN_DURATION_MS * 0.4) {
        setStatusText("Lendo suas respostas…");
      } else if (elapsed < MIN_DURATION_MS * 0.75) {
        setStatusText("Analisando o questionário…");
      } else {
        setStatusText(apiResult ? "Resultado pronto!" : "Só mais um instante…");
      }
    }, 40);

    const finishTimer = setTimeout(async () => {
      clearInterval(interval);
      if (cancelled) return;

      const deadline = Date.now() + 12000;
      while (!apiResult && !apiError && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 120));
      }

      if (apiError) {
        onError(apiError);
        return;
      }
      if (!apiResult) {
        onError("Não foi possível calcular o resultado. Verifique se a API está no ar.");
        return;
      }

      const finalPercent = Math.round(apiResult.probabilities.YES * 100);
      setDisplayPercent(finalPercent);
      setStatusText("Pronto!");
      await new Promise((r) => setTimeout(r, 550));
      if (!cancelled) onComplete(apiResult);
    }, MIN_DURATION_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(finishTimer);
    };
  }, [payload, onComplete, onError]);

  return (
    <section className="analysis section">
      <img src="/logo.png" alt="" className="analysis-logo" aria-hidden />
      <h2 className="analysis-title">Calculando seu resultado</h2>
      <p className="analysis-status">{statusText}</p>

      <div
        className="analysis-ring"
        style={{ "--p": displayPercent } as React.CSSProperties}
      >
        <svg viewBox="0 0 120 120" className="analysis-svg" aria-hidden>
          <circle className="analysis-track" cx="60" cy="60" r="52" />
          <circle className="analysis-fill" cx="60" cy="60" r="52" />
        </svg>
        <div className="analysis-percent">
          <span className="analysis-number">{displayPercent}</span>
          <span className="analysis-suffix">%</span>
        </div>
      </div>

      <p className="analysis-caption">
        Chance informativa de traços associados ao espectro, com base nas suas
        respostas — não substitui avaliação com profissional.
      </p>
    </section>
  );
}
