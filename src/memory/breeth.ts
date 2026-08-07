import type { MemoryRecord, MemoryResult, MemoryContext, CompetitiveThread, MemoryCategory } from '@/schemas/memory';
import type { CandidateRow } from '@/db/candidates';
import type { ScoredDecision } from '@/schemas/decision';
import type { PostRow } from '@/db/posts';

const BREETH_BASE_URL = 'https://api.breeth.ai'; // Update when credentials confirmed
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

async function breethRetrieve(
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

async function breethStore(memory: MemoryRecord): Promise<void> {
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

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Retrieve relevant competitive memory for a candidate.
 * Returns empty context gracefully if Breeth is unavailable.
 */
export async function retrieveMemory(candidate: CandidateRow): Promise<MemoryContext> {
  const query = `${candidate.company} ${candidate.move_type} competitive`;

  const results = await breethRetrieve(query, undefined, MAX_MEMORY_RESULTS);

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
    tags: [candidate.company, candidate.move_type, 'pheonixz_judgment'],
    metadata: {
      candidateId: candidate.id,
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
    tags: [candidate.company, candidate.move_type, 'published'],
    metadata: {
      postId: post.id,
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
