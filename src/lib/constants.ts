// ─── Model Families ─────────────────────────────────────────
// Used for filtering and display purposes

export const MODEL_FAMILIES = [
  "GPT",
  "Claude",
  "Gemini",
  "DeepSeek",
  "Qwen",
  "Llama",
  "Mistral",
  "Grok",
  "Kimi",
  "Cohere",
  "GLM",
  "Phi",
  "Gemma",
] as const;

export type ModelFamily = (typeof MODEL_FAMILIES)[number];

// ─── Capabilities ───────────────────────────────────────────

export const CAPABILITIES = {
  reasoning: { label: "Reasoning", icon: "Brain" },
  vision: { label: "Vision", icon: "Eye" },
  imageGeneration: { label: "Image Generation", icon: "Image" },
  functionCalling: { label: "Function Calling", icon: "Wrench" },
  structuredOutputs: { label: "Structured Outputs", icon: "FileJson" },
  streaming: { label: "Streaming", icon: "Waves" },
  audioInput: { label: "Audio Input", icon: "Mic" },
  audioOutput: { label: "Audio Output", icon: "Volume2" },
} as const;

// ─── Providers ──────────────────────────────────────────────

export const PROVIDER_TYPES = [
  "openrouter",
  "openai-direct",
  "anthropic-direct",
  "google-direct",
  "together",
  "deepinfra",
  "fireworks",
  "groq",
  "mistral",
  "cohere",
  "aws-bedrock",
] as const;

// ─── Token Presets ──────────────────────────────────────────

export const TOKEN_PRESETS = [
  { label: "100", value: 100 },
  { label: "1K", value: 1_000 },
  { label: "10K", value: 10_000 },
  { label: "100K", value: 100_000 },
  { label: "1M", value: 1_000_000 },
  { label: "10M", value: 10_000_000 },
] as const;

// ─── Pagination ─────────────────────────────────────────────

export const MODELS_PER_PAGE = 48;
export const DEFAULT_SORT = "name" as const;

// ─── Site ───────────────────────────────────────────────────

export const SITE_NAME = "AI Model Price Checker";
export const SITE_DESCRIPTION =
  "Compare AI model API pricing across every major provider. Find the cheapest LLM API for GPT, Claude, Gemini, and more.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aimodelpricechecker.com";
