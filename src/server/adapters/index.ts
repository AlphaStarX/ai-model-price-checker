// ─── Adapter Barrel ─────────────────────────────────────────
// Import this file to register all adapters in the registry.

import { registerAdapter } from "./registry";

// API-fetching adapters
import { openRouterAdapter } from "./openrouter";
import { togetherAdapter } from "./together";
import { deepinfraAdapter } from "./deepinfra";
import { groqAdapter } from "./groq";

// Direct API pricing configs
import { openaiDirectAdapter } from "./openai-direct";
import { anthropicDirectAdapter } from "./anthropic-direct";
import { googleDirectAdapter } from "./google-direct";
import { deepseekDirectAdapter } from "./deepseek-direct";
import { mistralDirectAdapter } from "./mistral-direct";
import { cohereDirectAdapter } from "./cohere-direct";
import { xaiDirectAdapter } from "./xai-direct";
import { qwenDirectAdapter } from "./qwen-direct";
import { moonshotDirectAdapter } from "./moonshot-direct";
import { nvidiaNimAdapter } from "./nvidia-nim";

const allAdapters = [
  openRouterAdapter, togetherAdapter, deepinfraAdapter, groqAdapter,
  openaiDirectAdapter, anthropicDirectAdapter, googleDirectAdapter,
  deepseekDirectAdapter, mistralDirectAdapter, cohereDirectAdapter,
  xaiDirectAdapter, qwenDirectAdapter, moonshotDirectAdapter, nvidiaNimAdapter,
];

for (const adapter of allAdapters) {
  registerAdapter(adapter);
}

console.log(`[adapters] Registered ${allAdapters.length} providers: ${allAdapters.map((a) => a.providerSlug).join(", ")}`);
