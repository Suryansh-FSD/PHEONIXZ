import { z } from 'zod';

export const CycleResultSchema = z.object({
  candidatesFound: z.number().int().min(0),
  published:       z.number().int().min(0),
  watched:         z.number().int().min(0),
  rejected:        z.number().int().min(0),
  errors:          z.number().int().min(0),
});

export type CycleResult = z.infer<typeof CycleResultSchema>;
