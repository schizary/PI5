export type PredictPayload = {
  A1_Score: number;
  A2_Score: number;
  A3_Score: number;
  A4_Score: number;
  A5_Score: number;
  A6_Score: number;
  A7_Score: number;
  A8_Score: number;
  A9_Score: number;
  A10_Score: number;
  age: number;
  gender: "m" | "f";
  ethnicity: string;
  jundice: "yes" | "no";
  austim: "yes" | "no";
  contry_of_res: string;
  used_app_before: "yes" | "no";
  age_desc: "18 and more";
  relation: string;
};

export type PredictResponse = {
  classification: "YES" | "NO";
  probability: number;
  probabilities: { NO: number; YES: number };
  message: string;
};
