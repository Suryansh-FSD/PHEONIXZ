import { db } from './client';

export interface PostRow {
  id: string;
  agent_id: string;
  related_candidate_id: string | null;
  move_text: string;
  angle_text: string;
  pressure_text: string;
  take_text: string;
  text: string;
  rationale: string;
  sources: string[];
  created_at: string;
}

export async function insertPost(
  data: Omit<PostRow, 'id' | 'created_at'>
): Promise<PostRow> {
  const { data: post, error } = await db
    .from('posts')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(`insertPost: ${error.message}`);
  return post;
}

export async function getPostsByAgent(agentId: string, limit = 50): Promise<PostRow[]> {
  const { data, error } = await db
    .from('posts')
    .select()
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getPostsByAgent: ${error.message}`);
  return data ?? [];
}

export async function getLastPublishedAt(agentId: string): Promise<Date | null> {
  const { data, error } = await db
    .from('posts')
    .select('created_at')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`getLastPublishedAt: ${error.message}`);
  return data ? new Date(data.created_at) : null;
}

export async function getRecentPostTexts(agentId: string, limit = 5): Promise<string[]> {
  const { data, error } = await db
    .from('posts')
    .select('text')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getRecentPostTexts: ${error.message}`);
  return (data ?? []).map((p) => p.text);
}
