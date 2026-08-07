import { describe, it, expect } from 'vitest';
import { computeDecision } from '@/schemas/decision';
import { generateContentHash } from '@/lib/hash';
import { clusterAndDeduplicate, type RawItem } from '@/agent/clustering';
import {
  NormalizedCandidateSchema,
  WriterOutputSchema,
  QualityResultSchema,
  CycleResultSchema,
} from '@/schemas';

describe('Pure Logic Tests', () => {
  describe('A. Editorial Score Calculation & Threshold Boundaries', () => {
    it('sums sub-scores correctly to 100 max', () => {
      const result = computeDecision({
        marketPressure: 25,
        strategicSignal: 20,
        evidenceQuality: 20,
        timeliness: 15,
        personaFit: 10,
        patternContinuity: 10,
        decision: 'publish',
        reason: 'Maximum score test across all dimensions',
      });

      expect(result.computedTotal).toBe(100);
      expect(result.decision).toBe('publish');
    });

    it('enforces boundary threshold: 54 -> REJECT', () => {
      const result = computeDecision({
        marketPressure: 14,
        strategicSignal: 10,
        evidenceQuality: 15,
        timeliness: 10,
        personaFit: 5,
        patternContinuity: 0,
        decision: 'publish', // Model claims publish, recomputation must override
        reason: 'Score is 54, below watch threshold',
      });

      expect(result.computedTotal).toBe(54);
      expect(result.decision).toBe('reject');
    });

    it('enforces boundary threshold: 55 -> WATCH', () => {
      const result = computeDecision({
        marketPressure: 15,
        strategicSignal: 10,
        evidenceQuality: 15,
        timeliness: 10,
        personaFit: 5,
        patternContinuity: 0,
        decision: 'reject', // Model claims reject, threshold overrides to watch
        reason: 'Score is exactly 55',
      });

      expect(result.computedTotal).toBe(55);
      expect(result.decision).toBe('watch');
    });

    it('enforces boundary threshold: 71 -> WATCH', () => {
      const result = computeDecision({
        marketPressure: 20,
        strategicSignal: 15,
        evidenceQuality: 16,
        timeliness: 10,
        personaFit: 5,
        patternContinuity: 5,
        decision: 'publish', // Model claims publish, threshold overrides to watch
        reason: 'Score is 71, just under publish threshold',
      });

      expect(result.computedTotal).toBe(71);
      expect(result.decision).toBe('watch');
    });

    it('enforces boundary threshold: 72 -> PUBLISH', () => {
      const result = computeDecision({
        marketPressure: 20,
        strategicSignal: 15,
        evidenceQuality: 17,
        timeliness: 10,
        personaFit: 5,
        patternContinuity: 5,
        decision: 'watch', // Model claims watch, threshold overrides to publish
        reason: 'Score is 72, at publish threshold',
      });

      expect(result.computedTotal).toBe(72);
      expect(result.decision).toBe('publish');
    });

    it('recomputes total and ignores model-generated hallucinated total', () => {
      const result = computeDecision({
        marketPressure: 10,
        strategicSignal: 10,
        evidenceQuality: 10,
        timeliness: 10,
        personaFit: 5,
        patternContinuity: 5,
        total: 99, // Hallucinated model total
        decision: 'publish',
        reason: 'Hallucinated total mismatch test',
      });

      expect(result.computedTotal).toBe(50);
      expect(result.decision).toBe('reject');
    });
  });

  describe('C. Content Hash & Deduplication', () => {
    it('produces identical hash for identical source/company and title', () => {
      const hash1 = generateContentHash('Company Alpha', 'API Price Cut Announced');
      const hash2 = generateContentHash('company alpha  ', 'api price cut announced');

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 hex string
    });

    it('produces different hash for meaningfully different content', () => {
      const hash1 = generateContentHash('Company Alpha', 'API Price Cut Announced');
      const hash2 = generateContentHash('Company Alpha', 'New SDK Released');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('D. Clustering', () => {
    it('clusters near-duplicate stories covering the same event from different sources', () => {
      const items: RawItem[] = [
        {
          title: 'Company Alpha Slashes Developer API Prices by 50 Percent',
          body: 'Company Alpha announced major price cuts today.',
          url: 'https://source1.com/story1',
          publishedAt: '2026-08-07T10:00:00Z',
          source: 'source1',
          sourceId: '1',
        },
        {
          title: 'Company Alpha Slashes Developer API Prices by 50 Percent in Major Move',
          body: 'Company Alpha announced major price cuts for developers.',
          url: 'https://source2.com/story2',
          publishedAt: '2026-08-07T11:00:00Z',
          source: 'source2',
          sourceId: '2',
        },
        {
          title: 'Unrelated News: Company Gamma Hires New Chief Technology Officer',
          body: 'Company Gamma announced leadership expansion.',
          url: 'https://source3.com/story3',
          publishedAt: '2026-08-07T09:00:00Z',
          source: 'source3',
          sourceId: '3',
        },
      ];

      const clustered = clusterAndDeduplicate(items);

      expect(clustered.length).toBe(2); // 2 story clusters
      expect(clustered.find((i) => i.source === 'source2')).toBeDefined(); // Prefers most recent item in cluster
    });
  });

  describe('E. Zod Schemas Validation', () => {
    it('validates candidate schema correctly', () => {
      const validCandidate = {
        isProductMove: true,
        company: 'Alpha',
        moveType: 'pricing',
        title: 'API Price Cut',
        summary: 'Company Alpha reduces API cost by 50% across all tiers.',
        claims: ['50% price reduction', 'Applies to GPT-4 tier'],
        evidenceQuality: 18,
      };

      const parsed = NormalizedCandidateSchema.safeParse(validCandidate);
      expect(parsed.success).toBe(true);

      const invalidCandidate = {
        isProductMove: true,
        company: '',
        moveType: 'invalid_type', // Bad enum
      };

      const invalidParsed = NormalizedCandidateSchema.safeParse(invalidCandidate);
      expect(invalidParsed.success).toBe(false);
    });

    it('validates post writer output schema', () => {
      const validOutput = {
        move: 'Company Alpha reduced API prices by 50 percent today.',
        angle: 'This is a strategic move to capture developer mindshare.',
        pressure: 'Company Beta must respond with lower margins or risk churn.',
        take: 'PheonixZ views this as a price war initiation.',
      };

      expect(WriterOutputSchema.safeParse(validOutput).success).toBe(true);
      expect(WriterOutputSchema.safeParse({ move: 'Too short' }).success).toBe(false);
    });

    it('validates quality check result schema', () => {
      const validQuality = {
        pass: true,
        issues: [],
        revisedText: null,
      };

      expect(QualityResultSchema.safeParse(validQuality).success).toBe(true);
    });

    it('validates cycle result schema', () => {
      const validCycle = {
        candidatesFound: 5,
        published: 1,
        watched: 2,
        rejected: 2,
        errors: 0,
      };

      expect(CycleResultSchema.safeParse(validCycle).success).toBe(true);
    });
  });
});
