import { NextRequest, NextResponse } from 'next/server';
import { runAutonomousCycle } from '@/agent/cycle';

// Vercel timeout — set to max allowed for plan
// Hobby: 60s, Pro: 300s. Set env var MAX_DURATION to override.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // ── Auth: CRON_SECRET ──────────────────────────────────────
  const incomingSecret = req.headers.get('x-cron-secret');
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    console.error('[/api/internal/cycle] CRON_SECRET is not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (!incomingSecret || incomingSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ─────────────────────────────────────────────
  let agentId: string;
  try {
    const body = await req.json();
    agentId = body?.agentId;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!agentId || typeof agentId !== 'string') {
    return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
  }

  // ── Run cycle ──────────────────────────────────────────────
  try {
    const result = await runAutonomousCycle(agentId);
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/internal/cycle] Cycle failed:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
