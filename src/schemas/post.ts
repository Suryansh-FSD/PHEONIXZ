import { z } from 'zod';

// AI Call 3 output — Writer
export const WriterOutputSchema = z.object({
  move:     z.string().min(20),
  angle:    z.string().min(20),
  pressure: z.string().min(20),
  take:     z.string().min(20),
});

export type WriterOutput = z.infer<typeof WriterOutputSchema>;
