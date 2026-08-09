import { NextRequest, NextResponse } from 'next/server';
import { executeSearchIntelligence } from '@/agent/searchEngine';

export async function POST(req: NextRequest) {
  let query: string | undefined;

  try {
    const body = await req.json();
    query = body?.query;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON request body' },
      { status: 400 }
    );
  }

  if (!query || typeof query !== 'string' || !query.trim()) {
    return NextResponse.json(
      { success: false, error: 'Search query is required and cannot be empty' },
      { status: 400 }
    );
  }

  try {
    const result = await executeSearchIntelligence(query.trim());
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown search error';
    console.error('[/api/agent/search] Error executing search:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
