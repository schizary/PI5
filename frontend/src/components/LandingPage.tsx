import { APP_NAME } from "../constants/brand";
import { getApiDocsUrl } from "../services/api";

type LandingPageProps = {
  apiOnline: boolean | null;
  modelLoaded: boolean;
  onStartQuestionnaire: () => void;
};

export function LandingPage({
  apiOnline,
  modelLoaded,
  onStartQuestionnaire,
}: LandingPageProps) {
  return (
    <>
      <section className="hero">
        <div>
          <span className="hero-badge">Oi, bem-vindo(a) 👋</span>
          <h1>Entender o espectro autista pode começar por aqui</h1>
          <p>
            O {APP_NAME} é um projeto do PI5 para ajudar na triagem informativa — no
            navegador ou no celular. Responde umas perguntas, vê uma estimativa e,
            se quiser, busca ajuda profissional perto de você.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStartQuestionnaire}
            >
              Começar questionário
            </button>
            <a className="btn btn-outline" href="#mobile">
              App no celular
            </a>
          </div>
        </div>

        <aside className="hero-card">
          <img src="/logo.png" alt="" className="hero-logo" aria-hidden />
          <h3>Como estamos?</h3>
          <div className="status-row">
            <span>
              <span
                className={`status-dot ${apiOnline ? "ok" : apiOnline === false ? "off" : ""}`}
              />
              Servidor
            </span>
            <strong>
              {apiOnline === null
                ? "Verificando…"
                : apiOnline
                  ? "Online"
                  : "Offline"}
            </strong>
          </div>
          <div className="status-row">
            <span>Modelo</span>
            <strong>{modelLoaded ? "Pronto" : "Treinar no backend"}</strong>
          </div>
          <p className="hero-card-note">
            Tudo isso é educativo — na dúvida, fala com um profissional de saúde.
          </p>
        </aside>
      </section>

      <section id="sobre" className="section">
        <h2>Sobre o {APP_NAME}</h2>
        <p>
          Nasceu no PI5 para conscientizar e dar uma primeira luz com base no
          questionário AQ-10. Não substitui consulta, laudo ou acompanhamento.
        </p>
        <div className="disclaimer">
          Ferramenta de estudo. Cada pessoa é única — se algo te preocupa, vale
          marcar conversa com quem entende do assunto.
        </div>
      </section>

      <section id="como-funciona" className="section">
        <h2>Como funciona</h2>
        <p>Simples: você responde, a gente calcula, você decide o próximo passo.</p>
        <div className="cards">
          <article className="card card-blue">
            <div className="card-emoji">🧩</div>
            <h3>Questionário na web</h3>
            <p>
              Responde aqui mesmo, vê uma porcentagem informativa e pode buscar
              clínicas perto de você.
            </p>
          </article>
          <article className="card card-yellow" id="mobile">
            <div className="card-emoji">📱</div>
            <h3>App no celular</h3>
            <p>Mesmas perguntas no Expo, para quem prefere o mobile.</p>
          </article>
          <article className="card card-green">
            <div className="card-emoji">🤖</div>
            <h3>Inteligência por trás</h3>
            <p>
              Um modelo de machine learning no backend analisa as respostas.{" "}
              <a href={getApiDocsUrl()} target="_blank" rel="noreferrer">
                Ver API
              </a>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
