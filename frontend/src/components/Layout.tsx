import type { ReactNode } from "react";
import { APP_NAME } from "../constants/brand";

type View = "landing" | "questionnaire" | "result";

type LayoutProps = {
  children: ReactNode;
  currentView: View;
  onGoHome: () => void;
  onGoQuestionnaire: () => void;
};

export function Layout({
  children,
  currentView,
  onGoHome,
  onGoQuestionnaire,
}: LayoutProps) {
  return (
    <div className="page">
      <header className="header">
        <button type="button" className="logo-btn" onClick={onGoHome}>
          <img src="/logo.png" alt={APP_NAME} className="logo-img" />
          <span className="logo-text">{APP_NAME}</span>
        </button>
        <nav className="nav">
          {currentView === "landing" ? (
            <>
              <a href="#sobre">Sobre</a>
              <a href="#como-funciona">Como funciona</a>
            </>
          ) : null}
          <button
            type="button"
            className={`nav-btn ${currentView === "questionnaire" || currentView === "result" ? "nav-btn-active" : ""}`}
            onClick={onGoQuestionnaire}
          >
            Questionário
          </button>
        </nav>
      </header>

      {children}

      <footer className="footer">
        <p>{APP_NAME} · PI5 · feito com carinho para informar, não para diagnosticar</p>
      </footer>
    </div>
  );
}
