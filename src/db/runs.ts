import { db } from './client';

export interface RunRow {
  id: string;
  agent_id: string;
  started_at: string;
  finished_at: string | null;
  status: 'running' | 'completed' | 'failed';
  candidates_found: number;
  published: number;
  watched: number;
  rejected: number;
  error: string | null;
  created_at: string;
}

export async function createRun(agentId: string): Promise<RunRow> {
  const { data, error } = await db
    .from('runs')
    .insert({ agent_id: agentId, status: 'running' })
    .select()
    .single();

  if (error) throw new Error(`createRun: ${error.message}`);
  return data;
}

export async function completeRun(
  id: string,
  stats: { candidates_found: number; published: number; watched: number; rejected: number }
): Promise<void> {
  const { error } = await db
    .from('runs')
    .update({
      status: 'completed',
      finished_at: new Date().toISOString(),
      ...stats,
    })
    .eq('id', id);

  if (error) throw new Error(`completeRun: ${error.message}`);
}

export async function failRun(id: string, errorMessage: string): Promise<void> {
  const { error } = await db
    .from('runs')
    .update({
      status: 'failed',
      finished_at: new Date().toISOString(),
      error: errorMessage,
    })
    .eq('id', id);

  if (error) throw new Error(`failRun: ${error.message}`);
}

export async function getRunsByAgent(agentId: string, limit = 20): Promise<RunRow[]> {
  const { data, error } = await db
    .from('runs')
    .select()
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getRunsByAgent: ${error.message}`);
  return data ?? [];
}
