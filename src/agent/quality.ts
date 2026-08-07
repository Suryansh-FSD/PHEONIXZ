import { withFallback } from '@/ai/withFallback';
import { QUALITY_SYSTEM_PROMPT } from '@/prompts/quality';
import { QualityResultSchema, type QualityResult } from '@/schemas/quality';
import type { WriterOutput } from '@/schemas/post';
import type { CandidateRow } from '@/db/candidates';

/**
 * Run the 9-point quality gate on a drafted post.
 * Returns QualityResult — pass/fail with issues and optional revision.
 */
export async function qualityCheck(
  writerOutput: WriterOutput,
  candidate: CandidateRow,
  recentPostTexts: string[]
): Promise<QualityResult> {
  // Pre-check: ensure no section is empty (before even calling AI)
  const sections = [writerOutput.move, writerOutput.angle, writerOutput.pressure, writerOutput.take];
  const emptySections = sections.filter((s) => !s || s.trim().length < 20);
  if (emptySections.length > 0) {
    return {
      pass: false,
      issues: [`${emptySections.length} section(s) are too short or empty`],
      revisedText: null,
    };
  }

  const postText = [
    `THE MOVE\n${writerOutput.move}`,
    `THE ANGLE\n${writerOutput.angle}`,
    `THE PRESSURE\n${writerOutput.pressure}`,
    `PHEONIXZ'S TAKE\n${writerOutput.take}`,
  ].join('\n\n');

  const recentPostsSummary =
    recentPostTexts.length === 0
      ? 'No recent posts.'
      : recentPostTexts.map((t, i) => `[Recent Post ${i + 1}]:\n${t.slice(0, 300)}`).join('\n\n');

  const userPrompt = `
DRAFTED POST:
${postText}

ORIGINAL CANDIDATE EVIDENCE:
Company: ${candidate.company}
Move Type: ${candidate.move_type}
Title: ${candidate.title}
Summary: ${candidate.summary}
URL: ${candidate.url}

RECENT POSTS (for duplicate detection):
${recentPostsSummary}

Apply the nine-point quality checklist and return your assessment.
`.trim();

  return withFallback(QUALITY_SYSTEM_PROMPT, userPrompt, QualityResultSchema, { temperature: 0.1 });
}
