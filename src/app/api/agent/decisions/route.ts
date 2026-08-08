import { NextRequest, NextResponse } from 'next/server';
import { getDecisionsByAgent } from '@/db/decisions';
import { getCandidateById } from '@/db/candidates';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json({ error: 'agentId query param is required' }, { status: 400 });
    }

    const decisions = await getDecisionsByAgent(agentId, 50);

    const enriched = await Promise.all(
      decisions.map(async (d) => {
        let candidateTitle = 'Product Move Analysis';
        let company = 'AI Industry';
        try {
          const cand = await getCandidateById(d.candidate_id);
          if (cand) {
            candidateTitle = cand.title;
            company = cand.company || company;
          }
        } catch {
          // Fallback if candidate lookup misses
        }
        return {
          id: d.id,
          title: candidateTitle,
          company,
          score: d.score,
          decision: d.decision,
          reason: d.reason,
          marketPressure: d.market_pressure,
          strategicSignal: d.strategic_signal,
          evidenceQuality: d.evidence_quality,
          timeliness: d.timeliness,
          personaFit: d.persona_fit,
          patternContinuity: d.pattern_continuity,
          createdAt: d.created_at,
        };
      })
    );

    return NextResponse.json({ decisions: enriched }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch decisions';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
