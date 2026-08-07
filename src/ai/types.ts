import { z } from 'zod';

/**
 * Unified interface for all LLM providers.
 * Gemini is primary. Agent Router is fallback.
 * Neither leaks into business logic — only this interface does.
 */
export interface LLMProvider {
  generate<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
    options?: { temperature?: number }
  ): Promise<T>;
}
