import { z } from 'zod';

// AI Call 4 output — Quality Checker
export const QualityResultSchema = z.object({
  pass:        z.boolean(),
  issues:      z.array(z.string()),
  revisedText: z.string().nullable(),
});

export type QualityResult = z.infer<typeof QualityResultSchema>;
