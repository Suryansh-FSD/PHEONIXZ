import { createRun, completeRun, failRun } from '@/db/runs';
import { getAgentById } from '@/db/agents';
import { insertCandidate, candidateExistsByHash } from '@/db/candidates';
import { insertDecision, getRecentDecisions } from '@/db/decisions';
import { insertPost, getRecentPostTexts } from '@/db/posts';
import { fetchAndClusterSources } from './discovery';
import { scoreCandidate } from './editorial';
import { isPublishingAllowed } from './rateLimit';
import { generatePost, assemblePostText } from './writer';
import { qualityCheck } from './quality';
import { retrieveMemory, storeCompetitiveMove, storePheonixzJudgment } from '@/memory/breeth';
import { withFallback } from '@/ai/withFallback';
import { DISCOVERY_SYSTEM_PROMPT } from '@/prompts/discovery';
import { NormalizedCandidateSchema } from '@/schemas/candidate';
import { generateContentHash } from '@/lib/hash';
import { withTimeout } from '@/lib/timeout';
import type { CycleResult } from '@/schemas/cycle';
import type { RawItem } from './clustering';

const AI_TIMEOUT_MS = 30_000;
const MAX_CANDIDATES_PER_CYCLE = 3;

// ── Discovery normalization (AI Call 1) ─────────────────────────────────────

async function normalizeRawItem(item: RawItem) {
  const userPrompt = `
Title: ${item.title}
Body: ${item.body.slice(0, 1500)}
URL: ${item.url}
Published: ${item.publishedAt}
Source: ${item.source}
`.trim();

  return withTimeout(
    () => withFallback(DISCOVERY_SYSTEM_PROMPT, userPrompt, NormalizedCandidateSchema, { temperature: 0.1 }),
    AI_TIMEOUT_MS,
    `normalize:${item.source}`
  );
}

// ── Main cycle ──────────────────────────────────────────────────────────────

/**
 * runAutonomousCycle — 16-step pipeline.
 *
 * Step 1:  Create run record
 * Step 2:  Fetch + cluster sources
 * Step 3:  Normalize each item (AI Call 1)
 * Step 4:  Filter product moves
 * Step 5:  Deduplicate by content_hash
 * Step 6:  Store new candidates
 * Step 7:  Retrieve Breeth memory per candidate
 * Step 8:  Score each candidate (AI Call 2)
 * Step 9:  Persist decisions
 * Step 10: Check rate limit
 * Step 11: Generate post (AI Call 3)
 * Step 12: Quality check (AI Call 4)
 * Step 13: Publish to Supabase
 * Step 14: Update Breeth memory
 * Step 15: Record source status (done during fetch)
 * Step 16: Complete run + return result
 */
export async function runAutonomousCycle(agentId: string): Promise<CycleResult> {
  const stats = { candidatesFound: 0, published: 0, watched: 0, rejected: 0, errors: 0 };
  let runId: string | null = null;

  // ── Step 1: Create run ────────────────────────────────────────────────────
  try {
    const agent = await getAgentById(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    const run = await createRun(agentId);
    runId = run.id;
    console.log(`[cycle] Started run ${runId} for agent "${agent.name}"`);
  } catch (err) {
    console.error('[cycle] Failed to initialize run:', err);
    throw err; // Unrecoverable
  }

  try {
    // ── Step 2: Fetch + cluster sources ──────────────────────────────────────
    console.log('[cycle] Step 2: Fetching sources...');
    const { items: rawItems } = await fetchAndClusterSources();
    console.log(`[cycle] ${rawItems.length} clustered items to process`);

    // ── Steps 3–13: Per-candidate pipeline ───────────────────────────────────
    const recentDecisions = await getRecentDecisions(agentId, 48).catch(() => []);
    const recentPostTexts = await getRecentPostTexts(agentId, 5).catch(() => []);
    let processedCandidatesCount = 0;

    for (const rawItem of rawItems) {
      if (processedCandidatesCount >= MAX_CANDIDATES_PER_CYCLE) {
        console.log(`[cycle] Reached MAX_CANDIDATES_PER_CYCLE (${MAX_CANDIDATES_PER_CYCLE}). Deferring remaining ${rawItems.length - processedCandidatesCount} items to subsequent cycles.`);
        break;
      }
      try {
        // ── Step 3: Normalize (AI Call 1) ──────────────────────────────────
        console.log(`[cycle] Normalizing: "${rawItem.title.slice(0, 60)}..."`);
        const normalized = await normalizeRawItem(rawItem).catch((err) => {
          console.warn(`[cycle] Normalization failed for "${rawItem.title}":`, err);
          stats.errors++;
          return null;
        });

        if (!normalized) continue;

        // ── Step 4: Filter product moves ───────────────────────────────────
        if (!normalized.isProductMove) {
          console.log(`[cycle] Not a product move: "${rawItem.title}"`);
          continue;
        }

        // ── Step 5: Deduplicate by content_hash ────────────────────────────
        const hash = generateContentHash(normalized.company, normalized.title);
        const exists = await candidateExistsByHash(hash).catch(() => false);
        if (exists) {
          console.log(`[cycle] Duplicate skipped: "${normalized.title}"`);
          continue;
        }

        // ── Step 6: Store candidate ────────────────────────────────────────
        const candidate = await insertCandidate({
          agent_id:     agentId,
          title:        normalized.title,
          summary:      normalized.summary,
          company:      normalized.company,
          move_type:    normalized.moveType,
          url:          rawItem.url,
          source:       rawItem.source,
          source_id:    rawItem.sourceId,
          discovered_at: rawItem.publishedAt,
          content_hash: hash,
        });

        stats.candidatesFound++;
        processedCandidatesCount++;
        console.log(`[cycle] Candidate stored (${processedCandidatesCount}/${MAX_CANDIDATES_PER_CYCLE}): "${candidate.title}" (${candidate.id})`);

        // ── Step 7: Retrieve Breeth memory ────────────────────────────────
        const memoryContext = await retrieveMemory(candidate).catch(() => ({
          relevant: [],
          formattedContext: 'Memory unavailable.',
        }));

        // ── Step 8: Editorial score (AI Call 2) ───────────────────────────
        const decision = await withTimeout(
          () => scoreCandidate(candidate, { recentDecisions, memoryContext }),
          AI_TIMEOUT_MS,
          `editorial:${candidate.id}`
        ).catch((err) => {
          console.warn(`[cycle] Editorial scoring failed for ${candidate.id}:`, err);
          stats.errors++;
          return null;
        });

        if (!decision) continue;

        console.log(
          `[cycle] Score: ${decision.computedTotal}/100 → ${decision.decision.toUpperCase()}`
        );

        // ── Step 9: Persist decision ──────────────────────────────────────
        const decisionRow = await insertDecision({
          candidate_id:          candidate.id,
          agent_id:              agentId,
          market_pressure:       decision.marketPressure,
          strategic_signal:      decision.strategicSignal,
          evidence_quality:      decision.evidenceQuality,
          timeliness:            decision.timeliness,
          persona_fit:           decision.personaFit,
          pattern_continuity:    decision.patternContinuity,
          score:                 decision.computedTotal,
          decision:              decision.decision,
          reason:                decision.reason,
          scored_breakdown_json: {
            marketPressure:    decision.marketPressure,
            strategicSignal:   decision.strategicSignal,
            evidenceQuality:   decision.evidenceQuality,
            timeliness:        decision.timeliness,
            personaFit:        decision.personaFit,
            patternContinuity: decision.patternContinuity,
          },
        });

        if (decision.decision === 'watch') {
          stats.watched++;
          // Store meaningful move memory even for watch decisions
          if (decision.computedTotal > 60) {
            await storeCompetitiveMove(candidate, decision).catch(() => {});
          }
          continue;
        }

        if (decision.decision === 'reject') {
          stats.rejected++;
          continue;
        }

        // decision === 'publish' — continue pipeline

        // ── Step 10: Rate limit check ──────────────────────────────────────
        const allowed = await isPublishingAllowed(agentId).catch(() => false);
        if (!allowed) {
          console.log('[cycle] Rate limit active — downgrading publish to watch');
          // Insert a watch decision instead of publishing
          await insertDecision({
            candidate_id:          decisionRow.candidate_id,
            agent_id:              decisionRow.agent_id,
            market_pressure:       decisionRow.market_pressure,
            strategic_signal:      decisionRow.strategic_signal,
            evidence_quality:      decisionRow.evidence_quality,
            timeliness:            decisionRow.timeliness,
            persona_fit:           decisionRow.persona_fit,
            pattern_continuity:    decisionRow.pattern_continuity,
            score:                 decisionRow.score,
            decision:              'watch',
            reason:                `Rate limit active. Original reason: ${decision.reason}`,
            scored_breakdown_json: decisionRow.scored_breakdown_json,
          }).catch(() => {});
          stats.watched++;
          continue;
        }

        // ── Step 11: Generate post (AI Call 3) ────────────────────────────
        console.log(`[cycle] Writing post for: "${candidate.title}"`);
        const writerOutput = await withTimeout(
          () => generatePost(candidate, decision, memoryContext),
          AI_TIMEOUT_MS,
          `writer:${candidate.id}`
        ).catch((err) => {
          console.warn(`[cycle] Writer failed for ${candidate.id}:`, err);
          stats.errors++;
          return null;
        });

        if (!writerOutput) continue;

        // ── Step 12: Quality check (AI Call 4) ────────────────────────────
        const qcResult = await withTimeout(
          () => qualityCheck(writerOutput, candidate, recentPostTexts),
          AI_TIMEOUT_MS,
          `quality:${candidate.id}`
        ).catch((err) => {
          console.warn(`[cycle] QC failed for ${candidate.id}:`, err);
          return { pass: false, issues: ['QC timeout'], revisedText: null };
        });

        if (!qcResult.pass && !qcResult.revisedText) {
          console.log(`[cycle] QC rejected: ${qcResult.issues.join(', ')}`);
          stats.rejected++;
          continue;
        }

        // ── Step 13: Publish to Supabase ──────────────────────────────────
        const postText = assemblePostText(writerOutput);

        const post = await insertPost({
          agent_id:             agentId,
          related_candidate_id: candidate.id,
          move_text:            writerOutput.move,
          angle_text:           writerOutput.angle,
          pressure_text:        writerOutput.pressure,
          take_text:            writerOutput.take,
          text:                 postText,
          rationale:            decision.reason,
          sources:              [candidate.url],
        });

        stats.published++;
        console.log(`[cycle] ✓ Published post ${post.id}: "${candidate.title}"`);

        // Update recent posts for duplicate detection in this cycle
        recentPostTexts.splice(0, 0, postText);
        if (recentPostTexts.length > 5) recentPostTexts.splice(5);

        // ── Step 14: Update Breeth memory ─────────────────────────────────
        await storeCompetitiveMove(candidate, decision).catch(() => {});
        await storePheonixzJudgment(post, candidate, decision).catch(() => {});

      } catch (itemErr) {
        // Item-level failure — log and continue cycle
        console.error(`[cycle] Unhandled error for item "${rawItem.title}":`, itemErr);
        stats.errors++;
      }
    }

    // ── Step 16: Complete run ─────────────────────────────────────────────
    await completeRun(runId, {
      candidates_found: stats.candidatesFound,
      published:        stats.published,
      watched:          stats.watched,
      rejected:         stats.rejected,
    });
    console.log('[cycle] Complete:', stats);
    return stats;

  } catch (cycleErr) {
    // Cycle-level failure — record and rethrow
    const message = cycleErr instanceof Error ? cycleErr.message : 'Cycle failed';
    console.error('[cycle] Fatal error:', message);
    if (runId) await failRun(runId, message).catch(() => {});
    return { ...stats, errors: stats.errors + 1 };
  }
}
