import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeSearchIntelligence } from '@/agent/searchEngine';
import * as postsDb from '@/db/posts';
import * as decisionsDb from '@/db/decisions';
import * as aiFallback from '@/ai/withFallback';

vi.mock('@/db/posts', () => ({
  getPostsByAgent: vi.fn(),
}));

vi.mock('@/db/decisions', () => ({
  getDecisionsByAgent: vi.fn(),
}));

vi.mock('@/ai/withFallback', () => ({
  withFallback: vi.fn(),
}));

describe('Search Intelligence Engine (Unit Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects empty or whitespace queries with an error', async () => {
    await expect(executeSearchIntelligence('')).rejects.toThrow('Search query cannot be empty');
    await expect(executeSearchIntelligence('   ')).rejects.toThrow('Search query cannot be empty');
  });

  it('correctly executes a company search for "OpenAI"', async () => {
    vi.mocked(postsDb.getPostsByAgent).mockResolvedValue([
      {
        id: 'p1',
        agent_id: 'a1',
        related_candidate_id: null,
        move_text: 'OpenAI announced 50% price cuts across API endpoints.',
        angle_text: 'Pricing pressure.',
        pressure_text: 'High.',
        take_text: 'Aggressive pricing move.',
        text: 'OpenAI API Price Cuts details.',
        rationale: 'High market impact.',
        created_at: new Date().toISOString(),
        sources: ['https://openai.com/blog/price-cuts'],
      },
    ]);

    vi.mocked(decisionsDb.getDecisionsByAgent).mockResolvedValue([]);
    vi.mocked(aiFallback.withFallback).mockResolvedValue({
      overview: 'OpenAI is a leading artificial intelligence research laboratory.',
      currentSignal: 'OpenAI recently cut API prices by 50 percent.',
      competitiveImpact: 'Forces competitor pricing adjustments across developer platforms.',
    });

    const result = await executeSearchIntelligence('OpenAI');

    expect(result.found).toBe(true);
    expect(result.query).toBe('OpenAI');
    expect(result.entity.name).toBe('OpenAI');
    expect(result.entity.type).toBe('Company');
    expect(result.overview).toContain('OpenAI');
    expect(result.recentMoves.length).toBe(1);
    expect(result.sources.length).toBeGreaterThan(0);
  });

  it('correctly executes a product search for "Claude"', async () => {
    vi.mocked(postsDb.getPostsByAgent).mockResolvedValue([
      {
        id: 'p2',
        agent_id: 'a1',
        related_candidate_id: null,
        move_text: 'Claude 3.5 Sonnet outperforms benchmark models.',
        angle_text: 'Developer parity.',
        pressure_text: 'Medium.',
        take_text: 'Anthropic benchmarks.',
        text: 'Claude 3.5 Sonnet launch.',
        rationale: 'High evidence quality.',
        created_at: new Date().toISOString(),
        sources: ['https://anthropic.com/news/claude-3-5-sonnet'],
      },
    ]);

    vi.mocked(decisionsDb.getDecisionsByAgent).mockResolvedValue([]);
    vi.mocked(aiFallback.withFallback).mockResolvedValue({
      overview: 'Claude is a family of large language models developed by Anthropic.',
      currentSignal: 'Claude 3.5 Sonnet set new industry benchmarks for coding.',
      competitiveImpact: 'Increases pressure on OpenAI GPT-4o developer workflows.',
    });

    const result = await executeSearchIntelligence('Claude');

    expect(result.found).toBe(true);
    expect(result.query).toBe('Claude');
    expect(result.entity.name).toBe('Claude');
    expect(result.entity.parentCompany).toBe('Anthropic');
    expect(result.recentMoves.length).toBe(1);
  });

  it('gracefully handles missing database records and AI provider failure', async () => {
    vi.mocked(postsDb.getPostsByAgent).mockRejectedValue(new Error('Database offline'));
    vi.mocked(decisionsDb.getDecisionsByAgent).mockRejectedValue(new Error('Database offline'));
    vi.mocked(aiFallback.withFallback).mockRejectedValue(new Error('All AI providers failed'));

    const result = await executeSearchIntelligence('Gemini');

    expect(result.found).toBe(true);
    expect(result.query).toBe('Gemini');
    expect(result.entity.name).toBe('Gemini');
    expect(result.overview).toContain('Gemini');
    expect(result.sources.length).toBeGreaterThan(0);
  });
});
