import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';
import { AnthropicAgentRouterProvider } from '@/ai/anthropicAgentRouter';

describe('AnthropicAgentRouterProvider Unit Tests', () => {
  const dummySchema = z.object({
    status: z.string(),
    message: z.string(),
  });

  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('constructs Anthropic request correctly and extracts successful text block response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          { type: 'text', text: '```json\n{"status": "ok", "message": "hello from claude"}\n```' },
        ],
      }),
    });
    globalThis.fetch = mockFetch;

    const provider = new AnthropicAgentRouterProvider(
      'https://co.agentrouter.org',
      'test-auth-token',
      'claude-opus-4-8'
    );

    const result = await provider.generate('System prompt', 'User prompt', dummySchema);

    expect(result).toEqual({ status: 'ok', message: 'hello from claude' });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://co.agentrouter.org/v1/messages');
    expect(options.headers['x-api-key']).toBe('test-auth-token');
    expect(options.headers['anthropic-version']).toBe('2023-06-01');

    const body = JSON.parse(options.body);
    expect(body.model).toBe('claude-opus-4-8');
    expect(body.system).toBe('System prompt');
    expect(body.messages).toEqual([{ role: 'user', content: 'User prompt' }]);
  });

  it('normalizes base URLs ending with slash or /v1 cleanly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: '{"status": "ok", "message": "url test"}' }],
      }),
    });
    globalThis.fetch = mockFetch;

    const provider = new AnthropicAgentRouterProvider(
      'https://co.agentrouter.org/v1/',
      'test-auth-token',
      'claude-opus-4-8'
    );

    await provider.generate('System prompt', 'User prompt', dummySchema);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://co.agentrouter.org/v1/messages');
  });

  it('handles HTTP error responses gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => '{"error": "Unauthorized key"}',
    });
    globalThis.fetch = mockFetch;

    const provider = new AnthropicAgentRouterProvider(
      'https://co.agentrouter.org',
      'invalid-token',
      'claude-opus-4-8'
    );

    await expect(
      provider.generate('System prompt', 'User prompt', dummySchema)
    ).rejects.toThrow(/\[anthropic-agent-router\] HTTP 401/);
  });

  it('handles malformed JSON response safely', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'This is not valid JSON content' }],
      }),
    });
    globalThis.fetch = mockFetch;

    const provider = new AnthropicAgentRouterProvider(
      'https://co.agentrouter.org',
      'test-token',
      'claude-opus-4-8'
    );

    await expect(
      provider.generate('System prompt', 'User prompt', dummySchema)
    ).rejects.toThrow(/JSON parse error/);
  });

  it('handles empty content response safely', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
      }),
    });
    globalThis.fetch = mockFetch;

    const provider = new AnthropicAgentRouterProvider(
      'https://co.agentrouter.org',
      'test-token',
      'claude-opus-4-8'
    );

    await expect(
      provider.generate('System prompt', 'User prompt', dummySchema)
    ).rejects.toThrow(/Empty text in response/);
  });
});
