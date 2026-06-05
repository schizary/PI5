/** Perguntas AQ-10 simplificadas (mesmo conjunto do app mobile) */
export const AQ_QUESTIONS = [
  "Costumo notar pequenos sons quando estou em um ambiente barulhento.",
  "Costumo concentrar-me mais em todo o conjunto do que nos pequenos detalhes.",
  "Tenho dificuldade em fazer mais do que uma coisa de cada vez.",
  "Se houver uma interrupção, posso retomar facilmente o que estava a fazer.",
  "Acho fácil ler emoções nas pessoas através da expressão facial.",
  "Sei dizer se alguém que escuta a uma conversa está aborrecido ou entediado.",
  "Quando leio uma história, tenho dificuldade em perceber as intenções dos personagens.",
  "Gosto de recolher informações sobre categorias de coisas.",
  "Acho fácil imaginar como seria ser outra pessoa.",
  "Acho difícil fazer amizades com outras pessoas.",
] as const;

/** Rótulo em português; valor enviado à API (compatível com o dataset de treino). */
export const ETHNICITY_OPTIONS = [
  { label: "Branco / europeu", value: "White-European" },
  { label: "Latino / latino-americano", value: "Latino" },
  { label: "Asiático", value: "Asian" },
  { label: "Negro / afrodescendente", value: "Black" },
  { label: "Oriente Médio", value: "Middle Eastern" },
  { label: "Outro", value: "Others" },
] as const;

export const RELATION_OPTIONS = [
  { label: "Eu mesmo(a)", value: "Self" },
  { label: "Pai, mãe ou responsável", value: "Parent" },
  { label: "Parente", value: "Relative" },
  { label: "Profissional de saúde", value: "Health care professional" },
] as const;

export type EthnicityValue = (typeof ETHNICITY_OPTIONS)[number]["value"];
export type RelationValue = (typeof RELATION_OPTIONS)[number]["value"];
