import { z } from 'zod';
import type { LLMProvider } from './types';
import { parseJsonResponse } from './parseJson';

/**
 * Dedicated Anthropic-compatible AgentRouter provider for PhoenixZ.
 * Uses the Anthropic Messages protocol (POST /v1/messages).
 * Base URL defaults to https://co.agentrouter.org (or https://agentrouter.org).
 * Model defaults to claude-opus-4-8.
 */
export class AnthropicAgentRouterProvider implements LLMProvider {
  private baseUrl: string;
  private authToken: string;
  private model: string;

  constructor(baseUrl?: string, authToken?: string, model?: string) {
    const rawBase = baseUrl || process.env.ANTHROPIC_BASE_URL || 'https://co.agentrouter.org';
    // Robust URL normalization: strip trailing slashes, strip single /v1 suffix if present
    const clean = rawBase.trim().replace(/\/+$/, '').replace(/\/v1\/?$/, '');
    this.baseUrl = clean;
    this.authToken = authToken || process.env.ANTHROPIC_AUTH_TOKEN || process.env.AGENT_ROUTER_API_KEY || '';
    this.model = model || process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  }

  async generate<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
    options?: { temperature?: number }
  ): Promise<T> {
    if (!this.authToken) {
      throw new Error('[anthropic-agent-router] Missing ANTHROPIC_AUTH_TOKEN');
    }

    const endpoint = `${this.baseUrl}/v1/messages`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.authToken,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: options?.temperature ?? 0.2,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`[anthropic-agent-router] HTTP ${response.status}: ${errText.slice(0, 300)}`);
    }

    const data = await response.json();

    // Anthropic Messages API format: content is array of blocks e.g. [{ type: "text", text: "..." }]
    let extractedText = '';
    if (Array.isArray(data.content)) {
      extractedText = data.content
        .filter((block: unknown): block is { type: string; text: string } => {
          if (typeof block !== 'object' || block === null) return false;
          const b = block as Record<string, unknown>;
          return b.type === 'text' && typeof b.text === 'string';
        })
        .map((block: { text: string }) => block.text)
        .join('\n')
        .trim();
    } else if (typeof data.content === 'string') {
      extractedText = data.content;
    } else if (typeof data.text === 'string') {
      extractedText = data.text;
    }

    if (!extractedText) {
      throw new Error(`[anthropic-agent-router] Empty text in response from model ${this.model}`);
    }

    return parseJsonResponse(extractedText, schema, 'anthropic-agent-router');
  }
}

// Singleton — instantiated when Anthropic / AgentRouter credentials are present
let _anthropicAgentRouter: AnthropicAgentRouterProvider | null = null;

export function getAnthropicAgentRouterProvider(): LLMProvider | null {
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN || process.env.AGENT_ROUTER_API_KEY;
  if (!authToken) {
    return null;
  }

  if (!_anthropicAgentRouter) {
    _anthropicAgentRouter = new AnthropicAgentRouterProvider();
  }

  return _anthropicAgentRouter;
}
