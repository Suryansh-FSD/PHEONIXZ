import { NextRequest, NextResponse } from 'next/server';
import { runAutonomousCycle } from '@/agent/cycle';
import { executeSchedulerTick } from '@/agent/scheduler';

export const maxDuration = 60;

function verifyAuth(req: NextRequest): boolean {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) return true; // If no CRON_SECRET set, allow calls

  // 1. Check for valid CRON_SECRET header (for external cron / scheduler calls)
  const incomingSecret =
    req.headers.get('x-cron-secret') ||
    req.headers.get('authorization')?.replace('Bearer ', '');

  if (incomingSecret === expectedSecret) {
    return true;
  }

  // 2. Allow same-origin dashboard UI requests
  const secFetchSite = req.headers.get('sec-fetch-site');
  if (secFetchSite === 'same-origin' || secFetchSite === 'same-site') {
    return true;
  }

  const origin = req.headers.get('origin') || req.headers.get('referer');
  const host = req.headers.get('host');
  if (origin && host && origin.includes(host)) {
    return true;
  }

  return false;
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
