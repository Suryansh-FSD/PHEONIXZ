import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runAutonomousCycle } from '@/agent/cycle';
import * as discoveryModule from '@/agent/discovery';
import * as agentsDb from '@/db/agents';
import * as candidatesDb from '@/db/candidates';
import * as decisionsDb from '@/db/decisions';
import * as postsDb from '@/db/posts';
import * as runsDb from '@/db/runs';
import * as breethMemory from '@/memory/breeth';
import * as aiFallback from '@/ai/withFallback';
import type { RawItem } from '@/agent/clustering';
import type { MemoryResult } from '@/schemas/memory';
import { z } from 'zod';
import { NormalizedCandidateSchema } from '@/schemas/candidate';
import { EditorialDecisionSchema } from '@/schemas/decision';
import { WriterOutputSchema } from '@/schemas/post';
import { QualityResultSchema } from '@/schemas/quality';

vi.mock('@/agent/discovery');
vi.mock('@/db/agents');
vi.mock('@/db/candidates');
vi.mock('@/db/decisions');
vi.mock('@/db/posts');
vi.mock('@/db/runs');
vi.mock('@/memory/breeth');
vi.mock('@/ai/withFallback');

describe('Competitive Thread Continuity Test', () => {
  const agentId = '00000000-0000-0000-0000-000000000001';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(agentsDb.getAgentById).mockResolvedValue({
      id: agentId,
      name: 'PheonixZ',
      domain: 'AI Product Strategy',
      persona_json: {},
      active: true,
      created_at: new Date().toISOString(),
    });

    vi.mocked(runsDb.createRun).mockResolvedValue({
      id: 'run-thread-1',
      agent_id: agentId,
      started_at: new Date().toISOString(),
      finished_at: null,
      status: 'running',
      candidates_found: 0,
      published: 0,
      watched: 0,
      rejected: 0,
      error: null,
      created_at: new Date().toISOString(),
    });

    vi.mocked(runsDb.completeRun).mockResolvedValue();
    vi.mocked(decisionsDb.getRecentDecisions).mockResolvedValue([]);
    vi.mocked(postsDb.getRecentPostTexts).mockResolvedValue([]);
    vi.mocked(postsDb.getLastPublishedAt).mockResolvedValue(null);
    vi.mocked(candidatesDb.candidateExistsByHash).mockResolvedValue(false);
  });

  it('verifies Cycle 1 stores competitive memory and Cycle 2 retrieves prior context for editorial scoring', async () => {
    // ── CYCLE 1: Company Alpha launches Feature X ──────────────────────────────
    const itemCycle1: RawItem = {
      title: 'Company Alpha Announces Feature X Multi-Modal Engine',
      body: 'Company Alpha introduced Feature X to its platform.',
      url: 'https://openai.com/blog/alpha-feature-x',
      publishedAt: '2026-08-07T08:00:00Z',
      source: 'openai_blog',
      sourceId: 'c1-1',
    };

    vi.mocked(discoveryModule.fetchAndClusterSources).mockResolvedValueOnce({
      items: [itemCycle1],
      sourceErrors: [],
    });

    vi.mocked(candidatesDb.insertCandidate).mockResolvedValueOnce({
      id: 'cand-alpha-x',
      agent_id: agentId,
      title: itemCycle1.title,
      summary: 'Company Alpha launches Feature X',
      company: 'Company Alpha',
      move_type: 'launch',
      url: itemCycle1.url,
      source: itemCycle1.source,
      source_id: itemCycle1.sourceId,
      discovered_at: itemCycle1.publishedAt,
      content_hash: 'hash-alpha-x',
      created_at: new Date().toISOString(),
    });

    vi.mocked(decisionsDb.insertDecision).mockResolvedValueOnce({
      id: 'dec-alpha-x',
      candidate_id: 'cand-alpha-x',
      agent_id: agentId,
      market_pressure: 25,
      strategic_signal: 20,
      evidence_quality: 20,
      timeliness: 15,
      persona_fit: 10,
      pattern_continuity: 5,
      score: 95,
      decision: 'publish',
      reason: 'Major launch setting competitive benchmark.',
      scored_breakdown_json: {},
      created_at: new Date().toISOString(),
    });

    vi.mocked(postsDb.insertPost).mockResolvedValueOnce({
      id: 'post-alpha-x',
      agent_id: agentId,
      related_candidate_id: 'cand-alpha-x',
      move_text: 'Alpha launched Feature X multi-modal engine today.',
      angle_text: 'First mover advantage in multi-modal integration.',
      pressure_text: 'Company Beta and Gamma must respond immediately.',
      take_text: 'PheonixZ views Feature X as the new competitive baseline.',
      text: 'Full text',
      rationale: 'Reason',
      sources: [itemCycle1.url],
      created_at: new Date().toISOString(),
    });

    vi.mocked(breethMemory.retrieveMemory).mockResolvedValueOnce({
      relevant: [],
      formattedContext: 'No prior memory.',
    });

    // Mock AI calls for Cycle 1 based on schema
    vi.mocked(aiFallback.withFallback).mockImplementation(async (sys, user, schema: z.ZodTypeAny) => {
      if (schema === NormalizedCandidateSchema) {
        return {
          isProductMove: true,
          company: 'Company Alpha',
          moveType: 'launch',
          title: itemCycle1.title,
          summary: 'Alpha launches Feature X',
          claims: ['Feature X launched'],
          evidenceQuality: 20,
        };
      }
      if (schema === EditorialDecisionSchema) {
        return {
          marketPressure: 25,
          strategicSignal: 20,
          evidenceQuality: 20,
          timeliness: 15,
          personaFit: 10,
          patternContinuity: 5,
          total: 95,
          decision: 'publish',
          reason: 'Major launch setting benchmark.',
        };
      }
      if (schema === WriterOutputSchema) {
        return {
          move: 'Alpha launched Feature X multi-modal engine today across all developer endpoints.',
          angle: 'First mover advantage in deep multi-modal system integration.',
          pressure: 'Company Beta and Company Gamma must adjust product roadmaps immediately.',
          take: 'PheonixZ views Feature X as establishing a new competitive baseline for 2026.',
        };
      }
      if (schema === QualityResultSchema) {
        return { pass: true, issues: [], revisedText: null };
      }
      throw new Error('Unexpected schema in cycle 1');
    });

    const cycle1Result = await runAutonomousCycle(agentId);
    expect(cycle1Result.published).toBe(1);

    // Verify Cycle 1 stored competitive move and judgment in Breeth memory
    expect(breethMemory.storeCompetitiveMove).toHaveBeenCalledWith(
      expect.objectContaining({ company: 'Company Alpha' }),
      expect.objectContaining({ decision: 'publish' })
    );
    expect(breethMemory.storePheonixzJudgment).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'post-alpha-x' }),
      expect.objectContaining({ company: 'Company Alpha' }),
      expect.anything()
    );

    // ── CYCLE 2: Company Beta launches equivalent Feature X ───────────────────
    const itemCycle2: RawItem = {
      title: 'Company Beta Counter-Launches Equivalent Feature X Model',
      body: 'Company Beta has responded to Company Alpha with its own Feature X engine.',
      url: 'https://anthropic.com/news/beta-feature-x',
      publishedAt: '2026-08-07T12:00:00Z',
      source: 'anthropic_news',
      sourceId: 'c2-1',
    };

    vi.mocked(discoveryModule.fetchAndClusterSources).mockResolvedValueOnce({
      items: [itemCycle2],
      sourceErrors: [],
    });

    vi.mocked(candidatesDb.insertCandidate).mockResolvedValueOnce({
      id: 'cand-beta-x',
      agent_id: agentId,
      title: itemCycle2.title,
      summary: 'Company Beta launches Feature X in response to Alpha',
      company: 'Company Beta',
      move_type: 'feature_parity',
      url: itemCycle2.url,
      source: itemCycle2.source,
      source_id: itemCycle2.sourceId,
      discovered_at: itemCycle2.publishedAt,
      content_hash: 'hash-beta-x',
      created_at: new Date().toISOString(),
    });

    // Simulate Breeth memory returning Alpha's prior move context for Cycle 2
    const alphaMemory: MemoryResult = {
      id: 'mem-alpha-1',
      category: 'competitive_move',
      content: 'Company Alpha made a launch move: "Company Alpha Announces Feature X Multi-Modal Engine". Score 95/100.',
      tags: ['Company Alpha', 'launch'],
      metadata: { date: '2026-08-07T08:00:00Z', moveType: 'launch', decision: 'publish' },
    };

    vi.mocked(breethMemory.retrieveMemory).mockResolvedValueOnce({
      relevant: [alphaMemory],
      formattedContext: `[Memory 1] (competitive_move): ${alphaMemory.content}`,
    });

    let editorialUserPromptReceived = '';

    vi.mocked(aiFallback.withFallback).mockImplementation(async (sys, user, schema: z.ZodTypeAny) => {
      if (schema === NormalizedCandidateSchema) {
        return {
          isProductMove: true,
          company: 'Company Beta',
          moveType: 'feature_parity',
          title: itemCycle2.title,
          summary: 'Company Beta launches Feature X',
          claims: ['Feature X parity'],
          evidenceQuality: 18,
        };
      }
      if (schema === EditorialDecisionSchema) {
        editorialUserPromptReceived = user;
        return {
          marketPressure: 20,
          strategicSignal: 15,
          evidenceQuality: 18,
          timeliness: 15,
          personaFit: 10,
          patternContinuity: 10, // Elevated due to memory continuity
          total: 88,
          decision: 'publish',
          reason: 'Company Beta responds directly to Alpha Feature X move.',
        };
      }
      if (schema === WriterOutputSchema) {
        return {
          move: 'Company Beta counter-launched an equivalent Feature X engine today.',
          angle: 'Reactive parity move attempting to close developer feature gap.',
          pressure: 'Company Alpha maintains first mover advantage while forcing Beta into reactive cycles.',
          take: 'PheonixZ notes clear competitive thread continuity following Alpha earlier move.',
        };
      }
      if (schema === QualityResultSchema) {
        return { pass: true, issues: [], revisedText: null };
      }
      throw new Error('Unexpected schema in cycle 2');
    });

    const cycle2Result = await runAutonomousCycle(agentId);
    expect(cycle2Result.published).toBe(1);

    expect(breethMemory.retrieveMemory).toHaveBeenCalledWith(
      expect.objectContaining({ company: 'Company Beta' })
    );

    expect(editorialUserPromptReceived).toContain('Company Alpha made a launch move');
    expect(editorialUserPromptReceived).toContain('Feature X');
  });
});
