import { NextRequest, NextResponse } from 'next/server';
import { getPostsByAgent } from '@/db/posts';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
    }

    // Basic UUID format check
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(agentId)) {
      return NextResponse.json({ error: 'agentId must be a valid UUID' }, { status: 400 });
    }

    const posts = await getPostsByAgent(agentId, 50);

    // Map to public shape — stable, never mutates after creation
    const publicPosts = posts.map((p) => ({
      id: p.id,
      createdAt: p.created_at,
      move: p.move_text,
      angle: p.angle_text,
      pressure: p.pressure_text,
      take: p.take_text,
      text: p.text,
      rationale: p.rationale,
      sources: p.sources,
    }));

    // Empty feed returns [] — never 404
    return NextResponse.json({ posts: publicPosts }, { status: 200 });
  } catch (err) {
    console.error('[/api/agent/feed]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
