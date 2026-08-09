import { z } from 'zod';
import type { LLMProvider } from './types';
import { parseJsonResponse } from './parseJson';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.0-flash-lite-001';

class OpenRouterProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    this.model = model || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  }

  async generate<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
    options?: { temperature?: number }
  ): Promise<T> {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://phoenixz.ai',
        'X-Title': 'PhoenixZ',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: options?.temperature ?? 0.2,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`[openrouter] HTTP ${response.status}: ${errText.slice(0, 300)}`);
    }

    const data = await response.json();
    const rawText: string = data.choices?.[0]?.message?.content ?? '';
    if (!rawText) {
      throw new Error(`[openrouter] Empty content response from model ${this.model}`);
    }

    return parseJsonResponse(rawText, schema, 'openrouter');
  }
}

let _openrouter: OpenRouterProvider | null = null;

export function getOpenRouterProvider(): LLMProvider | null {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!_openrouter) {
    _openrouter = new OpenRouterProvider(apiKey);
  }

  return _openrouter;
}
