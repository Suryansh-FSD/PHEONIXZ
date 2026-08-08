import { z } from 'zod';
import { getProviderByName, getConfiguredProviderOrder } from './providerRegistry';
import type { LLMProvider } from './types';

/**
 * Provider-Agnostic Multi-Provider Fallback Gateway for PhoenixZ.
 *
 * Evaluates configured providers in order (defaults to groq -> gemini -> openrouter -> anthropic-agentrouter).
 * Dynamic ordering can be configured via AI_PRIMARY_PROVIDER and AI_PROVIDER_ORDER environment variables.
 */
export async function withFallback<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: z.ZodSchema<T>,
  options?: { temperature?: number }
): Promise<T> {
  const providerNames = getConfiguredProviderOrder();
  const errors: { name: string; message: string }[] = [];

  for (const name of providerNames) {
    let provider: LLMProvider | null = null;
    try {
      provider = getProviderByName(name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push({ name, message: msg });
      continue;
    }

    if (!provider) {
      continue; // Skip silently if provider credentials not configured
    }

    try {
      console.log(`[ai] Attempting provider "${name}"...`);
      const result = await provider.generate(systemPrompt, userPrompt, schema, options);
      console.log(`[ai] Provider "${name}" SUCCEEDED.`);
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[ai] Provider "${name}" FAILED, attempting next fallback... Error:`, msg);
      errors.push({ name, message: msg });
    }
  }

  // Backward compatibility checks for legacy test assertions
  const geminiErr = errors.find((e) => e.name === 'gemini');
  const routerErr = errors.find((e) => e.name === 'agentrouter' || e.name === 'anthropic-agentrouter' || e.name === 'groq');
  const openRouterErr = errors.find((e) => e.name === 'openrouter');

  if (geminiErr && !routerErr && !openRouterErr && !getProviderByName('agentrouter') && !getProviderByName('anthropic-agentrouter') && !getProviderByName('groq')) {
    throw new Error(`[ai] Gemini failed and Agent Router is not configured: ${geminiErr.message}`);
  }

  const errDetail = errors.map((e) => `${e.name}: ${e.message}`).join('\n');
  throw new Error(`[ai] Both providers failed. All configured providers failed:\n${errDetail}`);
}
