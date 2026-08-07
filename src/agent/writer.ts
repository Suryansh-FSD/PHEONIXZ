import { withFallback } from '@/ai/withFallback';
import { WRITER_SYSTEM_PROMPT } from '@/prompts/writer';
import { WriterOutputSchema, type WriterOutput } from '@/schemas/post';
import type { CandidateRow } from '@/db/candidates';
import type { ScoredDecision } from '@/schemas/decision';
import type { MemoryContext } from '@/schemas/memory';

/**
 * Generate a structured 4-section post for a publish-approved candidate.
 */
export async function generatePost(
  candidate: CandidateRow,
  decision: ScoredDecision,
  memoryContext: MemoryContext
): Promise<WriterOutput> {
  const userPrompt = `
Write a PheonixZ analysis for the following product move.

COMPANY: ${candidate.company}
MOVE TYPE: ${candidate.move_type}
TITLE: ${candidate.title}
SUMMARY: ${candidate.summary}
SOURCE URL: ${candidate.url}

EDITORIAL DECISION:
Score: ${decision.computedTotal}/100
Market Pressure: ${decision.marketPressure}/25
Strategic Signal: ${decision.strategicSignal}/20
Reason: ${decision.reason}

MEMORY CONTEXT (use to inform THE TAKE and pattern analysis):
${memoryContext.formattedContext}

Write the four sections: THE MOVE, THE ANGLE, THE PRESSURE, PHEONIXZ'S TAKE.
Remember: analytical, understated, no hype language. Name specific competitors in THE PRESSURE.
`.trim();

  return withFallback(WRITER_SYSTEM_PROMPT, userPrompt, WriterOutputSchema, { temperature: 0.3 });
}

/**
 * Assemble the full post text from the 4 sections.
 */
export function assemblePostText(output: WriterOutput): string {
  return [
    `THE MOVE\n${output.move}`,
    `THE ANGLE\n${output.angle}`,
    `THE PRESSURE\n${output.pressure}`,
    `PHEONIXZ'S TAKE\n${output.take}`,
  ].join('\n\n');
}
