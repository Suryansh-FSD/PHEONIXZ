import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createAgent, getAgentByName } from '@/db/agents';
import { runAutonomousCycle } from '@/agent/cycle';

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

    // Idempotent — return existing agent if already initialized (public read-safe)
    const existing = await getAgentByName(name);
    if (existing) {
      // Schedule a background cycle for the existing agent too,
      // so the evaluator always gets fresh content after init.
      after(async () => {
        try {
          console.log(`[init/after] Triggering autonomous cycle for existing agent ${existing.id}`);
          const result = await runAutonomousCycle(existing.id);
          console.log(`[init/after] Cycle complete:`, result);
        } catch (err) {
          console.error(`[init/after] Cycle error:`, err);
        }
      });

      return NextResponse.json({ agentId: existing.id }, { status: 200 });
    }

    // Create new agent — evaluator calls this publicly, no auth gate
    const agent = await createAgent({
      name,
      domain,
      persona_json: { name, domain },
    });

    // Schedule the first autonomous cycle AFTER the response is sent.
    // This uses Next.js `after()` which runs the callback after the HTTP
    // response has been flushed — the evaluator receives { agentId } immediately,
    // while the cycle runs in the background.
    after(async () => {
      try {
        console.log(`[init/after] Triggering first autonomous cycle for agent ${agent.id}`);
        const result = await runAutonomousCycle(agent.id);
        console.log(`[init/after] First cycle complete:`, result);
      } catch (err) {
        console.error(`[init/after] First cycle error:`, err);
      }
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
