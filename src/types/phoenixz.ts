/**
 * PHOENIXZ — SHARED TYPE CONTRACTS
 * 
 * Canonical TypeScript interfaces defining backend-frontend payload contracts.
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

export interface SourceObject {
  title?: string;
  url: string;
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
  
  // Assembled Text & Strategic Rationale
  text?: string;
  rationale: string;
  sources: Array<string | SourceObject>;
  
  // Optional detailed view props
  totalScore?: number;
  scoreBreakdown?: ScoreBreakdown;
  memoryContext?: string;
  timelineContext?: CompetitiveStep[];
}

export type EditorialPost = FeedItem;

// Decision Verdict Enum
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
  finishedAt: string | null;
  status: "success" | "partial" | "failed" | "running" | "completed";
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
export type SourceStatusType = "ok" | "degraded" | "dead";

export interface SourceHealth {
  id: string;
  name: string;
  status: SourceStatusType;
  lastSuccess?: string;
  lastFailure?: string;
  consecutiveFailures: number;
  updatedAt: string;
}

// Search Intelligence Contracts
export type SearchIntentType = "company" | "product" | "pricing" | "launch" | "comparison" | "general";

export interface SearchEntityInfo {
  name: string;
  parentCompany?: string;
  type: string;
}

export interface SearchRecentMove {
  title: string;
  company: string;
  category: string;
  timestamp: string;
  score?: number;
}

export interface SearchIntelligenceResult {
  query: string;
  found: boolean;
  intent: SearchIntentType;
  entity: SearchEntityInfo;
  overview: string;
  currentSignal: string;
  recentMoves: SearchRecentMove[];
  competitiveImpact: string;
  sources: SourceObject[];
  relatedEntities: {
    companies: string[];
    products: string[];
  };
}

export interface SearchIntelligenceRequest {
  query: string;
}

// Evaluator API Endpoints Data Payloads
export interface InitResponse {
  agentId: string;
  name?: string;
  domain?: string;
  status?: string;
  createdAt?: string;
}

export interface FeedResponse {
  posts: Array<{
    id: string;
    createdAt: string;
    text: string;
    moveType?: string;
    move?: string;
    angle?: string;
    pressure?: string;
    take?: string;
    rationale: string;
    sources: Array<string | SourceObject>;
  }>;
}

export interface CycleResponse {
  candidatesFound: number;
  published: number;
  watched: number;
  rejected: number;
  errors: number;
}

export interface ActivityData {
  observedCount?: number;
  rejectedCount?: number;
  watchingCount?: number;
  publishedCount?: number;
  lastCycleAt?: string;
  lastScan?: string;
  candidatesFound?: number;
  published?: number;
  rejected?: number;
  watching?: number;
  sourceStatuses: SourceHealth[];
  recentRuns?: Run[];
}
