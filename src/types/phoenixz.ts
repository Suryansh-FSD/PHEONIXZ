/**
 * PHEONIXZ — SHARED TYPE CONTRACTS
 * 
 * Canonical TypeScript interfaces defining backend-frontend payload contracts.
 * Consumed by both parallel frontend components and backend API route handlers.
 */

// Generic API Envelope
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Agent State Contract
export type AgentStatusType = "LIVE" | "OFFLINE" | "active" | "inactive";

export interface Agent {
  id: string;
  name: string;
  domain: string;
  status: AgentStatusType;
  uptime: string;
  lastScan: string;
  createdAt: string;
}

// System Header State (Frontend Representation)
export interface SystemHeaderState {
  name: string;
  domain: string;
  status: "LIVE" | "OFFLINE";
  uptime: string;
  lastScan: string;
}

// Move Types
export type MoveType = "pricing" | "launch" | "feature_parity" | "partnership" | "dx_change";

// 100-Point Score Rubric Breakdown
export interface ScoreBreakdown {
  marketPressure: number; // /25
  strategicSignal: number; // /20
  evidenceQuality: number; // /20
  timeliness: number; // /15
  personaFit: number; // /10
  patternContinuity: number; // /10
}

// Primary Feed Analysis Item Contract
export interface FeedItem {
  id: string;
  createdAt: string;
  company: string;
  moveType: MoveType;
  title: string;
  
  // The 4 Core Visual Pillars
  moveText: string;
  angleText: string;
  pressureText: string;
  takeText: string;
  
  // Rubric & Audit Rationale
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  rationale: string;
  
  // Cognitive Context & Sources
  memoryContext?: string;
  timelineContext?: { company: string; action: string; timestamp: string }[];
  sources: { title: string; url: string }[];
}

// Alias for backwards compatibility
export type EditorialPost = FeedItem;

// Candidate Decision Ledger Contract
export type DecisionType = "publish" | "watch" | "reject";

export interface Decision {
  id: string;
  candidateTitle: string;
  company: string;
  moveType: MoveType;
  timestamp: string;
  decision: DecisionType;
  score: number;
  reason: string;
  scoreBreakdown?: ScoreBreakdown;
}

// Alias for backwards compatibility
export type DecisionLogItem = Decision;

// Competitive Move Sequence Step
export interface CompetitiveStep {
  company: string;
  action: string;
  timestamp: string;
  sourceUrl?: string;
}

// Competitive Thread Contract
export interface CompetitiveThread {
  id: string;
  topic: string;
  category: MoveType;
  companyAMove: CompetitiveStep;
  companyBResponse: CompetitiveStep;
  phoenixzTake: string;
  strategicPattern: string;
}

// System KPI Statistics Contract
export interface Statistics {
  observed: number;
  rejected: number;
  watching: number;
  published: number;
}

// Alias for backwards compatibility
export type StatStripData = Statistics;

// Autonomous Cycle Run Record Contract
export interface Run {
  id: string;
  startedAt: string;
  finishedAt: string;
  status: "success" | "partial" | "failed";
  candidatesFound: number;
  published: number;
  watched: number;
  rejected: number;
  errors: number;
}

// Breeth Cognitive Memory Layer Contract
export interface Memory {
  id: string;
  entity: string;
  topic: string;
  historicalContext: string;
  strategicPattern: string;
  timestamp: string;
}

// Source Health Contract
export type SourceHealth = "OK" | "DEGRADED" | "FAIL";

export interface SourceStatusItem {
  id: string;
  sourceName: string;
  url: string;
  type: string;
  lastSuccess: string;
  consecutiveFailures: number;
  status: SourceHealth;
}

export interface ActivityData {
  lastScan: string;
  candidatesFound: number;
  published: number;
  rejected: number;
  watching: number;
  sourceStatuses: SourceStatusItem[];
}

// Endpoint Response Contracts
export interface InitResponse {
  agentId: string;
  name: string;
  domain: string;
  status: string;
  createdAt: string;
}

export interface FeedResponse {
  posts: FeedItem[];
}

export interface CycleResponse {
  success: boolean;
  candidatesFound: number;
  published: number;
  watched: number;
  rejected: number;
  errors?: string[];
}
