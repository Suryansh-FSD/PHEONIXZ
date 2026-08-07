import { z } from 'zod';
import { getGeminiProvider } from './gemini';
import { getAgentRouterProvider } from './agentRouter';
import type { LLMProvider } from './types';

/**
 * Primary → Fallback orchestration.
 *
 * 1. Try Gemini (primary).
 * 2. If Gemini throws, try Agent Router (fallback).
 * 3. If Agent Router is not configured or also throws, propagate error.
 *
 * Never silently swallows errors — always throws if both fail.
 */
export async function withFallback<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: z.ZodSchema<T>,
  options?: { temperature?: number }
): Promise<T> {
  const primary: LLMProvider = getGeminiProvider();

  try {
    return await primary.generate(systemPrompt, userPrompt, schema, options);
  } catch (primaryErr) {
    console.warn('[ai] Gemini failed, attempting Agent Router fallback:', primaryErr);

    const fallback = getAgentRouterProvider();
    if (!fallback) {
      throw new Error(
        `[ai] Gemini failed and Agent Router is not configured. Primary error: ${primaryErr}`
      );
    }

    try {
      return await fallback.generate(systemPrompt, userPrompt, schema, options);
    } catch (fallbackErr) {
      throw new Error(
        `[ai] Both providers failed.\nGemini: ${primaryErr}\nAgent Router: ${fallbackErr}`
      );
    }
  }
}
