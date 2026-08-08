import { NextResponse } from 'next/server';
import { getSourceStatuses } from '@/db/sourceStatus';

export async function GET() {
  try {
    const sources = await getSourceStatuses();

    const formatted = sources.map((s) => ({
      id: s.id,
      name: s.source,
      status: s.status,
      lastSuccess: s.last_success,
      lastFailure: s.last_failure,
      consecutiveFailures: s.consecutive_failures,
      updatedAt: s.updated_at,
    }));

    return NextResponse.json({ sources: formatted }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch source statuses';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
