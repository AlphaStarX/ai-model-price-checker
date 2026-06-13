// ─── OpenRouter → Canonical Model Slug Mapping ──────────────
// Covers latest June 2026 models + previous-gen for comparison

export const OPENROUTER_CANONICAL_MAP: Record<string, string> = {
  // OpenAI (latest 2026)
  "openai/gpt-5.4": "gpt-5.4",
  "openai/gpt-5.4-mini": "gpt-5.4-mini",
  "openai/gpt-5.4-nano": "gpt-5.4-nano",
  "openai/gpt-5.5": "gpt-5.5",
  "openai/o3": "o3",
  "openai/o4-mini": "o4-mini",
  // OpenAI (previous gen)
  "openai/gpt-4.1": "gpt-4.1",
  "openai/gpt-4.1-mini": "gpt-4.1-mini",
  "openai/gpt-4.1-nano": "gpt-4.1-nano",

  // Anthropic (latest 2026)
  "anthropic/claude-opus-4-8": "claude-opus-4-8",
  "anthropic/claude-opus-4-6": "claude-opus-4-6",
  "anthropic/claude-sonnet-4-6": "claude-sonnet-4-6",
  "anthropic/claude-fable-5": "claude-fable-5",
  "anthropic/claude-haiku-4-5": "claude-haiku-4-5",
  "anthropic/claude-mythos-preview": "claude-mythos-preview",
  // Anthropic (previous gen)
  "anthropic/claude-opus-4-5": "claude-opus-4-5",

  // Google (latest 2026)
  "google/gemini-3.5-flash": "gemini-3.5-flash",
  "google/gemini-3.1-pro": "gemini-3.1-pro",
  // Google (previous gen)
  "google/gemini-2.5-flash": "gemini-2.5-flash",
  "google/gemini-2.5-pro": "gemini-2.5-pro",

  // Meta
  "meta-llama/llama-4-scout": "llama-4-scout",
  "meta-llama/llama-4-maverick": "llama-4-maverick",

  // DeepSeek (latest 2026)
  "deepseek/deepseek-v4-pro": "deepseek-v4-pro",
  "deepseek/deepseek-v4-flash": "deepseek-v4-flash",
  // DeepSeek (previous gen)
  "deepseek/deepseek-chat": "deepseek-v3",
  "deepseek/deepseek-r1": "deepseek-r1",

  // Mistral
  "mistralai/mistral-large": "mistral-large-2",
  "mistralai/mistral-small": "mistral-small-3",

  // Cohere
  "cohere/command-r-plus": "command-r-plus",

  // xAI (latest 2026)
  "x-ai/grok-4.20": "grok-4-20",
  // xAI (previous gen)
  "x-ai/grok-3": "grok-3",

  // Alibaba (latest 2026)
  "qwen/qwen-3.7-max": "qwen-3-7-max",
  // Alibaba (previous gen)
  "qwen/qwen-max": "qwen-2-5-max",
  "qwen/qwen-2.5-coder-32b": "qwen-2-5-coder",

  // Moonshot AI (Kimi)
  "moonshotai/kimi-k2.5": "kimi-k2-5",
  "moonshotai/kimi-k2": "kimi-k2",
};
