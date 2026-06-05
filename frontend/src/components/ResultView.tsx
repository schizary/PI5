import type { PredictResponse } from "../types/predict";
import { NearbyClinics } from "./NearbyClinics";
import "./Questionnaire.css";

type ResultViewProps = {
  result: PredictResponse;
  onRetry: () => void;
  onHome: () => void;
};

export function ResultView({ result, onRetry, onHome }: ResultViewProps) {
  const yesPercent = Math.round(result.probabilities.YES * 100);
  const noPercent = Math.round(result.probabilities.NO * 100);

  return (
    <section className="questionnaire section result-section">
      <img src="/logo.png" alt="" className="result-logo" aria-hidden />

      <h2>Seu resultado</h2>
      <p className="result-lead">
        Com base no questionário, o modelo estimou o seguinte (só para fins
        informativos):
      </p>

      <div className="result-score-card">
        <p className="result-score-label">Indicador informativo</p>
        <p className="result-score-big">
          {yesPercent}
          <span>%</span>
        </p>
        <p className="result-score-desc">
          probabilidade associada a traços do espectro autista nas suas respostas
        </p>
        <div className="result-bars">
          <div className="result-bar-row">
            <span>Outro perfil</span>
            <div className="result-bar-track">
              <div className="result-bar-fill bar-no" style={{ width: `${noPercent}%` }} />
            </div>
            <span>{noPercent}%</span>
          </div>
          <div className="result-bar-row">
            <span>Espectro</span>
            <div className="result-bar-track">
              <div className="result-bar-fill bar-yes" style={{ width: `${yesPercent}%` }} />
            </div>
            <span>{yesPercent}%</span>
          </div>
        </div>
      </div>

      <p className="result-message">{result.message}</p>

      <div className="cta-professional">
        <p className="cta-professional-text">
          Ainda tem dúvidas? Procure um profissional perto de você!
        </p>
        <NearbyClinics />
      </div>

      <p className="result-footnote">
        Ferramenta acadêmica do PI5. Isso não é diagnóstico — converse com quem
        entende do assunto na saúde.
      </p>

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Fazer de novo
        </button>
        <button type="button" className="btn btn-outline" onClick={onHome}>
          Voltar ao início
        </button>
      </div>
    </section>
  );
}
