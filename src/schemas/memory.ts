import { z } from 'zod';

export const MemoryCategorySchema = z.enum([
  'competitive_move',
  'competitive_response',
  'strategic_pattern',
  'vantage_judgment',
  'competitive_thread',
]);

export type MemoryCategory = z.infer<typeof MemoryCategorySchema>;

export interface MemoryRecord {
  category: MemoryCategory;
  content: string;
  tags: string[];
  metadata?: Record<string, unknown>;
}

export interface MemoryResult {
  id: string;
  category: MemoryCategory;
  content: string;
  tags: string[];
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface CompetitiveThread {
  company: string;
  moves: Array<{
    date: string;
    moveType: string;
    title: string;
    decision: string;
  }>;
  pattern?: string;
}

export interface MemoryContext {
  relevant: MemoryResult[];
  formattedContext: string;
}
