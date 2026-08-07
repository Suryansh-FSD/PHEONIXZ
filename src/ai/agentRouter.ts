import { z } from 'zod';
import type { LLMProvider } from './types';

/**
 * Agent Router fallback provider.
 * Uses the same LLMProvider interface as Gemini.
 * Activated only when Gemini throws.
 *
 * NOTE: Replace AGENT_ROUTER_BASE_URL with actual endpoint once credentials are available.
 */
class AgentRouterProvider implements LLMProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async generate<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
    options?: { temperature?: number }
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        system: systemPrompt,
        prompt: userPrompt,
        response_format: { type: 'json_object' },
        temperature: options?.temperature ?? 0.2,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(`[agent-router] HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    // Agent Router wraps output in { content: "..." } or { text: "..." }
    const rawText: string = data.content ?? data.text ?? data.output ?? JSON.stringify(data);

    let parsed: unknown;
    try {
      parsed = typeof rawText === 'string' ? JSON.parse(rawText) : rawText;
    } catch {
      throw new Error(`[agent-router] Failed to parse JSON: ${rawText.slice(0, 200)}`);
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      throw new Error(
        `[agent-router] Schema validation failed: ${result.error.message}`
      );
    }

    return result.data;
  }
}

// Singleton — only instantiated when Agent Router credentials are present
let _agentRouter: AgentRouterProvider | null = null;

export function getAgentRouterProvider(): LLMProvider | null {
  const baseUrl = process.env.AGENT_ROUTER_BASE_URL;
  const apiKey = process.env.AGENT_ROUTER_API_KEY;

  if (!baseUrl || !apiKey) {
    console.warn('[agent-router] Credentials not configured — fallback unavailable');
    return null;
  }

  if (!_agentRouter) {
    _agentRouter = new AgentRouterProvider(baseUrl, apiKey);
  }

  return _agentRouter;
}
