import { NextRequest, NextResponse } from 'next/server';
import { runAutonomousCycle } from '@/agent/cycle';
import { executeSchedulerTick } from '@/agent/scheduler';

export const maxDuration = 60;

function verifyAuth(req: NextRequest): boolean {
  const incomingSecret = req.headers.get('x-cron-secret') || req.headers.get('authorization')?.replace('Bearer ', '');
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) return true; // If no CRON_SECRET set, allow internal calls
  return incomingSecret === expectedSecret;
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let agentId: string | undefined;
  try {
    const body = await req.json();
    agentId = body?.agentId;
  } catch {
    // Empty body is acceptable for cron invocations
  }

  if (agentId && typeof agentId === 'string') {
    try {
      const result = await runAutonomousCycle(agentId);
      return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[/api/internal/cycle] Cycle failed for agent:', message);
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  // If no agentId specified, run tick across all active agents
  try {
    await executeSchedulerTick();
    return NextResponse.json({ success: true, message: 'Tick executed for all active agents' }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
