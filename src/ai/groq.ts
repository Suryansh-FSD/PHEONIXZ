import { z } from 'zod';
import type { LLMProvider } from './types';
import { parseJsonResponse } from './parseJson';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

class GroqProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    this.model = model || process.env.GROQ_MODEL || DEFAULT_MODEL;
  }

  async generate<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
    options?: { temperature?: number }
  ): Promise<T> {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
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
      throw new Error(`[groq] HTTP ${response.status}: ${errText.slice(0, 300)}`);
    }

    const data = await response.json();
    const rawText: string = data.choices?.[0]?.message?.content ?? '';
    if (!rawText) {
      throw new Error(`[groq] Empty content response from model ${this.model}`);
    }

    return parseJsonResponse(rawText, schema, 'groq');
  }
}

let _groq: GroqProvider | null = null;

export function getGroqProvider(): LLMProvider | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!_groq) {
    _groq = new GroqProvider(apiKey);
  }

  return _groq;
}
