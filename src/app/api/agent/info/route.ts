import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/db/agents';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json({ error: 'agentId query param is required' }, { status: 400 });
    }

    const agent = await getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
        domain: agent.domain,
        persona: agent.persona_json,
        active: agent.active,
        createdAt: agent.created_at,
      },
    }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch agent info';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
