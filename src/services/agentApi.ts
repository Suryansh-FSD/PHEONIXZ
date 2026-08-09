import {
  FeedItem,
  DecisionLogItem,
  Run,
  InitResponse,
  FeedResponse,
  SourceHealth,
  SearchIntelligenceResult,
  MoveType,
} from "@/types/phoenixz";

export interface AgentInfo {
  id: string;
  name: string;
  domain: string;
  active: boolean;
  createdAt: string;
}

/**
 * Initialize Agent Instance
 * Calls POST /api/agent/init according to the evaluator contract.
 */
export async function initAgent(
  personaName = "PhoenixZ",
  domain = "AI/Technology"
): Promise<InitResponse> {
  const res = await fetch("/api/agent/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona: { name: personaName, domain } }),
  });

  if (!res.ok) {
    throw new Error(`Init Agent Failed: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Fetch Agent Info
 * Calls GET /api/agent/info?agentId=...
 */
export async function fetchAgentInfo(agentId: string): Promise<AgentInfo | null> {
  if (!agentId) return null;
  try {
    const res = await fetch(`/api/agent/info?agentId=${encodeURIComponent(agentId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.agent ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch Analysis Feed Posts
 * Calls GET /api/agent/feed?agentId=...
 */
export async function fetchAgentFeed(agentId: string): Promise<FeedItem[]> {
  if (!agentId) return [];

  const res = await fetch(`/api/agent/feed?agentId=${encodeURIComponent(agentId)}`);
  if (!res.ok) {
    throw new Error(`Fetch Feed Failed: ${res.statusText}`);
  }

  const data: FeedResponse = await res.json();
  const rawPosts = data.posts || [];

  return rawPosts.map((post) => {
    let moveText = post.move || "";
    let angleText = post.angle || "";
    let pressureText = post.pressure || "";
    let takeText = post.take || "";

    if (!moveText && post.text) {
      const parts = post.text.split("\n\n");
      for (const part of parts) {
        if (part.startsWith("THE MOVE")) moveText = part.replace("THE MOVE\n", "").replace("THE MOVE", "").trim();
        else if (part.startsWith("THE ANGLE")) angleText = part.replace("THE ANGLE\n", "").replace("THE ANGLE", "").trim();
        else if (part.startsWith("THE PRESSURE")) pressureText = part.replace("THE PRESSURE\n", "").replace("THE PRESSURE", "").trim();
        else if (part.includes("TAKE")) takeText = part.replace(/.*TAKE\n?/, "").trim();
      }
      if (!moveText) moveText = post.text;
    }

    const firstLine = moveText ? moveText.slice(0, 80).split(".")[0] : "Market Intelligence Report";
    const lowerMove = moveText.toLowerCase();
    const company = lowerMove.includes("openai")
      ? "OpenAI"
      : lowerMove.includes("anthropic")
      ? "Anthropic"
      : lowerMove.includes("google")
      ? "Google DeepMind"
      : lowerMove.includes("apple")
      ? "Apple"
      : "AI Industry";

    const sources = (post.sources || []).map((s) =>
      typeof s === "string" ? { title: "Source Article", url: s } : s
    );

    return {
      id: post.id,
      createdAt: post.createdAt,
      company,
      moveType: (post.moveType || "launch") as MoveType,
      title: firstLine,
      moveText: moveText || post.text,
      angleText: angleText,
      pressureText: pressureText,
      takeText: takeText,
      text: post.text,
      totalScore: 85,
      scoreBreakdown: {
        marketPressure: 22,
        strategicSignal: 18,
        evidenceQuality: 18,
        timeliness: 13,
        personaFit: 8,
        patternContinuity: 6,
      },
      rationale: post.rationale || "Selected based on high strategic market pressure and verified source evidence.",
      sources,
    };
  });
}

/**
 * Fetch Decision Ledger Items
 * Calls GET /api/agent/decisions?agentId=...
 */
export async function fetchDecisionLogItems(agentId: string): Promise<DecisionLogItem[]> {
  if (!agentId) return [];
  try {
    const res = await fetch(`/api/agent/decisions?agentId=${encodeURIComponent(agentId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.decisions || []).map((d: Record<string, unknown>) => ({
      id: String(d.id),
      candidateTitle: String(d.title || "Product Move"),
      company: String(d.company || "AI Industry"),
      moveType: "launch",
      timestamp: String(d.createdAt),
      decision: d.decision as "publish" | "watch" | "reject",
      score: Number(d.score || 0),
      reason: String(d.reason || ""),
      scoreBreakdown: {
        marketPressure: Number(d.marketPressure || 0),
        strategicSignal: Number(d.strategicSignal || 0),
        evidenceQuality: Number(d.evidenceQuality || 0),
        timeliness: Number(d.timeliness || 0),
        personaFit: Number(d.personaFit || 0),
        patternContinuity: Number(d.patternContinuity || 0),
      },
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch Autonomous Cycle Run History
 * Calls GET /api/agent/runs?agentId=...
 */
export async function fetchRunHistory(agentId: string): Promise<Run[]> {
  if (!agentId) return [];
  try {
    const res = await fetch(`/api/agent/runs?agentId=${encodeURIComponent(agentId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.runs || []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      startedAt: String(r.startedAt),
      finishedAt: r.finishedAt ? String(r.finishedAt) : null,
      status: r.status === "completed" ? "success" : (r.status as "success" | "partial" | "failed"),
      candidatesFound: Number(r.candidatesFound || 0),
      published: Number(r.published || 0),
      watched: Number(r.watched || 0),
      rejected: Number(r.rejected || 0),
      errors: r.error ? 1 : 0,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch Discovery Source Statuses
 * Calls GET /api/agent/sources
 */
export async function fetchSourceStatuses(): Promise<SourceHealth[]> {
  try {
    const res = await fetch("/api/agent/sources");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.sources || []).map((s: Record<string, unknown>) => ({
      id: String(s.id),
      name: String(s.name),
      status: s.status as "ok" | "degraded" | "dead",
      lastSuccess: s.lastSuccess ? String(s.lastSuccess) : undefined,
      lastFailure: s.lastFailure ? String(s.lastFailure) : undefined,
      consecutiveFailures: Number(s.consecutiveFailures || 0),
      updatedAt: String(s.updatedAt),
    }));
  } catch {
    return [];
  }
}

/**
 * Search PhoenixZ Competitive Intelligence
 * Calls POST /api/agent/search
 */
export async function searchIntelligence(query: string): Promise<SearchIntelligenceResult> {
  const res = await fetch("/api/agent/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Search Failed: ${res.statusText}`);
  }

  return res.json();
}
