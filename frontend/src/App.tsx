import { useEffect, useState } from "react";
import { AnalysisLoading } from "./components/AnalysisLoading";
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { Questionnaire } from "./components/Questionnaire";
import { ResultView } from "./components/ResultView";
import { fetchHealth } from "./services/api";
import type { PredictPayload, PredictResponse } from "./types/predict";
import "./App.css";

type View = "landing" | "questionnaire" | "analyzing" | "result";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [pendingPayload, setPendingPayload] = useState<PredictPayload | null>(null);
  const [questionnaireError, setQuestionnaireError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        setApiOnline(true);
        setModelLoaded(data.model_loaded);
      })
      .catch(() => setApiOnline(false));
  }, []);

  const goHome = () => {
    setView("landing");
    setResult(null);
    setPendingPayload(null);
  };

  const goQuestionnaire = () => {
    setView("questionnaire");
    setResult(null);
    setPendingPayload(null);
    setQuestionnaireError(null);
  };

  const handleAnalyze = (payload: PredictPayload) => {
    setQuestionnaireError(null);
    setPendingPayload(payload);
    setView("analyzing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResult = (data: PredictResponse) => {
    setResult(data);
    setPendingPayload(null);
    setView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnalyzeError = (message: string) => {
    setPendingPayload(null);
    setQuestionnaireError(message);
    setView("questionnaire");
  };

  return (
    <Layout
      currentView={view === "analyzing" ? "questionnaire" : view}
      onGoHome={goHome}
      onGoQuestionnaire={goQuestionnaire}
    >
      {view === "landing" && (
        <LandingPage
          apiOnline={apiOnline}
          modelLoaded={modelLoaded}
          onStartQuestionnaire={goQuestionnaire}
        />
      )}

      {view === "questionnaire" && (
        <Questionnaire
          apiOnline={apiOnline}
          modelLoaded={modelLoaded}
          onAnalyze={handleAnalyze}
          onBack={goHome}
          externalError={questionnaireError}
        />
      )}

      {view === "analyzing" && pendingPayload && (
        <AnalysisLoading
          payload={pendingPayload}
          onComplete={handleResult}
          onError={handleAnalyzeError}
        />
      )}

      {view === "result" && result && (
        <ResultView
          result={result}
          onRetry={goQuestionnaire}
          onHome={goHome}
        />
      )}
    </Layout>
  );
}
