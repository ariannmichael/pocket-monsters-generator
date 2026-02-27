export type Background = "white" | "transparent";

export interface GenerateRequest {
  words: string;
  background: Background;
}

export interface GenerateResponse {
  imageBase64: string;
  promptUsed: string;
}

export interface GenerateErrorResponse {
  error: string;
  details?: string;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
}
