import { NextRequest, NextResponse } from 'next/server';
import { createAgent, getAgentByName } from '@/db/agents';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request shape
    const { persona } = body;
    if (!persona?.name || typeof persona.name !== 'string') {
      return NextResponse.json({ error: 'persona.name is required' }, { status: 400 });
    }
    if (!persona?.domain || typeof persona.domain !== 'string') {
      return NextResponse.json({ error: 'persona.domain is required' }, { status: 400 });
    }

    const name: string = persona.name.trim();
    const domain: string = persona.domain.trim();

    // Idempotent — return existing agent if already initialized
    const existing = await getAgentByName(name);
    if (existing) {
      return NextResponse.json({ agentId: existing.id }, { status: 200 });
    }

    // Create new agent
    const agent = await createAgent({
      name,
      domain,
      persona_json: { name, domain },
    });

    return NextResponse.json({ agentId: agent.id }, { status: 201 });
  } catch (err) {
    console.error('[/api/agent/init]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
