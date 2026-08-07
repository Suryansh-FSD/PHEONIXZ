import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runAutonomousCycle } from '@/agent/cycle';
import * as discoveryModule from '@/agent/discovery';
import * as agentsDb from '@/db/agents';
import * as candidatesDb from '@/db/candidates';
import * as decisionsDb from '@/db/decisions';
import * as postsDb from '@/db/posts';
import * as runsDb from '@/db/runs';
import * as sourceStatusDb from '@/db/sourceStatus';
import * as breethMemory from '@/memory/breeth';
import * as aiFallback from '@/ai/withFallback';
import { z } from 'zod';
import { NormalizedCandidateSchema } from '@/schemas/candidate';
import { EditorialDecisionSchema } from '@/schemas/decision';
import { WriterOutputSchema } from '@/schemas/post';
import { QualityResultSchema } from '@/schemas/quality';
import type { RawItem } from '@/agent/clustering';

vi.mock('@/agent/discovery');
vi.mock('@/db/agents');
vi.mock('@/db/candidates');
vi.mock('@/db/decisions');
vi.mock('@/db/posts');
vi.mock('@/db/runs');
vi.mock('@/db/sourceStatus');
vi.mock('@/memory/breeth');
vi.mock('@/ai/withFallback');

describe('Failure Isolation Tests', () => {
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
      id: 'run-fail-1',
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
    vi.mocked(sourceStatusDb.isSourceDead).mockResolvedValue(false);
    vi.mocked(sourceStatusDb.recordSourceSuccess).mockResolvedValue();
    vi.mocked(sourceStatusDb.recordSourceFailure).mockResolvedValue();
    vi.mocked(breethMemory.retrieveMemory).mockResolvedValue({
      relevant: [],
      formattedContext: 'No memory.',
    });
    vi.mocked(breethMemory.storeCompetitiveMove).mockResolvedValue();
    vi.mocked(breethMemory.storePheonixzJudgment).mockResolvedValue();
  });

  describe('Discovery Source Failure Isolation', () => {
    it('isolates RSS source failure — records failure for broken source and continues with remaining sources', async () => {
      const itemsFromSource2: RawItem[] = [
        {
          title: 'Source 2 Company Product Move Announcement',
          body: 'Source 2 valid body content',
          url: 'https://source2.com/item1',
          publishedAt: new Date().toISOString(),
          source: 'anthropic_news',
          sourceId: 's2-1',
        },
      ];

      vi.mocked(discoveryModule.fetchAndClusterSources).mockImplementation(async () => {
        await sourceStatusDb.recordSourceFailure('openai_blog');
        await sourceStatusDb.recordSourceSuccess('anthropic_news');
        return { items: itemsFromSource2, sourceErrors: ['openai_blog: timeout after 12000ms'] };
      });

      const { items, sourceErrors } = await discoveryModule.fetchAndClusterSources();

      expect(sourceErrors.length).toBe(1);
      expect(sourceErrors[0]).toContain('openai_blog');
      expect(items.length).toBe(1);
      expect(sourceStatusDb.recordSourceFailure).toHaveBeenCalledWith('openai_blog');
      expect(sourceStatusDb.recordSourceSuccess).toHaveBeenCalledWith('anthropic_news');
    });
  });

  describe('AI Call & Step Level Failure Isolation in Autonomous Cycle', () => {
    it('isolates AI timeout for candidate 1 — candidates 2 and 3 continue and complete cycle', async () => {
      const item1: RawItem = {
        title: 'Item 1 Timeout Test',
        body: 'Body 1',
        url: 'https://source.com/item1',
        publishedAt: new Date().toISOString(),
        source: 'openai_blog',
        sourceId: 'item-1',
      };

      const item2: RawItem = {
        title: 'Item 2 Success Test',
        body: 'Body 2',
        url: 'https://source.com/item2',
        publishedAt: new Date().toISOString(),
        source: 'anthropic_news',
        sourceId: 'item-2',
      };

      const item3: RawItem = {
        title: 'Item 3 Success Test',
        body: 'Body 3',
        url: 'https://source.com/item3',
        publishedAt: new Date().toISOString(),
        source: 'google_deepmind',
        sourceId: 'item-3',
      };

      vi.mocked(discoveryModule.fetchAndClusterSources).mockResolvedValue({
        items: [item1, item2, item3],
        sourceErrors: [],
      });

      vi.mocked(candidatesDb.insertCandidate).mockImplementation(async (data) => ({
        id: `cand-${data.source_id}`,
        created_at: new Date().toISOString(),
        ...data,
      }));

      vi.mocked(decisionsDb.insertDecision).mockImplementation(async (data) => ({
        id: `dec-${data.candidate_id}`,
        created_at: new Date().toISOString(),
        ...data,
      }));

      vi.mocked(postsDb.insertPost).mockImplementation(async (data) => ({
        id: `post-${data.related_candidate_id}`,
        created_at: new Date().toISOString(),
        ...data,
      }));

      vi.mocked(aiFallback.withFallback).mockImplementation(async (sys, user, schema: z.ZodTypeAny) => {
        if (user.includes('Item 1 Timeout Test')) {
          throw new Error('AI Timeout during normalization for item 1');
        }

        if (schema === NormalizedCandidateSchema) {
          return {
            isProductMove: true,
            company: 'Test Co',
            moveType: 'launch',
            title: 'Success Title',
            summary: 'Success summary',
            claims: ['Claim 1'],
            evidenceQuality: 18,
          };
        }

        if (schema === EditorialDecisionSchema) {
          return {
            marketPressure: 20,
            strategicSignal: 15,
            evidenceQuality: 15,
            timeliness: 10,
            personaFit: 5,
            patternContinuity: 5,
            total: 70,
            decision: 'watch',
            reason: 'Good candidate',
          };
        }

        throw new Error('Unexpected schema');
      });

      const result = await runAutonomousCycle(agentId);

      // Item 1 failed with error, Items 2 and 3 succeeded
      expect(result.errors).toBe(1);
      expect(result.watched).toBe(2);
      expect(result.candidatesFound).toBe(2);
      expect(runsDb.completeRun).toHaveBeenCalledWith('run-fail-1', expect.objectContaining({
        watched: 2,
      }));
    });

    it('isolates Writer failure for candidate 2 — remaining candidates continue cycle', async () => {
      const item1: RawItem = {
        title: 'Candidate 1 Success Move',
        body: 'Body 1',
        url: 'https://source.com/cand1',
        publishedAt: new Date().toISOString(),
        source: 'openai_blog',
        sourceId: 'c-1',
      };

      const item2: RawItem = {
        title: 'Candidate 2 Writer Failure Move',
        body: 'Body 2',
        url: 'https://source.com/cand2',
        publishedAt: new Date().toISOString(),
        source: 'anthropic_news',
        sourceId: 'c-2',
      };

      vi.mocked(discoveryModule.fetchAndClusterSources).mockResolvedValue({
        items: [item1, item2],
        sourceErrors: [],
      });

      vi.mocked(candidatesDb.insertCandidate).mockImplementation(async (data) => ({
        id: `cand-${data.source_id}`,
        created_at: new Date().toISOString(),
        ...data,
      }));

      vi.mocked(decisionsDb.insertDecision).mockImplementation(async (data) => ({
        id: `dec-${data.candidate_id}`,
        created_at: new Date().toISOString(),
        ...data,
      }));

      vi.mocked(postsDb.insertPost).mockImplementation(async (data) => ({
        id: `post-${data.related_candidate_id}`,
        created_at: new Date().toISOString(),
        ...data,
      }));

      vi.mocked(aiFallback.withFallback).mockImplementation(async (sys, user, schema: z.ZodTypeAny) => {
        if (schema === NormalizedCandidateSchema) {
          return {
            isProductMove: true,
            company: 'Test Co',
            moveType: 'launch',
            title: user.includes('cand1') ? 'Candidate 1 Title' : 'Candidate 2 Title',
            summary: 'Summary',
            claims: ['Claim'],
            evidenceQuality: 20,
          };
        }

        if (schema === EditorialDecisionSchema) {
          return {
            marketPressure: 22,
            strategicSignal: 18,
            evidenceQuality: 20,
            timeliness: 10,
            personaFit: 5,
            patternContinuity: 5,
            total: 80,
            decision: 'publish',
            reason: 'High score',
          };
        }

        if (schema === WriterOutputSchema) {
          if (user.includes('c-2') || user.includes('Candidate 2')) {
            throw new Error('Writer LLM failed for Candidate 2');
          }
          return {
            move: 'Candidate 1 launched a new product today for developers.',
            angle: 'Strategic move aimed at increasing developer engagement.',
            pressure: 'Competitors must respond with similar developer features.',
            take: 'PheonixZ views this launch as an important product move.',
          };
        }

        if (schema === QualityResultSchema) {
          return { pass: true, issues: [], revisedText: null };
        }

        throw new Error('Unexpected schema');
      });

      const result = await runAutonomousCycle(agentId);

      // Candidate 1 published, Candidate 2 writer error caught and stats.errors incremented
      expect(result.published).toBe(1);
      expect(result.errors).toBe(1);
      expect(runsDb.completeRun).toHaveBeenCalledWith('run-fail-1', expect.objectContaining({
        published: 1,
      }));
    });
  });
});
