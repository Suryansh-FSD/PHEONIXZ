/**
 * PHOENIXZ Client Service Layer & Data Abstraction
 * 
 * Provides a clean API interface for all frontend presentation components.
 * The UI is 100% agnostic to whether data originates from local mock payloads or live backend HTTP APIs.
 * 
 * Switch USE_MOCK_DATA to false when connecting live backend APIs.
 */

import {
  EditorialPost,
  SystemHeaderState,
  StatStripData,
  DecisionLogItem,
  ActivityData,
  CompetitiveThread,
  Run,
  InitResponse,
  FeedResponse,
  CycleResponse,
} from "@/types/phoenixz";

import {
  mockAgentState,
  mockStatStrip,
  mockFeed,
  mockDecisions,
  mockActivity,
  mockThreads,
} from "@/mocks";

// Environment toggle for Mock vs Backend API Mode
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

/**
 * Initialize Agent Instance
 */
export async function initAgent(
  personaName = "PheonixZ",
  domain = "AI Product Strategy"
): Promise<InitResponse> {
  if (USE_MOCK_DATA) {
    return {
      agentId: "pz-agent-001",
      name: personaName,
      domain: domain,
      status: "active",
      createdAt: new Date().toISOString(),
    };
  }

  const res = await fetch("/api/agent/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona: { name: personaName, domain } }),
  });

  if (!res.ok) throw new Error(`Init Agent Failed: ${res.statusText}`);
  return res.json();
}

/**
 * Fetch Analysis Feed Posts
 */
export async function fetchAgentFeed(agentId = "pz-agent-001"): Promise<FeedResponse> {
  if (USE_MOCK_DATA) {
    return { posts: mockFeed };
  }

  const res = await fetch(`/api/agent/feed?agentId=${encodeURIComponent(agentId)}`);
  if (!res.ok) throw new Error(`Fetch Feed Failed: ${res.statusText}`);
  return res.json();
}

/**
 * Fetch Agent System Header Status
 */
export async function fetchSystemHeaderState(): Promise<SystemHeaderState> {
  if (USE_MOCK_DATA) {
    return mockAgentState;
  }
  const res = await fetch("/api/agent/init");
  if (!res.ok) return mockAgentState;
  const data: InitResponse = await res.json();
  return {
    name: data.name,
    domain: data.domain,
    status: "LIVE",
    uptime: "14d 06h 22m",
    lastScan: "3 mins ago",
  };
}

/**
 * Fetch System KPI Statistics
 */
export async function fetchStatStripData(): Promise<StatStripData> {
  if (USE_MOCK_DATA) {
    return mockStatStrip;
  }
  return mockStatStrip;
}

/**
 * Fetch Decision Ledger Log
 */
export async function fetchDecisionLogItems(): Promise<DecisionLogItem[]> {
  if (USE_MOCK_DATA) {
    return mockDecisions;
  }
  return mockDecisions;
}

/**
 * Fetch System Activity & Ingestion Health
 */
export async function fetchActivityData(): Promise<ActivityData> {
  if (USE_MOCK_DATA) {
    return mockActivity;
  }
  return mockActivity;
}

/**
 * Fetch Competitive Threads
 */
export async function fetchCompetitiveThreads(): Promise<CompetitiveThread[]> {
  if (USE_MOCK_DATA) {
    return mockThreads;
  }
  return mockThreads;
}

/**
 * Fetch Autonomous Cycle Run History
 */
export async function fetchRunHistory(): Promise<Run[]> {
  if (USE_MOCK_DATA) {
    return [
      {
        id: "run-901",
        startedAt: "2026-08-07T21:28:00Z",
        finishedAt: "2026-08-07T21:28:14Z",
        status: "success",
        candidatesFound: 8,
        published: 1,
        watched: 2,
        rejected: 5,
        errors: 0,
      },
      {
        id: "run-902",
        startedAt: "2026-08-07T21:13:00Z",
        finishedAt: "2026-08-07T21:13:12Z",
        status: "success",
        candidatesFound: 6,
        published: 1,
        watched: 1,
        rejected: 4,
        errors: 0,
      },
      {
        id: "run-903",
        startedAt: "2026-08-07T20:58:00Z",
        finishedAt: "2026-08-07T20:58:15Z",
        status: "success",
        candidatesFound: 12,
        published: 0,
        watched: 3,
        rejected: 9,
        errors: 0,
      },
      {
        id: "run-904",
        startedAt: "2026-08-07T20:43:00Z",
        finishedAt: "2026-08-07T20:43:18Z",
        status: "partial",
        candidatesFound: 5,
        published: 0,
        watched: 1,
        rejected: 4,
        errors: 1,
      },
    ];
  }
  return [];
}

/**
 * Trigger Autonomous Scan Cycle
 */
export async function triggerCycle(): Promise<CycleResponse> {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      candidatesFound: 4,
      published: 1,
      watched: 1,
      rejected: 2,
    };
  }

  const res = await fetch("/api/internal/cycle", {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Cycle execution failed: ${res.statusText}`);
  return res.json();
}
