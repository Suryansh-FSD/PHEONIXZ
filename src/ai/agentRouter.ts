import { z } from 'zod';
import type { LLMProvider } from './types';
import { parseJsonResponse } from './parseJson';

/**
 * Agent Router Anthropic Messages Provider (Claude Opus).
 * Implements the LLMProvider interface for PheonixZ.
 * Uses Anthropic Messages protocol (POST /v1/messages) via AgentRouter (co.agentrouter.org).
 */
class AgentRouterProvider implements LLMProvider {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(baseUrl: string, apiKey: string, model?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.model = model || process.env.AGENT_ROUTER_MODEL || 'claude-opus-5';
  }

  async generate<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
    options?: { temperature?: number }
  ): Promise<T> {
    const cleanBase = this.baseUrl.replace(/\/v1\/?$/, '').replace(/\/$/, '');
    const endpoint = `${cleanBase}/v1/messages`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        Authorization: `Bearer ${this.apiKey}`,
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
      throw new Error(`[agent-router] HTTP ${response.status}: ${errText.slice(0, 300)}`);
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
    } else if (data.choices?.[0]?.message?.content) {
      extractedText = data.choices[0].message.content;
    }

    if (!extractedText) {
      throw new Error(`[agent-router] Empty text in response from model ${this.model}`);
    }

    return parseJsonResponse(extractedText, schema, 'agent-router');
  }
}

// Singleton — instantiated when Agent Router credentials are present
let _agentRouter: AgentRouterProvider | null = null;

export function getAgentRouterProvider(): LLMProvider | null {
  const baseUrl = process.env.AGENT_ROUTER_BASE_URL || 'https://co.agentrouter.org';
  const apiKey = process.env.AGENT_ROUTER_API_KEY;

  if (!baseUrl || !apiKey) {
    return null;
  }

  if (!_agentRouter) {
    _agentRouter = new AgentRouterProvider(baseUrl, apiKey);
  }

  return _agentRouter;
}
