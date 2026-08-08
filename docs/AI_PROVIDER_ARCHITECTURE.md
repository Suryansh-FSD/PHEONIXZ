# PhoenixZ AI Provider Gateway Architecture

This document describes the provider-agnostic LLM architecture implemented in PhoenixZ.

```
PhoenixZ Agent
     │
     ▼
LLM Gateway (src/ai/withFallback.ts)
     │
     ▼
Provider Registry (src/ai/providerRegistry.ts)
     │
     ├──► GroqProvider (src/ai/groq.ts) [VERIFIED LIVE: HTTP 200]
     ├──► GeminiProvider (src/ai/gemini.ts) [VERIFIED LIVE: HTTP 200]
     ├──► OpenRouterProvider (src/ai/openrouter.ts) [Integration Exists]
     └──► AnthropicAgentRouterProvider (src/ai/anthropicAgentRouter.ts) [HTTP 401 Invalid Key]
     │
     ▼
Normalized Structured JSON (src/ai/parseJson.ts)
     │
     ▼
Autonomous Editorial Pipeline (src/agent/cycle.ts)
     │
     ▼
Supabase Remote Database (public.posts)
     │
     ▼
Evaluator Feed API (GET /api/agent/feed)
```

---

## 🏛️ Key Principles

1. **Provider Agnosticism**:
   The autonomous agent (`cycle.ts`, `writer.ts`, `normalizer.ts`, `scorer.ts`) strictly interacts with the unified `LLMProvider` interface:
   ```ts
   export interface LLMProvider {
     generate<T>(
       systemPrompt: string,
       userPrompt: string,
       schema: z.ZodSchema<T>,
       options?: { temperature?: number }
     ): Promise<T>;
   }
   ```
   Zero provider-specific logic (e.g. OpenAI or Anthropic payload formatting) leaks into the agent layer.

2. **Provider Registry**:
   `src/ai/providerRegistry.ts` manages provider lookup and dynamic evaluation order.
   Configurable via environment variables:
   - `AI_PRIMARY_PROVIDER`: Optional primary provider (e.g. `groq`, `gemini`, `anthropic-agentrouter`).
   - `AI_PROVIDER_ORDER`: Comma-separated list of providers to evaluate (defaults to `groq,gemini,openrouter,anthropic-agentrouter`).

3. **Evaluator Contract Protection**:
   The evaluator feed endpoint (`GET /api/agent/feed`) reads strictly from Supabase without making any live LLM calls. Old posts remain persisted and available.

---

## 📊 Live Verification Status

| Provider | Configured | Live Request Status | Model Used | Live Verification Result |
| :--- | :---: | :---: | :---: | :--- |
| **Groq** | ✅ YES | HTTP 200 OK | `llama-3.3-70b-versatile` | **VERIFIED WORKING** (Primary) |
| **Gemini** | ✅ YES | HTTP 200 OK | `gemini-flash-latest` | **VERIFIED WORKING** |
| **OpenRouter** | ❌ NO | Unconfigured | `meta-llama/llama-3.3-70b-instruct:free` | Integration Ready |
| **Claude AgentRouter** | ✅ YES | HTTP 401 | `claude-opus-4-8` | FAILED (`Invalid API Key!`) |
