import type { LLMProvider } from './types';
import { getGroqProvider } from './groq';
import { getGeminiProvider } from './gemini';
import { getOpenRouterProvider } from './openrouter';
import { getAnthropicAgentRouterProvider } from './anthropicAgentRouter';
import { getAgentRouterProvider } from './agentRouter';

export type ProviderName =
  | 'groq'
  | 'gemini'
  | 'openrouter'
  | 'anthropic-agentrouter'
  | 'agentrouter';

const PROVIDER_GETTERS: Record<string, () => LLMProvider | null> = {
  groq: getGroqProvider,
  gemini: () => {
    try {
      return getGeminiProvider();
    } catch {
      return null;
    }
  },
  openrouter: getOpenRouterProvider,
  'anthropic-agentrouter': getAnthropicAgentRouterProvider,
  agentrouter: getAgentRouterProvider,
};

/**
 * Get a provider instance by name.
 * Returns null if the provider is unconfigured or credentials are missing.
 */
export function getProviderByName(name: string): LLMProvider | null {
  const normalized = name.toLowerCase().trim();
  const getter = PROVIDER_GETTERS[normalized];
  if (!getter) {
    return null;
  }
  try {
    return getter();
  } catch {
    return null;
  }
}

/**
 * Get the ordered list of provider names to evaluate during fallback.
 * Honors AI_PRIMARY_PROVIDER (if set) and AI_PROVIDER_ORDER (defaults to "groq,gemini,openrouter,anthropic-agentrouter").
 */
export function getConfiguredProviderOrder(): ProviderName[] {
  const defaultOrder: ProviderName[] = [
    'groq',
    'gemini',
    'openrouter',
    'anthropic-agentrouter',
  ];

  let order: ProviderName[] = [];

  const rawOrder = process.env.AI_PROVIDER_ORDER;
  if (rawOrder && rawOrder.trim()) {
    const parts = rawOrder
      .split(',')
      .map((p) => p.toLowerCase().trim() as ProviderName)
      .filter((p) => p in PROVIDER_GETTERS);
    if (parts.length > 0) {
      order = parts;
    }
  }

  if (order.length === 0) {
    order = [...defaultOrder];
  }

  const primary = process.env.AI_PRIMARY_PROVIDER?.toLowerCase().trim() as ProviderName;
  if (primary && primary in PROVIDER_GETTERS) {
    order = [primary, ...order.filter((p) => p !== primary)];
  }

  return order;
}
