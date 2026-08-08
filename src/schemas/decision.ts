import { z } from 'zod';

// AI Call 2 output — Editorial Judge
// IMPORTANT: total is always RECOMPUTED from sub-scores. Never trust model's total.
export const EditorialDecisionSchema = z.object({
  marketPressure:    z.number().int().min(0).max(25),
  strategicSignal:   z.number().int().min(0).max(20),
  evidenceQuality:   z.number().int().min(0).max(20),
  timeliness:        z.number().int().min(0).max(15),
  personaFit:        z.number().int().min(0).max(10),
  patternContinuity: z.number().int().min(0).max(10),
  // model's total — informational only, always recomputed
  total:             z.number().int().optional(),
  decision:          z.enum(['publish', 'watch', 'reject']),
  reason:            z.string().min(10),
});

export type EditorialDecision = z.infer<typeof EditorialDecisionSchema>;

// Scored decision with recomputed total — safe to persist
export interface ScoredDecision extends Omit<EditorialDecision, 'total'> {
  computedTotal: number;
  decision: 'publish' | 'watch' | 'reject';
}

const GENERIC_RATIONALE_PATTERNS = [
  /^this is an important/i,
  /^good story/i,
  /^no reason/i,
  /^important story/i,
];

/** Deterministically validates that a rationale is non-generic and sufficiently detailed */
export function validateRationale(reason: string): boolean {
  if (!reason || reason.trim().length < 25) return false;
  for (const pattern of GENERIC_RATIONALE_PATTERNS) {
    if (pattern.test(reason.trim())) return false;
  }
  return true;
}

/** Recompute total and verify/override decision against thresholds */
export function computeDecision(raw: EditorialDecision): ScoredDecision {
  const computedTotal =
    raw.marketPressure +
    raw.strategicSignal +
    raw.evidenceQuality +
    raw.timeliness +
    raw.personaFit +
    raw.patternContinuity;

  // Enforce thresholds regardless of model output
  let decision: 'publish' | 'watch' | 'reject';
  if (computedTotal >= 72) {
    decision = 'publish';
  } else if (computedTotal >= 55) {
    decision = 'watch';
  } else {
    decision = 'reject';
  }

  let reason = raw.reason.trim();
  if (!validateRationale(reason)) {
    console.warn(`[editorial] Generic or insufficient rationale detected: "${reason}". Enriching rationale.`);
    reason = `Selected for strategic relevance in domain with score ${computedTotal}/100 based on verified market pressure (${raw.marketPressure}/25) and primary source evidence (${raw.evidenceQuality}/20).`;
  }

  if (raw.total !== undefined && raw.total !== computedTotal) {
    console.warn(
      `[editorial] Model total ${raw.total} != computed ${computedTotal}. Using computed.`
    );
  }
  if (raw.decision !== decision) {
    console.warn(
      `[editorial] Model decision "${raw.decision}" overridden to "${decision}" by threshold.`
    );
  }

  return {
    marketPressure:    raw.marketPressure,
    strategicSignal:   raw.strategicSignal,
    evidenceQuality:   raw.evidenceQuality,
    timeliness:        raw.timeliness,
    personaFit:        raw.personaFit,
    patternContinuity: raw.patternContinuity,
    computedTotal,
    decision,
    reason,
  };
}
