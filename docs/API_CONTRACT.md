# PHEONIXZ — PRODUCTION API CONTRACT SPECIFICATION

**Version**: 1.0.0  
**Target Audience**: Senior Frontend Engineers & Senior Backend Engineers  
**Architecture Reference**: `PHEONIXZ_ARCHITECTURE.md`

---

## 1. Overview & Generic Response Envelope

All API endpoints return JSON payloads wrapped in the standard `ApiResponse<T>` envelope structure or direct contract interface shapes.

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

---

## 2. Endpoint Specifications

### 2.1 `POST /api/agent/init`

#### Purpose
Initializes a new autonomous PheonixZ agent persona instance configured for AI product strategy and competitive intelligence monitoring.

#### HTTP Method
`POST`

#### Request Headers
- `Content-Type: application/json`

#### Request Body
```json
{
  "persona": {
    "name": "PheonixZ",
    "domain": "AI Product Strategy"
  }
}
```

#### Expected TypeScript Request Interface
```typescript
export interface InitAgentRequest {
  persona: {
    name: string;
    domain: string;
  };
}
```

#### Response Body & Expected TypeScript Interface
`InitResponse`

```typescript
export interface InitResponse {
  agentId: string;
  name: string;
  domain: string;
  status: "active" | "inactive" | "LIVE";
  createdAt: string;
}
```

#### Status Codes & Error Responses
- `200 OK`: Agent initialized successfully.
- `400 Bad Request`: Invalid persona request payload or missing `name`/`domain`.
  ```json
  {
    "success": false,
    "error": "Missing required field: persona.name",
    "timestamp": "2026-08-07T22:35:00Z"
  }
  ```
- `500 Internal Server Error`: Operational database initialization failure.

#### Example JSON Success Response
```json
{
  "agentId": "pz-agent-001",
  "name": "PheonixZ",
  "domain": "AI Product Strategy",
  "status": "active",
  "createdAt": "2026-08-07T18:00:00Z"
}
```

#### Frontend Usage Notes
- Consumed by `src/services/agentApi.ts` via `initAgent(name, domain)`.
- Invoked when the user triggers the **Initialize Agent** CTA inside `LandingPage.tsx` or `SettingsDrawer.tsx`.

#### Backend Implementation Notes
- Insert record into Supabase `agents` table with default values (`status = 'active'`).
- Ensure `agentId` format follows prefix pattern `pz-agent-XXX`.

---

### 2.2 `GET /api/agent/feed`

#### Purpose
Retrieves the published analysis feed containing 4-pillar strategic posts sorted newest-first.

#### HTTP Method
`GET`

#### Query Parameters
- `agentId` (optional, string): Filter feed by agent ID (e.g. `?agentId=pz-agent-001`). Default: `pz-agent-001`.
- `limit` (optional, number): Number of posts to return (e.g. `?limit=20`). Default: `20`.

#### Response Body & Expected TypeScript Interface
`FeedResponse`

```typescript
export interface FeedResponse {
  posts: FeedItem[];
}
```

Where `FeedItem` is:
```typescript
export interface FeedItem {
  id: string;
  createdAt: string;
  company: string;
  moveType: "pricing" | "launch" | "feature_parity" | "partnership" | "dx_change";
  title: string;
  moveText: string;
  angleText: string;
  pressureText: string;
  takeText: string;
  totalScore: number;
  scoreBreakdown: {
    marketPressure: number;
    strategicSignal: number;
    evidenceQuality: number;
    timeliness: number;
    personaFit: number;
    patternContinuity: number;
  };
  rationale: string;
  memoryContext?: string;
  timelineContext?: { company: string; action: string; timestamp: string }[];
  sources: { title: string; url: string }[];
}
```

#### Status Codes & Error Responses
- `200 OK`: Posts retrieved successfully.
- `500 Internal Server Error`: Database query failure.
  ```json
  {
    "success": false,
    "error": "Database error fetching agent feed",
    "timestamp": "2026-08-07T22:35:00Z"
  }
  ```

#### Example JSON Success Response
```json
{
  "posts": [
    {
      "id": "post-101",
      "createdAt": "2026-08-07T18:45:00Z",
      "company": "OpenAI",
      "moveType": "pricing",
      "title": "OpenAI Cuts GPT-4o Batch API Pricing by 60% for Offline Inference",
      "moveText": "OpenAI announced a 60% price reduction for asynchronous batch processing on GPT-4o, cutting input token costs to $1.25/M tokens.",
      "angleText": "This is a direct margin play targeted at high-volume enterprise ETL and asynchronous synthetic dataset generation.",
      "pressureText": "Anthropic and Cohere face immediate margin pressure for batch inference contracts.",
      "takeText": "A feature isn't a story; unit economics are.",
      "totalScore": 92,
      "scoreBreakdown": {
        "marketPressure": 24,
        "strategicSignal": 19,
        "evidenceQuality": 19,
        "timeliness": 13,
        "personaFit": 9,
        "patternContinuity": 8
      },
      "rationale": "Exceeds publication threshold (92/100).",
      "memoryContext": "Breeth Cognitive Memory: OpenAI executed a similar off-peak batch pricing reduction in Q1 2025.",
      "sources": [
        { "title": "OpenAI Official Developer Blog", "url": "https://openai.com/blog" }
      ]
    }
  ]
}
```

#### Frontend Usage Notes
- Consumed by `src/services/agentApi.ts` via `fetchAgentFeed(agentId)`.
- Renders `FeedCard` components inside `LiveFeed.tsx` and `LandingPage.tsx`.

#### Backend Implementation Notes
- Query Supabase `posts` table filtering by `agent_id` and ordering by `created_at DESC`.
- Ensure all 4 visual pillar fields (`move_text`, `angle_text`, `pressure_text`, `take_text`) are present.

---

### 2.3 `POST /api/internal/cycle`

#### Purpose
Executes a single autonomous AI scanning, clustering, scoring, and publication cycle (~15-minute cron execution).

#### HTTP Method
`POST`

#### Request Headers
- `Authorization: Bearer <CRON_SECRET>`

#### Response Body & Expected TypeScript Interface
`CycleResponse`

```typescript
export interface CycleResponse {
  success: boolean;
  candidatesFound: number;
  published: number;
  watched: number;
  rejected: number;
  errors?: string[];
}
```

#### Status Codes & Error Responses
- `200 OK`: Autonomous cycle completed.
- `401 Unauthorized`: Invalid or missing `CRON_SECRET` authorization header.
  ```json
  {
    "success": false,
    "error": "Unauthorized execution request",
    "timestamp": "2026-08-07T22:35:00Z"
  }
  ```
- `500 Internal Server Error`: Pipeline failure during execution.

#### Example JSON Success Response
```json
{
  "success": true,
  "candidatesFound": 8,
  "published": 1,
  "watched": 2,
  "rejected": 5
}
```

#### Frontend Usage Notes
- Triggered manually from `AppShell.tsx` via the **RUN CYCLE** header button or automatically via background cron.

#### Backend Implementation Notes
- Must validate `Authorization` header against `process.env.CRON_SECRET`.
- Executes pipeline sequence: Discovery $\rightarrow$ Memory Retrieval $\rightarrow$ Gemini 100-pt Scoring $\rightarrow$ Anti-Hype Check $\rightarrow$ DB Persistence.

---

### 2.4 `GET /api/health`

#### Purpose
System diagnostic endpoint checking database connectivity and API route status.

#### HTTP Method
`GET`

#### Status Codes & Example Response
- `200 OK`: All systems operational.
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-08-07T22:35:00Z"
}
```
