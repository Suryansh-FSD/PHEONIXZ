import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getProviderByName, getConfiguredProviderOrder } from '@/ai/providerRegistry';

describe('Provider Registry Unit Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns null for unknown provider names or missing credentials', () => {
    delete process.env.GROQ_API_KEY;
    expect(getProviderByName('nonexistent-provider')).toBeNull();
  });

  it('honors default provider ordering (groq -> gemini -> openrouter -> anthropic-agentrouter)', () => {
    delete process.env.AI_PRIMARY_PROVIDER;
    delete process.env.AI_PROVIDER_ORDER;

    const order = getConfiguredProviderOrder();
    expect(order).toEqual(['groq', 'gemini', 'openrouter', 'anthropic-agentrouter']);
  });

  it('honors custom AI_PROVIDER_ORDER environment variable', () => {
    process.env.AI_PROVIDER_ORDER = 'gemini, groq, openrouter';
    delete process.env.AI_PRIMARY_PROVIDER;

    const order = getConfiguredProviderOrder();
    expect(order).toEqual(['gemini', 'groq', 'openrouter']);
  });

  it('prioritizes AI_PRIMARY_PROVIDER over AI_PROVIDER_ORDER', () => {
    process.env.AI_PROVIDER_ORDER = 'groq, gemini, openrouter';
    process.env.AI_PRIMARY_PROVIDER = 'anthropic-agentrouter';

    const order = getConfiguredProviderOrder();
    expect(order[0]).toBe('anthropic-agentrouter');
    expect(order).toContain('groq');
    expect(order).toContain('gemini');
  });

  it('instantiates Groq provider when GROQ_API_KEY is configured', () => {
    process.env.GROQ_API_KEY = 'test-groq-key';
    process.env.GROQ_MODEL = 'llama-3.3-70b-versatile';

    const provider = getProviderByName('groq');
    expect(provider).not.toBeNull();
  });
});
