import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Developers ───────────────────────────────────────────

  const developers = await Promise.all([
    prisma.developer.upsert({
      where: { slug: "openai" },
      update: {},
      create: { name: "OpenAI", slug: "openai", website: "https://openai.com", description: "Creator of GPT and o-series reasoning models." },
    }),
    prisma.developer.upsert({
      where: { slug: "anthropic" },
      update: {},
      create: { name: "Anthropic", slug: "anthropic", website: "https://anthropic.com", description: "Creator of Claude models focused on safety and reliability." },
    }),
    prisma.developer.upsert({
      where: { slug: "google" },
      update: {},
      create: { name: "Google DeepMind", slug: "google", website: "https://deepmind.google", description: "Creator of Gemini multimodal models." },
    }),
    prisma.developer.upsert({
      where: { slug: "meta" },
      update: {},
      create: { name: "Meta AI", slug: "meta", website: "https://ai.meta.com", description: "Creator of open-weight Llama models." },
    }),
    prisma.developer.upsert({
      where: { slug: "mistral" },
      update: {},
      create: { name: "Mistral AI", slug: "mistral", website: "https://mistral.ai", description: "French AI company building open-weight and commercial models." },
    }),
    prisma.developer.upsert({
      where: { slug: "deepseek" },
      update: {},
      create: { name: "DeepSeek", slug: "deepseek", website: "https://deepseek.com", description: "Chinese AI lab known for efficient open-weight models." },
    }),
    prisma.developer.upsert({
      where: { slug: "cohere" },
      update: {},
      create: { name: "Cohere", slug: "cohere", website: "https://cohere.com", description: "Enterprise AI platform with Command models." },
    }),
    prisma.developer.upsert({
      where: { slug: "xai" },
      update: {},
      create: { name: "xAI", slug: "xai", website: "https://x.ai", description: "Elon Musk's AI company, creator of Grok models." },
    }),
    prisma.developer.upsert({
      where: { slug: "qwen" },
      update: {},
      create: { name: "Alibaba Cloud", slug: "qwen", website: "https://tongyi.aliyun.com", description: "Creator of the Qwen model family." },
    }),
  ]);

  // Moonshot AI + NVIDIA — added after initial create
  await prisma.developer.upsert({ where: { slug: "moonshot" }, update: {}, create: { name: "Moonshot AI", slug: "moonshot", website: "https://www.moonshot.cn", description: "Beijing-based AI company behind the Kimi model series. Known for long-context and agent capabilities." } });
  await prisma.developer.upsert({ where: { slug: "nvidia" }, update: {}, create: { name: "NVIDIA", slug: "nvidia", website: "https://build.nvidia.com", description: "NVIDIA NIM inference microservices hosting optimized open-weight models." } });

console.log(`  ✓ Created ${developers.length} developers (+ 2 more inline)`);

  // ─── Capabilities ─────────────────────────────────────────

  const capabilityData = [
    { slug: "reasoning", label: "Reasoning", icon: "Brain" },
    { slug: "vision", label: "Vision", icon: "Eye" },
    { slug: "image-generation", label: "Image Generation", icon: "Image" },
    { slug: "function-calling", label: "Function Calling", icon: "Wrench" },
    { slug: "structured-outputs", label: "Structured Outputs", icon: "FileJson" },
    { slug: "streaming", label: "Streaming", icon: "Waves" },
    { slug: "audio-input", label: "Audio Input", icon: "Mic" },
    { slug: "audio-output", label: "Audio Output", icon: "Volume2" },
  ];

  const capabilities: Record<string, { id: string }> = {};
  for (const cap of capabilityData) {
    const c = await prisma.capability.upsert({ where: { slug: cap.slug }, update: {}, create: cap });
    capabilities[cap.slug] = c;
  }
  console.log(`  ✓ Created ${capabilityData.length} capabilities`);

  // ─── Models (existing + June 2026) ───────────────────────

  const modelsData = [
    // ===== OpenAI =====
    // Latest (2026)
    { name: "GPT-5.4", slug: "gpt-5.4", developerSlug: "openai", description: "OpenAI's latest flagship model. Strong all-rounder with 1.1M context, improved reasoning, and multimodal capabilities.", contextWindow: 1_100_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-02-15"), modelFamily: "GPT", paramSize: null, capabilities: ["reasoning","vision","function-calling","structured-outputs","streaming"] },
    { name: "GPT-5.4 Mini", slug: "gpt-5.4-mini", developerSlug: "openai", description: "Cost-efficient smaller variant of GPT-5.4. Great balance of speed and capability for most tasks.", contextWindow: 1_100_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-03-01"), modelFamily: "GPT", paramSize: null, capabilities: ["reasoning","vision","function-calling","structured-outputs","streaming"] },
    { name: "GPT-5.4 Nano", slug: "gpt-5.4-nano", developerSlug: "openai", description: "OpenAI's smallest and fastest GPT-5 variant. Ideal for classification, extraction, and simple tasks.", contextWindow: 1_100_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-03-01"), modelFamily: "GPT", paramSize: null, capabilities: ["function-calling","structured-outputs","streaming"] },
    { name: "GPT-5.5", slug: "gpt-5.5", developerSlug: "openai", description: "OpenAI's latest model (June 2026). Top-tier reasoning and coding at $5/$30 per 1M tokens. Supports long context at premium pricing.", contextWindow: 1_100_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-06-01"), modelFamily: "GPT", paramSize: null, capabilities: ["reasoning","vision","function-calling","structured-outputs","streaming"] },
    { name: "o4-mini", slug: "o4-mini", developerSlug: "openai", description: "Efficient reasoning model with chain-of-thought. Strong math and science performance at lower cost than o3.", contextWindow: 200_000, maxOutputTokens: 100_000, releaseDate: new Date("2025-12-01"), modelFamily: "GPT", paramSize: null, capabilities: ["reasoning","function-calling","streaming"] },
    { name: "o3", slug: "o3", developerSlug: "openai", description: "OpenAI's most capable reasoning model. Top-tier math, science, and coding through extended chain-of-thought.", contextWindow: 200_000, maxOutputTokens: 100_000, releaseDate: new Date("2025-09-01"), modelFamily: "GPT", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    // Previous gen (kept for comparison)
    { name: "GPT-4.1", slug: "gpt-4.1", developerSlug: "openai", description: "Previous-gen flagship with strong reasoning and coding. Supports multimodal inputs and structured outputs.", contextWindow: 1_000_000, maxOutputTokens: 32_768, releaseDate: new Date("2025-04-15"), modelFamily: "GPT", paramSize: null, capabilities: ["reasoning","vision","function-calling","structured-outputs","streaming"] },
    { name: "GPT-4.1 Mini", slug: "gpt-4.1-mini", developerSlug: "openai", description: "Cost-efficient small model from the GPT-4.1 line. Great for high-volume, cost-sensitive tasks.", contextWindow: 1_000_000, maxOutputTokens: 32_768, releaseDate: new Date("2025-04-15"), modelFamily: "GPT", paramSize: null, capabilities: ["reasoning","vision","function-calling","structured-outputs","streaming"] },
    { name: "GPT-4.1 Nano", slug: "gpt-4.1-nano", developerSlug: "openai", description: "OpenAI's smallest and fastest legacy model. Ideal for classification and extraction.", contextWindow: 1_000_000, maxOutputTokens: 32_768, releaseDate: new Date("2025-04-15"), modelFamily: "GPT", paramSize: null, capabilities: ["function-calling","structured-outputs","streaming"] },

    // ===== Anthropic =====
    // Latest (2026)
    { name: "Claude Opus 4.6", slug: "claude-opus-4-6", developerSlug: "anthropic", description: "Anthropic's most capable model as of Feb 2026. #1 on coding-arena, SOTA on OSWorld (72.7%) and Terminal-Bench 2.0 (65.4%). Exceptional for complex agentic workflows.", contextWindow: 200_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-02-01"), modelFamily: "Claude", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    { name: "Claude Sonnet 4.6", slug: "claude-sonnet-4-6", developerSlug: "anthropic", description: "Anthropic's balanced model — strong coding performance at lower cost than Opus. Released alongside Opus 4.6 in Feb 2026.", contextWindow: 200_000, maxOutputTokens: 16_384, releaseDate: new Date("2026-02-01"), modelFamily: "Claude", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    { name: "Claude Opus 4.8", slug: "claude-opus-4-8", developerSlug: "anthropic", description: "Anthropic's latest frontier model. Exceptional reasoning, research, and multi-step agentic workflows. Pushes the boundary on complex problem-solving.", contextWindow: 200_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-05-01"), modelFamily: "Claude", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    { name: "Claude Fable 5", slug: "claude-fable-5", developerSlug: "anthropic", description: "Anthropic's most advanced creative reasoning model. Optimized for nuanced understanding, creative problem-solving, and long-form analysis.", contextWindow: 200_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-05-15"), modelFamily: "Claude", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    { name: "Claude Haiku 4.5", slug: "claude-haiku-4-5", developerSlug: "anthropic", description: "Anthropic's fastest model, optimized for low-latency tasks. Excellent for chat, moderation, and real-time applications.", contextWindow: 200_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-10-01"), modelFamily: "Claude", paramSize: null, capabilities: ["vision","function-calling","streaming"] },
    // Claude Mythos (restricted)
    { name: "Claude Mythos Preview", slug: "claude-mythos-preview", developerSlug: "anthropic", description: "Anthropic's restricted-preview frontier reasoning model. Leads GPQA Diamond at 94.6%. Defensive cybersecurity focus.", contextWindow: 200_000, maxOutputTokens: 32_768, releaseDate: new Date("2026-04-01"), modelFamily: "Claude", paramSize: null, isExperimental: true, capabilities: ["reasoning","function-calling","streaming"] },
    // Previous gen (kept for comparison)
    { name: "Claude Opus 4.5", slug: "claude-opus-4-5", developerSlug: "anthropic", description: "Previous-gen Anthropic flagship. Strong coding and agentic task performance.", contextWindow: 200_000, maxOutputTokens: 32_768, releaseDate: new Date("2025-11-01"), modelFamily: "Claude", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },

    // ===== Google =====
    // Latest (2026)
    { name: "Gemini 3.5 Flash", slug: "gemini-3.5-flash", developerSlug: "google", description: "Google's latest fast model (May 2026). Beats Gemini 3.1 Pro on most agentic and coding benchmarks at lower cost.", contextWindow: 1_000_000, maxOutputTokens: 8_192, releaseDate: new Date("2026-05-19"), modelFamily: "Gemini", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming","audio-input"] },
    { name: "Gemini 3.1 Pro", slug: "gemini-3.1-pro", developerSlug: "google", description: "Google's Feb 2026 flagship. ~1500 ELO text, #1 vision leaderboard. 1M context with strong reasoning.", contextWindow: 1_000_000, maxOutputTokens: 16_384, releaseDate: new Date("2026-02-19"), modelFamily: "Gemini", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming","audio-input"] },
    // Previous gen (kept for comparison)
    { name: "Gemini 2.5 Pro", slug: "gemini-2.5-pro", developerSlug: "google", description: "Previous-gen flagship with 2M context window. Strong reasoning and long-context understanding.", contextWindow: 2_000_000, maxOutputTokens: 16_384, releaseDate: new Date("2025-05-15"), modelFamily: "Gemini", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming","audio-input"] },
    { name: "Gemini 2.5 Flash", slug: "gemini-2.5-flash", developerSlug: "google", description: "Previous-gen fast Gemini. Cost-effective with 1M context and strong vision/audio.", contextWindow: 1_000_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-05-15"), modelFamily: "Gemini", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming","audio-input"] },

    // ===== Meta =====
    { name: "Llama 4 Scout", slug: "llama-4-scout", developerSlug: "meta", description: "Meta's lightweight open-weight model with 10M context. 109B total / 17B active parameters.", contextWindow: 10_000_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-04-05"), modelFamily: "Llama", paramSize: "109B (17B active)", isOpenSource: true, capabilities: ["reasoning","vision","function-calling","streaming"] },
    { name: "Llama 4 Maverick", slug: "llama-4-maverick", developerSlug: "meta", description: "Meta's powerful open-weight model with 10M context. 400B total / 17B active parameters, optimized for reasoning and coding.", contextWindow: 10_000_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-04-05"), modelFamily: "Llama", paramSize: "400B (17B active)", isOpenSource: true, capabilities: ["reasoning","vision","function-calling","streaming"] },

    // ===== DeepSeek =====
    // Latest (2026)
    { name: "DeepSeek V4-Pro", slug: "deepseek-v4-pro", developerSlug: "deepseek", description: "DeepSeek's flagship. $0.435/$0.87 per 1M tokens (promo pricing until May 31, 2026). 20-50x cheaper than comparable frontier models.", contextWindow: 1_000_000, maxOutputTokens: 384_000, releaseDate: new Date("2026-04-01"), modelFamily: "DeepSeek", paramSize: "1.6T MoE", isOpenSource: true, capabilities: ["reasoning","function-calling","streaming"] },
    { name: "DeepSeek V4 Flash", slug: "deepseek-v4-flash", developerSlug: "deepseek", description: "DeepSeek's fast model at $0.14/$0.28 per 1M tokens. V3 and R1 now route here. Supports thinking and non-thinking modes.", contextWindow: 1_000_000, maxOutputTokens: 384_000, releaseDate: new Date("2026-04-01"), modelFamily: "DeepSeek", paramSize: "1.6T MoE", isOpenSource: true, capabilities: ["reasoning","function-calling","streaming"] },
    // Deprecated — route to V4 Flash as of July 2026
    { name: "DeepSeek V3 (→V4 Flash)", slug: "deepseek-v3", developerSlug: "deepseek", description: "Deprecated — now routes to V4 Flash. Previously DeepSeek's flagship MoE model.", contextWindow: 128_000, maxOutputTokens: 8_192, releaseDate: new Date("2024-12-26"), modelFamily: "DeepSeek", paramSize: "671B (37B active)", isOpenSource: true, capabilities: ["reasoning","function-calling","streaming"] },
    { name: "DeepSeek R1 (→V4 Flash)", slug: "deepseek-r1", developerSlug: "deepseek", description: "Deprecated — now routes to V4 Flash thinking mode. Previously DeepSeek's chain-of-thought reasoning model.", contextWindow: 128_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-01-20"), modelFamily: "DeepSeek", paramSize: "671B (37B active)", isOpenSource: true, capabilities: ["reasoning","streaming"] },

    // ===== Mistral =====
    { name: "Mistral Large 2", slug: "mistral-large-2", developerSlug: "mistral", description: "Mistral's flagship model with strong multilingual performance and function calling. 123B parameters.", contextWindow: 128_000, maxOutputTokens: 8_192, releaseDate: new Date("2024-07-24"), modelFamily: "Mistral", paramSize: "123B", capabilities: ["reasoning","function-calling","structured-outputs","streaming"] },
    { name: "Mistral Small 3", slug: "mistral-small-3", developerSlug: "mistral", description: "Mistral's efficient small model competitive with larger models at a fraction of the cost. 24B parameters.", contextWindow: 32_000, maxOutputTokens: 4_096, releaseDate: new Date("2025-03-10"), modelFamily: "Mistral", paramSize: "24B", capabilities: ["function-calling","streaming"] },

    // ===== Cohere =====
    { name: "Command R+", slug: "command-r-plus", developerSlug: "cohere", description: "Cohere's most capable model optimized for RAG, tool use, and multilingual enterprise tasks. 104B parameters.", contextWindow: 128_000, maxOutputTokens: 4_096, releaseDate: new Date("2024-04-04"), modelFamily: "Cohere", paramSize: "104B", capabilities: ["reasoning","function-calling","streaming"] },

    // ===== xAI =====
    // Latest (2026)
    { name: "Grok 4.20", slug: "grok-4-20", developerSlug: "xai", description: "xAI's latest model (Feb 2026). Features parallel 4-agent reasoning architecture. Strong multi-step reasoning with distinctive personality.", contextWindow: 1_000_000, maxOutputTokens: 16_384, releaseDate: new Date("2026-02-20"), modelFamily: "Grok", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    // Previous gen
    { name: "Grok 3", slug: "grok-3", developerSlug: "xai", description: "Previous xAI flagship with strong reasoning, real-time knowledge, and a distinctive personality.", contextWindow: 1_000_000, maxOutputTokens: 16_384, releaseDate: new Date("2025-02-17"), modelFamily: "Grok", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },

    // ===== Alibaba =====
    { name: "Qwen 3.7 Max Preview", slug: "qwen-3-7-max", developerSlug: "qwen", description: "Alibaba's strongest model (2026). #13 on LM Arena, 1M context, competitive with top closed-weight models.", contextWindow: 1_000_000, maxOutputTokens: 8_192, releaseDate: new Date("2026-04-01"), modelFamily: "Qwen", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    { name: "Qwen 2.5 Max", slug: "qwen-2-5-max", developerSlug: "qwen", description: "Previous Alibaba flagship. Strong multilingual performance competitive with top-tier offerings.", contextWindow: 128_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-01-29"), modelFamily: "Qwen", paramSize: null, capabilities: ["reasoning","vision","function-calling","streaming"] },
    { name: "Qwen 2.5 Coder", slug: "qwen-2-5-coder", developerSlug: "qwen", description: "Alibaba's code-specialized 32B model. Strong coding benchmarks at competitive pricing.", contextWindow: 128_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-03-01"), modelFamily: "Qwen", paramSize: "32B", isOpenSource: true, capabilities: ["reasoning","function-calling","streaming"] },

    // ===== Moonshot AI (Kimi) =====
    { name: "Kimi K2.5", slug: "kimi-k2-5", developerSlug: "moonshot", description: "Moonshot AI's latest model with Agent Swarm technology — up to 100 parallel agents. Strong long-context understanding and autonomous task completion.", contextWindow: 1_000_000, maxOutputTokens: 16_384, releaseDate: new Date("2026-04-01"), modelFamily: "Kimi", paramSize: null, capabilities: ["reasoning","function-calling","streaming"] },
    { name: "Kimi K2", slug: "kimi-k2", developerSlug: "moonshot", description: "Moonshot AI's previous flagship. Excellent long-context performance with 1M+ token understanding.", contextWindow: 1_000_000, maxOutputTokens: 8_192, releaseDate: new Date("2025-08-01"), modelFamily: "Kimi", paramSize: null, capabilities: ["reasoning","function-calling","streaming"] },
  ];

  const modelRecords: Record<string, { id: string }> = {};
  for (const md of modelsData) {
    const developer = await prisma.developer.findUnique({ where: { slug: md.developerSlug } });
    if (!developer) throw new Error(`Developer ${md.developerSlug} not found`);

    const model = await prisma.model.upsert({
      where: { slug: md.slug },
      update: {},
      create: {
        name: md.name, slug: md.slug, developerId: developer.id,
        description: md.description, contextWindow: md.contextWindow,
        maxOutputTokens: md.maxOutputTokens, releaseDate: md.releaseDate,
        modelFamily: md.modelFamily, paramSize: md.paramSize,
        isOpenSource: md.isOpenSource ?? false,
        isExperimental: md.isExperimental ?? false,
      },
    });
    modelRecords[md.slug] = model;

    for (const capSlug of md.capabilities) {
      const cap = capabilities[capSlug];
      if (!cap) continue;
      await prisma.modelCapability.upsert({
        where: { modelId_capabilityId: { modelId: model.id, capabilityId: cap.id } },
        update: {}, create: { modelId: model.id, capabilityId: cap.id },
      });
    }
  }
  console.log(`  ✓ Created ${modelsData.length} models`);

  // ─── Providers ────────────────────────────────────────────

  const providersData = [
    { name: "OpenRouter", slug: "openrouter", website: "https://openrouter.ai", docsUrl: "https://openrouter.ai/docs", description: "Unified API aggregating 200+ models across all major providers.", apiFormat: "openai" },
    { name: "Together AI", slug: "together", website: "https://together.ai", docsUrl: "https://docs.together.ai", description: "Fast inference platform specializing in open-source models.", apiFormat: "openai" },
    { name: "DeepInfra", slug: "deepinfra", website: "https://deepinfra.com", docsUrl: "https://deepinfra.com/docs", description: "Low-cost inference for open-source models with simple API.", apiFormat: "openai" },
    { name: "Groq", slug: "groq", website: "https://groq.com", docsUrl: "https://console.groq.com/docs", description: "Ultra-fast inference using custom LPU hardware.", apiFormat: "openai" },
    { name: "Fireworks AI", slug: "fireworks", website: "https://fireworks.ai", docsUrl: "https://docs.fireworks.ai", description: "Fast serverless inference for open-source and fine-tuned models.", apiFormat: "openai" },
    { name: "OpenAI (Direct)", slug: "openai-direct", developerSlug: "openai", website: "https://platform.openai.com", docsUrl: "https://platform.openai.com/docs", description: "Direct access to GPT and o-series models through OpenAI's API.", apiFormat: "openai" },
    { name: "Anthropic (Direct)", slug: "anthropic-direct", developerSlug: "anthropic", website: "https://console.anthropic.com", docsUrl: "https://docs.anthropic.com", description: "Direct access to Claude models through Anthropic's API.", apiFormat: "anthropic" },
    { name: "Google AI (Direct)", slug: "google-direct", developerSlug: "google", website: "https://ai.google.dev", docsUrl: "https://ai.google.dev/docs", description: "Direct access to Gemini models through Google AI Studio.", apiFormat: "google" },
    { name: "DeepSeek (Direct)", slug: "deepseek-direct", developerSlug: "deepseek", website: "https://platform.deepseek.com", docsUrl: "https://platform.deepseek.com/docs", description: "Direct access to DeepSeek models through the official API. Aggressively priced, strong coding and math.", apiFormat: "openai" },
    { name: "Mistral (Direct)", slug: "mistral-direct", developerSlug: "mistral", website: "https://console.mistral.ai", docsUrl: "https://docs.mistral.ai", description: "Direct access to Mistral models through La Plateforme. Strong multilingual and RAG capabilities.", apiFormat: "mistral" },
    { name: "Cohere (Direct)", slug: "cohere-direct", developerSlug: "cohere", website: "https://dashboard.cohere.com", docsUrl: "https://docs.cohere.com", description: "Direct access to Cohere Command models. Optimized for enterprise RAG and tool use.", apiFormat: "cohere" },
    { name: "xAI (Direct)", slug: "xai-direct", developerSlug: "xai", website: "https://console.x.ai", docsUrl: "https://docs.x.ai", description: "Direct access to Grok models through xAI's API. Real-time knowledge and distinctive personality.", apiFormat: "openai" },
    { name: "Qwen (Direct)", slug: "qwen-direct", developerSlug: "qwen", website: "https://tongyi.aliyun.com", docsUrl: "https://help.aliyun.com/document_detail/qwen", description: "Direct access to Qwen models through Alibaba Cloud. Strong multilingual and coding performance.", apiFormat: "openai" },
    { name: "Moonshot (Direct)", slug: "moonshot-direct", developerSlug: "moonshot", website: "https://platform.moonshot.cn", docsUrl: "https://platform.moonshot.cn/docs", description: "Direct access to Kimi models through Moonshot AI's official API. Agent Swarm capabilities for parallel processing.", apiFormat: "openai" },
    { name: "NVIDIA NIM", slug: "nvidia-nim", website: "https://build.nvidia.com", docsUrl: "https://docs.nvidia.com/nim", description: "NVIDIA NIM — optimized inference microservices for open-weight models. High throughput on NVIDIA GPUs.", apiFormat: "openai" },
  ];

  const providerRecords: Record<string, { id: string }> = {};
  for (const pd of providersData) {
    const developer = pd.developerSlug ? await prisma.developer.findUnique({ where: { slug: pd.developerSlug } }) : null;
    const provider = await prisma.provider.upsert({
      where: { slug: pd.slug }, update: {},
      create: { name: pd.name, slug: pd.slug, developerId: developer?.id ?? null, website: pd.website, docsUrl: pd.docsUrl, description: pd.description, apiFormat: pd.apiFormat, status: "active" },
    });
    providerRecords[pd.slug] = provider;
  }
  console.log(`  ✓ Created ${providersData.length} providers`);

  // ─── Pricing Data ─────────────────────────────────────────

  type PR = [string, string, number, number, number | null];
  const pricingRows: PR[] = [
    // ── OpenRouter (aggregator) ──
    // Latest models
    ["gpt-5.4", "openrouter", 2.50, 15.00, 0.25],
    ["gpt-5.4-mini", "openrouter", 0.75, 4.50, 0.075],
    ["gpt-5.4-nano", "openrouter", 0.20, 1.25, 0.02],
    ["gpt-5.5", "openrouter", 5.00, 30.00, 0.50],
    ["o4-mini", "openrouter", 1.10, 4.40, null],
    ["o3", "openrouter", 2.00, 8.00, null],
    ["claude-opus-4-6", "openrouter", 5.00, 25.00, 0.50],
    ["claude-sonnet-4-6", "openrouter", 3.00, 15.00, 0.30],
    ["claude-opus-4-8", "openrouter", 15.00, 75.00, 1.50],
    ["claude-fable-5", "openrouter", 10.00, 50.00, 1.00],
    ["claude-haiku-4-5", "openrouter", 1.00, 5.00, 0.10],
    ["claude-mythos-preview", "openrouter", 10.00, 50.00, 1.00],
    ["claude-opus-4-5", "openrouter", 5.00, 25.00, 0.50],
    ["gemini-3.5-flash", "openrouter", 0.30, 1.50, null],
    ["gemini-3.1-pro", "openrouter", 1.25, 5.00, null],
    ["grok-4-20", "openrouter", 4.00, 20.00, null],
    ["qwen-3-7-max", "openrouter", 1.50, 6.00, null],
    ["deepseek-v4-pro", "openrouter", 0.44, 0.87, null],
    ["deepseek-v4-flash", "openrouter", 0.14, 0.28, null],
    // Previous gen
    ["gpt-4.1", "openrouter", 2.00, 8.00, null],
    ["gpt-4.1-mini", "openrouter", 0.40, 1.60, null],
    ["gpt-4.1-nano", "openrouter", 0.10, 0.40, null],
    ["gemini-2.5-pro", "openrouter", 1.25, 5.00, null],
    ["gemini-2.5-flash", "openrouter", 0.15, 0.60, null],
    ["llama-4-scout", "openrouter", 0.15, 0.50, null],
    ["llama-4-maverick", "openrouter", 0.30, 1.00, null],
    ["deepseek-v3", "openrouter", 0.14, 0.28, null],
    ["deepseek-r1", "openrouter", 0.14, 0.28, null],
    ["mistral-large-2", "openrouter", 2.00, 6.00, null],
    ["mistral-small-3", "openrouter", 0.10, 0.30, null],
    ["command-r-plus", "openrouter", 2.50, 10.00, null],
    ["grok-3", "openrouter", 3.00, 15.00, null],
    ["qwen-2-5-max", "openrouter", 1.20, 4.80, null],

    // ── Together AI ──
    ["llama-4-scout", "together", 0.10, 0.35, null],
    ["llama-4-maverick", "together", 0.20, 0.70, null],
    ["deepseek-v3", "together", 0.25, 0.40, null],
    ["deepseek-r1", "together", 0.50, 2.00, null],
    ["deepseek-v4-pro", "together", 0.40, 0.80, null],
    ["qwen-2-5-coder", "together", 0.10, 0.30, null],
    ["mistral-small-3", "together", 0.10, 0.30, null],

    // ── DeepInfra ──
    ["llama-4-scout", "deepinfra", 0.08, 0.30, null],
    ["llama-4-maverick", "deepinfra", 0.18, 0.60, null],
    ["deepseek-v3", "deepinfra", 0.20, 0.35, null],
    ["deepseek-r1", "deepinfra", 0.45, 1.80, null],
    ["deepseek-v4-pro", "deepinfra", 0.35, 0.75, null],
    ["qwen-2-5-coder", "deepinfra", 0.07, 0.25, null],
    ["mistral-small-3", "deepinfra", 0.08, 0.25, null],
    ["command-r-plus", "deepinfra", 0.90, 3.60, null],

    // ── Groq ──
    ["llama-4-scout", "groq", 0.12, 0.40, null],
    ["llama-4-maverick", "groq", 0.25, 0.80, null],
    ["deepseek-v3", "groq", 0.30, 0.45, null],
    ["deepseek-r1", "groq", 0.55, 2.10, null],
    ["qwen-2-5-coder", "groq", 0.12, 0.35, null],

    // ── Fireworks AI ──
    ["llama-4-scout", "fireworks", 0.10, 0.35, null],
    ["llama-4-maverick", "fireworks", 0.20, 0.70, null],
    ["deepseek-v3", "fireworks", 0.28, 0.42, null],
    ["qwen-2-5-coder", "fireworks", 0.10, 0.30, null],
    ["mistral-large-2", "fireworks", 1.00, 3.50, null],
    ["mistral-small-3", "fireworks", 0.09, 0.28, null],

    // ── Direct APIs ──
    // OpenAI Direct
    ["gpt-5.4", "openai-direct", 2.50, 15.00, 0.25],
    ["gpt-5.4-mini", "openai-direct", 0.75, 4.50, 0.075],
    ["gpt-5.4-nano", "openai-direct", 0.20, 1.25, 0.02],
    ["gpt-5.5", "openai-direct", 5.00, 30.00, 0.50],
    ["o4-mini", "openai-direct", 1.10, 4.40, null],
    ["o3", "openai-direct", 2.00, 8.00, null],
    ["gpt-4.1", "openai-direct", 2.00, 8.00, null],
    ["gpt-4.1-mini", "openai-direct", 0.40, 1.60, null],
    ["gpt-4.1-nano", "openai-direct", 0.10, 0.40, null],
    // Anthropic Direct
    ["claude-opus-4-6", "anthropic-direct", 5.00, 25.00, 0.50],
    ["claude-sonnet-4-6", "anthropic-direct", 3.00, 15.00, 0.30],
    ["claude-opus-4-8", "anthropic-direct", 5.00, 25.00, 0.50],
    ["claude-fable-5", "anthropic-direct", 10.00, 50.00, 1.00],
    ["claude-haiku-4-5", "anthropic-direct", 1.00, 5.00, 0.10],
    // Google Direct
    ["gemini-3.5-flash", "google-direct", 1.50, 9.00, null],
    ["gemini-3.1-pro", "google-direct", 2.00, 12.00, null],
    ["gemini-2.5-flash", "google-direct", 0.30, 2.50, null],
    ["gemini-2.5-pro", "google-direct", 1.25, 10.00, null],
    // DeepSeek Direct
    ["deepseek-v4-pro", "deepseek-direct", 0.44, 0.87, null],
    ["deepseek-v3", "deepseek-direct", 0.27, 0.42, null],
    ["deepseek-r1", "deepseek-direct", 0.55, 2.19, null],
    // Mistral Direct (La Plateforme)
    ["mistral-large-2", "mistral-direct", 2.00, 6.00, null],
    ["mistral-small-3", "mistral-direct", 0.10, 0.30, null],
    // Cohere Direct
    ["command-r-plus", "cohere-direct", 2.50, 10.00, null],
    // xAI Direct
    ["grok-4-20", "xai-direct", 4.00, 20.00, null],
    ["grok-3", "xai-direct", 3.00, 15.00, null],
    // Qwen Direct (Alibaba Cloud)
    ["qwen-3-7-max", "qwen-direct", 1.50, 6.00, null],
    ["qwen-2-5-max", "qwen-direct", 1.20, 4.80, null],
    ["qwen-2-5-coder", "qwen-direct", 0.20, 0.60, null],
    // Kimi (OpenRouter)
    ["kimi-k2-5", "openrouter", 1.50, 6.00, null],
    ["kimi-k2", "openrouter", 0.80, 3.20, null],
    // Kimi Direct (Moonshot)
    ["kimi-k2-5", "moonshot-direct", 1.50, 6.00, null],
    ["kimi-k2", "moonshot-direct", 0.80, 3.20, null],
    // NVIDIA NIM
    ["llama-4-scout", "nvidia-nim", 0.10, 0.40, null],
    ["llama-4-maverick", "nvidia-nim", 0.25, 0.80, null],
    ["deepseek-v4-pro", "nvidia-nim", 0.45, 0.90, null],
    ["mistral-large-2", "nvidia-nim", 2.00, 6.00, null],
    ["qwen-2-5-coder", "nvidia-nim", 0.12, 0.35, null],
  ];

  let pricingCount = 0;
  for (const [modelSlug, providerSlug, inputPrice, outputPrice, cachedPrice] of pricingRows) {
    const model = modelRecords[modelSlug];
    const provider = providerRecords[providerSlug];
    if (!model || !provider) { console.warn(`  ⚠ Skipping: ${modelSlug} @ ${providerSlug}`); continue; }
    await prisma.pricing.upsert({
      where: { modelId_providerId: { modelId: model.id, providerId: provider.id } },
      update: { inputPricePerMillion: inputPrice, outputPricePerMillion: outputPrice, cachedInputPricePerMillion: cachedPrice, source: "seed" },
      create: { modelId: model.id, providerId: provider.id, inputPricePerMillion: inputPrice, outputPricePerMillion: outputPrice, cachedInputPricePerMillion: cachedPrice, source: "seed" },
    });
    pricingCount++;
  }
  console.log(`  ✓ Created ${pricingCount} pricing entries`);
  console.log("✅ Seed complete!");
}

main().catch((e) => { console.error("❌ Seed error:", e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
