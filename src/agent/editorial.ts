import { withFallback } from '@/ai/withFallback';
import { EDITORIAL_SYSTEM_PROMPT } from '@/prompts/editorial';
import { EditorialDecisionSchema, computeDecision, type ScoredDecision } from '@/schemas/decision';
import type { CandidateRow } from '@/db/candidates';
import type { DecisionRow } from '@/db/decisions';
import type { MemoryContext } from '@/schemas/memory';

interface EditorialContext {
  recentDecisions: DecisionRow[];
  memoryContext: MemoryContext;
}

/**
 * Score a candidate through the 6-dimension editorial rubric.
 * Returns a ScoredDecision with a recomputed total — never trusts model's total.
 */
export async function scoreCandidate(
  candidate: CandidateRow,
  context: EditorialContext
): Promise<ScoredDecision> {
  const recentDecisionsSummary = context.recentDecisions
    .slice(0, 10)
    .map((d) => `- ${d.decision.toUpperCase()} (score: ${d.score}): ${d.reason}`)
    .join('\n');

  const userPrompt = `
CANDIDATE TO SCORE:
Company: ${candidate.company}
Move Type: ${candidate.move_type}
Title: ${candidate.title}
Summary: ${candidate.summary}
Source URL: ${candidate.url}
Discovered: ${candidate.discovered_at}

RECENT DECISIONS (context):
${recentDecisionsSummary || 'No recent decisions yet.'}

MEMORY CONTEXT:
${context.memoryContext.formattedContext || 'No relevant memory found.'}

Score this candidate according to the editorial rubric.
`.trim();

  const rawResult = await withFallback(
    EDITORIAL_SYSTEM_PROMPT,
    userPrompt,
    EditorialDecisionSchema,
    { temperature: 0.1 }
  );

  // Always recompute — never trust model's total
  return computeDecision(rawResult);
}
