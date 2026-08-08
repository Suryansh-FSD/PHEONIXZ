import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import type { LLMProvider } from './types';
import { parseJsonResponse } from './parseJson';

const MODEL_NAME = process.env.GEMINI_MODEL ?? 'gemini-flash-latest';

class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
    options?: { temperature?: number }
  ): Promise<T> {
    const model = this.client.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: options?.temperature ?? 0.2,
      },
    });

    const response = await model.generateContent(userPrompt);
    const text = response.response.text();

    return parseJsonResponse(text, schema, 'gemini');
  }
}

// Singleton
let _gemini: GeminiProvider | null = null;

export function getGeminiProvider(): LLMProvider {
  if (!_gemini) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is required');
    _gemini = new GeminiProvider(apiKey);
  }
  return _gemini;
}
