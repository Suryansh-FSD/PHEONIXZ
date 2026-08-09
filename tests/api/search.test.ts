import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/agent/search/route';
import { NextRequest } from 'next/server';
import * as searchEngine from '@/agent/searchEngine';
import { SearchIntelligenceResult } from '@/types/phoenixz';

vi.mock('@/agent/searchEngine', () => ({
  executeSearchIntelligence: vi.fn(),
}));

function createJsonRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/agent/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/agent/search API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns HTTP 400 when search query is missing', async () => {
    const req = createJsonRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('query is required');
  });

  it('returns HTTP 400 when search query is empty string', async () => {
    const req = createJsonRequest({ query: '   ' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it('returns HTTP 200 with SearchIntelligenceResult payload for valid query', async () => {
    const mockResult: SearchIntelligenceResult = {
      query: 'OpenAI',
      found: true,
      intent: 'company',
      entity: { name: 'OpenAI', parentCompany: 'OpenAI', type: 'Company' },
      overview: 'OpenAI overview statement.',
      currentSignal: 'Current signal statement.',
      recentMoves: [],
      competitiveImpact: 'Impact analysis.',
      sources: [{ title: 'OpenAI', url: 'https://openai.com' }],
      relatedEntities: { companies: ['Anthropic'], products: ['Claude'] },
    };

    vi.mocked(searchEngine.executeSearchIntelligence).mockResolvedValue(mockResult);

    const req = createJsonRequest({ query: 'OpenAI' });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.query).toBe('OpenAI');
    expect(json.entity.name).toBe('OpenAI');
  });

  it('returns HTTP 500 when search execution throws an unhandled error', async () => {
    vi.mocked(searchEngine.executeSearchIntelligence).mockRejectedValue(
      new Error('Search backend crash')
    );

    const req = createJsonRequest({ query: 'FaultyQuery' });
    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe('Search backend crash');
  });
});
