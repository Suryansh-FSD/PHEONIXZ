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
import { STORY_A, STORY_B, STORY_C, STORY_D, STORY_E } from '../fixtures/syntheticData';
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

describe('Synthetic Autonomous Cycle - End-to-End Pipeline', () => {
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
      id: 'run-1',
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

    vi.mocked(breethMemory.retrieveMemory).mockResolvedValue({
      relevant: [],
      formattedContext: 'No memory.',
    });
    vi.mocked(breethMemory.storeCompetitiveMove).mockResolvedValue();
    vi.mocked(breethMemory.storePheonixzJudgment).mockResolvedValue();
  });

  it('runs complete 16-step cycle with deduplication, filtering, scoring, writer, and quality gate', async () => {
    vi.mocked(discoveryModule.fetchAndClusterSources).mockResolvedValue({
      items: [STORY_A, STORY_B, STORY_C, STORY_D, STORY_E],
      sourceErrors: [],
    });

    // Realistic stateful hash set for candidate deduplication
    const seenHashes = new Set<string>();

    vi.mocked(candidatesDb.candidateExistsByHash).mockImplementation(async (hash) => {
      return seenHashes.has(hash);
    });

    vi.mocked(candidatesDb.insertCandidate).mockImplementation(async (data) => {
      seenHashes.add(data.content_hash);
      return {
        id: `cand-${data.company.replace(/\s+/g, '-')}`,
        created_at: new Date().toISOString(),
        ...data,
      };
    });

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

    vi.mocked(aiFallback.withFallback).mockImplementation(async (sys, user, schema) => {
      if (schema === NormalizedCandidateSchema) {
        if (user.includes('Reflections on the Philosophy')) {
          return {
            isProductMove: false,
            company: '',
            moveType: 'launch',
            title: '',
            summary: '',
            claims: [],
            evidenceQuality: 0,
          };
        }
        if (user.includes('Company Beta Launches Matching')) {
          return {
            isProductMove: true,
            company: 'Company Beta',
            moveType: 'feature_parity',
            title: 'Company Beta Launches Matching Low-Cost Model Tier',
            summary: 'Company Beta matches Alpha pricing.',
            claims: ['New model tier launched'],
            evidenceQuality: 18,
          };
        }
        if (user.includes('Rumor: Anonymous Sources Claim')) {
          return {
            isProductMove: true,
            company: 'Company Gamma',
            moveType: 'launch',
            title: 'Rumor: Company Gamma Might Announce Something',
            summary: 'Unverified speculation.',
            claims: [],
            evidenceQuality: 2,
          };
        }
        if (user.includes('Company Alpha Slashes')) {
          return {
            isProductMove: true,
            company: 'Company Alpha',
            moveType: 'pricing',
            title: 'Company Alpha Slashes Developer API Prices by 50 Percent',
            summary: 'Company Alpha reduced API costs by 50%.',
            claims: ['50% price reduction'],
            evidenceQuality: 20,
          };
        }
      }

      if (schema === EditorialDecisionSchema) {
        if (user.includes('Company: Company Beta')) {
          return {
            marketPressure: 15,
            strategicSignal: 15,
            evidenceQuality: 15,
            timeliness: 10,
            personaFit: 5,
            patternContinuity: 5,
            total: 65,
            decision: 'watch',
            reason: 'Expected reactive move.',
          };
        }
        if (user.includes('Company: Company Gamma')) {
          return {
            marketPressure: 5,
            strategicSignal: 5,
            evidenceQuality: 10,
            timeliness: 10,
            personaFit: 5,
            patternContinuity: 5,
            total: 40,
            decision: 'reject',
            reason: 'Insufficient evidence quality and market pressure.',
          };
        }
        if (user.includes('Company: Company Alpha')) {
          return {
            marketPressure: 22,
            strategicSignal: 18,
            evidenceQuality: 20,
            timeliness: 10,
            personaFit: 5,
            patternContinuity: 5,
            total: 80,
            decision: 'publish',
            reason: 'Forces immediate response from all model providers.',
          };
        }
      }

      if (schema === WriterOutputSchema) {
        return {
          move: 'Company Alpha reduced developer API prices by 50 percent today across all model endpoints.',
          angle: 'This move shifts competitive leverage toward high volume developers and enterprise customers.',
          pressure: 'Company Beta and Company Gamma must adjust API margins or risk developer migration.',
          take: 'PheonixZ views this pricing reduction as a strategic price war initiation benchmark.',
        };
      }

      if (schema === QualityResultSchema) {
        return {
          pass: true,
          issues: [],
          revisedText: null,
        };
      }

      throw new Error(`Unexpected schema in test mock`);
    });

    const result = await runAutonomousCycle(agentId);

    // Verify stats
    expect(result.candidatesFound).toBe(3); // Stories A, B, E (C is non-move, D is duplicate)
    expect(result.published).toBe(1); // Story A published
    expect(result.watched).toBe(1); // Story B watched
    expect(result.rejected).toBe(1); // Story E rejected
    expect(result.errors).toBe(0);

    expect(runsDb.completeRun).toHaveBeenCalledWith('run-1', expect.objectContaining({
      candidates_found: 3,
      published: 1,
      watched: 1,
      rejected: 1,
    }));

    expect(breethMemory.storeCompetitiveMove).toHaveBeenCalled();
    expect(breethMemory.storePheonixzJudgment).toHaveBeenCalled();
  });
});
