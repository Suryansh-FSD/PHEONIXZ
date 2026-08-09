import type { MemoryRecord, MemoryResult, MemoryContext, CompetitiveThread, MemoryCategory } from '@/schemas/memory';
import type { CandidateRow } from '@/db/candidates';
import type { ScoredDecision } from '@/schemas/decision';
import type { PostRow } from '@/db/posts';
import { db } from '@/db/client';

const BREETH_BASE_URL = process.env.BREETH_BASE_URL ?? 'https://mcp.thebreeth.com';
const MAX_MEMORY_RESULTS = 5;

// ── Breeth HTTP client ──────────────────────────────────────────────────────

function breethHeaders() {
  const apiKey = process.env.BREETH_API_KEY;
  const projectId = process.env.BREETH_PROJECT_ID;

  if (!apiKey || !projectId) {
    return null; // Graceful — memory is optional
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'X-Project-Id': projectId,
  };
}

export async function breethRetrieve(
  query: string,
  category?: MemoryCategory,
  limit = MAX_MEMORY_RESULTS
): Promise<MemoryResult[]> {
  const headers = breethHeaders();
  if (!headers) {
    console.warn('[breeth] Not configured — skipping memory retrieval');
    return [];
  }

  try {
    const response = await fetch(`${BREETH_BASE_URL}/v1/memory/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, category, limit }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.warn(`[breeth] Retrieve failed: HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.results ?? data.memories ?? []) as MemoryResult[];
  } catch (err) {
    console.warn('[breeth] Retrieve error (non-fatal):', err);
    return [];
  }
}

export async function breethStore(memory: MemoryRecord): Promise<void> {
  const headers = breethHeaders();
  if (!headers) {
    console.warn('[breeth] Not configured — skipping memory store');
    return;
  }

  try {
    const response = await fetch(`${BREETH_BASE_URL}/v1/memory`, {
      method: 'POST',
      headers,
      body: JSON.stringify(memory),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.warn(`[breeth] Store failed: HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn('[breeth] Store error (non-fatal):', err);
  }
}

/**
 * Fallback to query Supabase structured memory when Breeth returns empty results or is unconfigured.
 */
export async function memoryFallbackFromSupabase(candidate: CandidateRow): Promise<MemoryResult[]> {
  try {
    const { data: posts, error } = await db
      .from('posts')
      .select('id, text, take_text, created_at, agent_id')
      .eq('agent_id', candidate.agent_id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error || !posts || posts.length === 0) return [];

    const companyLower = candidate.company.toLowerCase();
    const matching = posts.filter(
      (p) =>
        p.text.toLowerCase().includes(companyLower) ||
        p.take_text.toLowerCase().includes(companyLower)
    );

    const listToUse = matching.length > 0 ? matching : posts.slice(0, 3);

    return listToUse.map((p) => ({
      id: p.id,
      category: 'pheonixz_judgment' as const,
      content: `Historical publication (${p.created_at.slice(0, 10)}): ${p.take_text || p.text.slice(0, 150)}`,
      tags: [candidate.company, candidate.move_type, 'supabase_fallback', p.agent_id],
      metadata: { postId: p.id, agentId: p.agent_id, date: p.created_at },
    }));
  } catch (err) {
    console.warn('[breeth] Supabase memory fallback error (non-fatal):', err);
    return [];
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Retrieve relevant competitive memory for a candidate.
 * Queries Breeth semantic memory first; falls back to Supabase structured memory.
 */
export async function retrieveMemory(candidate: CandidateRow): Promise<MemoryContext> {
  const query = `${candidate.company} ${candidate.move_type} competitive`;

  let results = await breethRetrieve(query, undefined, MAX_MEMORY_RESULTS);

  // Agent isolation filter if agentId present in metadata
  if (results.length > 0 && candidate.agent_id) {
    results = results.filter(
      (r) => !r.metadata?.agentId || r.metadata?.agentId === candidate.agent_id
    );
  }

  // Fallback to Supabase structured memory if Breeth returns no results
  if (results.length === 0) {
    results = await memoryFallbackFromSupabase(candidate);
  }

  const formattedContext =
    results.length === 0
      ? 'No relevant memory found.'
      : results
          .map((r, i) => `[Memory ${i + 1}] (${r.category}): ${r.content}`)
          .join('\n\n');

  return { relevant: results, formattedContext };
}

/**
 * Store a competitive move after scoring.
 * Called for publish decisions and high-scoring rejections (score > 60).
 */
export async function storeCompetitiveMove(
  candidate: CandidateRow,
  decision: ScoredDecision
): Promise<void> {
  await breethStore({
    category: 'competitive_move',
    content: `${candidate.company} made a ${candidate.move_type} move: "${candidate.title}". Score: ${decision.computedTotal}/100. Decision: ${decision.decision}. ${decision.reason}`,
    tags: [candidate.company, candidate.move_type, 'pheonixz_judgment', candidate.agent_id],
    metadata: {
      candidateId: candidate.id,
      agentId: candidate.agent_id,
      score: decision.computedTotal,
      decision: decision.decision,
      date: candidate.discovered_at,
    },
  });
}

/**
 * Store PheonixZ's editorial judgment after publication.
 */
export async function storePheonixzJudgment(
  post: PostRow,
  candidate: CandidateRow,
  decision: ScoredDecision
): Promise<void> {
  await breethStore({
    category: 'pheonixz_judgment',
    content: `PheonixZ published on ${candidate.company}: "${candidate.title}". Take: ${post.take_text}`,
    tags: [candidate.company, candidate.move_type, 'published', post.agent_id],
    metadata: {
      postId: post.id,
      agentId: post.agent_id,
      score: decision.computedTotal,
      date: post.created_at,
    },
  });
}

/**
 * Find existing competitive thread for a company.
 * Returns null if Breeth is unavailable or no thread exists.
 */
export async function findCompetitiveThread(company: string): Promise<CompetitiveThread | null> {
  const results = await breethRetrieve(
    `${company} competitive thread pattern`,
    'competitive_thread',
    3
  );

  if (results.length === 0) return null;

  return {
    company,
    moves: results.map((r) => ({
      date: (r.metadata as Record<string, string>)?.date ?? 'unknown',
      moveType: (r.metadata as Record<string, string>)?.moveType ?? 'unknown',
      title: r.content.slice(0, 100),
      decision: (r.metadata as Record<string, string>)?.decision ?? 'unknown',
    })),
    pattern: results[0]?.content,
  };
}
