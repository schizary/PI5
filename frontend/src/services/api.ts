import type { PredictPayload, PredictResponse } from "../types/predict";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type HealthStatus = {
  status: string;
  app: string;
  version: string;
  model_loaded: boolean;
};

export async function fetchHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error("API indisponível");
  }
  return response.json();
}

export function getApiDocsUrl(): string {
  return `${API_URL}/docs`;
}

export function getApiBaseUrl(): string {
  return API_URL;
}

export async function predict(payload: PredictPayload): Promise<PredictResponse> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail =
      typeof body.detail === "string"
        ? body.detail
        : "Não foi possível obter a classificação.";
    throw new Error(detail);
  }

  return response.json();
}
