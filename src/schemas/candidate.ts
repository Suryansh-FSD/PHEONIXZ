import { z } from 'zod';

// AI Call 1 output — Discovery Normalizer
export const NormalizedCandidateSchema = z.object({
  isProductMove: z.boolean(),
  company: z.string().min(1),
  moveType: z.enum(['launch', 'pricing', 'feature_parity', 'partnership', 'dx_change']),
  title: z.string().min(5),
  summary: z.string().min(10),
  claims: z.array(z.string()),
  evidenceQuality: z.number().int().min(0).max(20),
});

export type NormalizedCandidate = z.infer<typeof NormalizedCandidateSchema>;
