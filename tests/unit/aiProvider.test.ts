import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { withFallback } from '@/ai/withFallback';
import * as registryModule from '@/ai/providerRegistry';
import type { LLMProvider } from '@/ai/types';

describe('AI Provider & Fallback Tests', () => {
  const dummySchema = z.object({
    result: z.string(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses Groq primary provider when it succeeds', async () => {
    const mockGroq: LLMProvider = {
      generate: vi.fn().mockResolvedValue({ result: 'groq-primary-success' }),
    };

    vi.spyOn(registryModule, 'getConfiguredProviderOrder').mockReturnValue(['groq', 'gemini']);
    vi.spyOn(registryModule, 'getProviderByName').mockImplementation((name) => {
      if (name === 'groq') return mockGroq;
      return null;
    });

    const res = await withFallback('sys', 'user', dummySchema);

    expect(res).toEqual({ result: 'groq-primary-success' });
    expect(mockGroq.generate).toHaveBeenCalledTimes(1);
  });

  it('falls back to Gemini when Groq throws an error or times out', async () => {
    const mockGroq: LLMProvider = {
      generate: vi.fn().mockRejectedValue(new Error('Groq rate limit error')),
    };

    const mockGemini: LLMProvider = {
      generate: vi.fn().mockResolvedValue({ result: 'gemini-fallback-success' }),
    };

    vi.spyOn(registryModule, 'getConfiguredProviderOrder').mockReturnValue(['groq', 'gemini']);
    vi.spyOn(registryModule, 'getProviderByName').mockImplementation((name) => {
      if (name === 'groq') return mockGroq;
      if (name === 'gemini') return mockGemini;
      return null;
    });

    const res = await withFallback('sys', 'user', dummySchema);

    expect(res).toEqual({ result: 'gemini-fallback-success' });
    expect(mockGroq.generate).toHaveBeenCalledTimes(1);
    expect(mockGemini.generate).toHaveBeenCalledTimes(1);
  });

  it('throws a descriptive error when all configured providers fail', async () => {
    const mockGroq: LLMProvider = {
      generate: vi.fn().mockRejectedValue(new Error('Groq 401 error')),
    };

    const mockGemini: LLMProvider = {
      generate: vi.fn().mockRejectedValue(new Error('Gemini quota exceeded')),
    };

    vi.spyOn(registryModule, 'getConfiguredProviderOrder').mockReturnValue(['groq', 'gemini']);
    vi.spyOn(registryModule, 'getProviderByName').mockImplementation((name) => {
      if (name === 'groq') return mockGroq;
      if (name === 'gemini') return mockGemini;
      return null;
    });

    await expect(withFallback('sys', 'user', dummySchema)).rejects.toThrow(
      /Both providers failed/
    );
  });

  it('falls back to Gemini if Groq is unconfigured', async () => {
    const mockGemini: LLMProvider = {
      generate: vi.fn().mockResolvedValue({ result: 'gemini-direct-success' }),
    };

    vi.spyOn(registryModule, 'getConfiguredProviderOrder').mockReturnValue(['groq', 'gemini']);
    vi.spyOn(registryModule, 'getProviderByName').mockImplementation((name) => {
      if (name === 'gemini') return mockGemini;
      return null;
    });

    const res = await withFallback('sys', 'user', dummySchema);

    expect(res).toEqual({ result: 'gemini-direct-success' });
    expect(mockGemini.generate).toHaveBeenCalledTimes(1);
  });
});
