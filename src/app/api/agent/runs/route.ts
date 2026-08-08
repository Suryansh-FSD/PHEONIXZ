import { NextRequest, NextResponse } from 'next/server';
import { getRunsByAgent } from '@/db/runs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json({ error: 'agentId query param is required' }, { status: 400 });
    }

    const runs = await getRunsByAgent(agentId, 20);

    const formatted = runs.map((r) => ({
      id: r.id,
      startedAt: r.started_at,
      finishedAt: r.finished_at,
      status: r.status,
      candidatesFound: r.candidates_found,
      published: r.published,
      watched: r.watched,
      rejected: r.rejected,
      error: r.error,
    }));

    return NextResponse.json({ runs: formatted }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch runs';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
