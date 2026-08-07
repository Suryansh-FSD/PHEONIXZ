import { db } from './client';

export interface CandidateRow {
  id: string;
  agent_id: string;
  title: string;
  summary: string;
  company: string;
  move_type: string;
  url: string;
  source: string;
  source_id: string;
  discovered_at: string;
  content_hash: string;
  created_at: string;
}

export async function insertCandidate(data: Omit<CandidateRow, 'id' | 'created_at'>): Promise<CandidateRow> {
  const { data: candidate, error } = await db
    .from('candidates')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(`insertCandidate: ${error.message}`);
  return candidate;
}

export async function candidateExistsByHash(hash: string): Promise<boolean> {
  const { count, error } = await db
    .from('candidates')
    .select('id', { count: 'exact', head: true })
    .eq('content_hash', hash);

  if (error) throw new Error(`candidateExistsByHash: ${error.message}`);
  return (count ?? 0) > 0;
}

export async function getCandidatesByAgent(agentId: string, limit = 20): Promise<CandidateRow[]> {
  const { data, error } = await db
    .from('candidates')
    .select()
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getCandidatesByAgent: ${error.message}`);
  return data ?? [];
}

export async function getCandidateById(id: string): Promise<CandidateRow | null> {
  const { data, error } = await db
    .from('candidates')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`getCandidateById: ${error.message}`);
  return data;
}
