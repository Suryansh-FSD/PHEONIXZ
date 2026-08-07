import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { withFallback } from '@/ai/withFallback';
import * as geminiModule from '@/ai/gemini';
import * as routerModule from '@/ai/agentRouter';
import type { LLMProvider } from '@/ai/types';

describe('AI Provider & Fallback Tests', () => {
  const dummySchema = z.object({
    result: z.string(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses Gemini primary provider when it succeeds', async () => {
    const mockGemini: LLMProvider = {
      generate: vi.fn().mockResolvedValue({ result: 'gemini-success' }),
    };

    vi.spyOn(geminiModule, 'getGeminiProvider').mockReturnValue(mockGemini);

    const res = await withFallback('sys', 'user', dummySchema);

    expect(res).toEqual({ result: 'gemini-success' });
    expect(mockGemini.generate).toHaveBeenCalledTimes(1);
  });

  it('falls back to Agent Router when Gemini throws an error or times out', async () => {
    const mockGemini: LLMProvider = {
      generate: vi.fn().mockRejectedValue(new Error('Gemini API 500 error / timeout')),
    };

    const mockRouter: LLMProvider = {
      generate: vi.fn().mockResolvedValue({ result: 'router-fallback-success' }),
    };

    vi.spyOn(geminiModule, 'getGeminiProvider').mockReturnValue(mockGemini);
    vi.spyOn(routerModule, 'getAgentRouterProvider').mockReturnValue(mockRouter);

    const res = await withFallback('sys', 'user', dummySchema);

    expect(res).toEqual({ result: 'router-fallback-success' });
    expect(mockGemini.generate).toHaveBeenCalledTimes(1);
    expect(mockRouter.generate).toHaveBeenCalledTimes(1);
  });

  it('throws a descriptive error when both Gemini and Agent Router fail', async () => {
    const mockGemini: LLMProvider = {
      generate: vi.fn().mockRejectedValue(new Error('Gemini quota exceeded')),
    };

    const mockRouter: LLMProvider = {
      generate: vi.fn().mockRejectedValue(new Error('Agent Router timeout')),
    };

    vi.spyOn(geminiModule, 'getGeminiProvider').mockReturnValue(mockGemini);
    vi.spyOn(routerModule, 'getAgentRouterProvider').mockReturnValue(mockRouter);

    await expect(withFallback('sys', 'user', dummySchema)).rejects.toThrow(
      /Both providers failed/
    );
  });

  it('throws if Gemini fails and Agent Router is unconfigured', async () => {
    const mockGemini: LLMProvider = {
      generate: vi.fn().mockRejectedValue(new Error('Gemini unavailable')),
    };

    vi.spyOn(geminiModule, 'getGeminiProvider').mockReturnValue(mockGemini);
    vi.spyOn(routerModule, 'getAgentRouterProvider').mockReturnValue(null);

    await expect(withFallback('sys', 'user', dummySchema)).rejects.toThrow(
      /Gemini failed and Agent Router is not configured/
    );
  });
});
