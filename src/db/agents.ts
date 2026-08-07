import { db } from './client';

export interface AgentRow {
  id: string;
  name: string;
  domain: string;
  persona_json: Record<string, unknown>;
  active: boolean;
  created_at: string;
}

export async function createAgent(data: {
  name: string;
  domain: string;
  persona_json?: Record<string, unknown>;
}): Promise<AgentRow> {
  const { data: agent, error } = await db
    .from('agents')
    .insert({
      name: data.name,
      domain: data.domain,
      persona_json: data.persona_json ?? {},
      active: true,
    })
    .select()
    .single();

  if (error) throw new Error(`createAgent: ${error.message}`);
  return agent;
}

export async function getAgentByName(name: string): Promise<AgentRow | null> {
  const { data, error } = await db
    .from('agents')
    .select()
    .eq('name', name)
    .eq('active', true)
    .maybeSingle();

  if (error) throw new Error(`getAgentByName: ${error.message}`);
  return data;
}

export async function getAgentById(id: string): Promise<AgentRow | null> {
  const { data, error } = await db
    .from('agents')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`getAgentById: ${error.message}`);
  return data;
}
