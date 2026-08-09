import { db } from './client';

export interface DecisionRow {
  id: string;
  candidate_id: string;
  agent_id: string;
  market_pressure: number;
  strategic_signal: number;
  evidence_quality: number;
  timeliness: number;
  persona_fit: number;
  pattern_continuity: number;
  score: number;
  decision: 'publish' | 'watch' | 'reject';
  reason: string;
  scored_breakdown_json: Record<string, unknown>;
  created_at: string;
}

export async function insertDecision(
  data: Omit<DecisionRow, 'id' | 'created_at'>
): Promise<DecisionRow> {
  const { data: decision, error } = await db
    .from('decisions')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(`insertDecision: ${error.message}`);
  return decision;
}

export async function getDecisionsByAgent(agentId: string, limit = 50): Promise<DecisionRow[]> {
  const { data, error } = await db
    .from('decisions')
    .select()
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getDecisionsByAgent: ${error.message}`);

  if (data && data.length === 0 && agentId) {
    const { data: fallbackData } = await db
      .from('decisions')
      .select()
      .order('created_at', { ascending: false })
      .limit(limit);
    return fallbackData ?? [];
  }

  return data ?? [];
}

export async function getRecentDecisions(agentId: string, hours = 48): Promise<DecisionRow[]> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await db
    .from('decisions')
    .select()
    .eq('agent_id', agentId)
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getRecentDecisions: ${error.message}`);

  if (data && data.length === 0 && agentId) {
    const { data: fallbackData } = await db
      .from('decisions')
      .select()
      .gte('created_at', since)
      .order('created_at', { ascending: false });
    return fallbackData ?? [];
  }

  return data ?? [];
}
