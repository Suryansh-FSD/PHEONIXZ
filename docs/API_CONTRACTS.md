# PHEONIXZ — API Contracts & Interface Documentation

This document defines the official shared TypeScript contract interfaces for parallel frontend and backend development.

---

## Shared Type Contracts (`src/types/phoenixz.ts`)

| Domain Interface | Backend Entity / DB Table | Primary Consumption Site |
| :--- | :--- | :--- |
| `Agent` | `agents` table | Agent initialization & system header status |
| `FeedItem` (alias `EditorialPost`) | `posts` table | `LiveFeed`, `FeedCard` 4-pillar analysis cards |
| `Decision` (alias `DecisionLogItem`) | `decisions` table | `DecisionLog` data table ledger |
| `CompetitiveThread` | `threads` view | `CompetitiveThreadView` vertical timeline |
| `Statistics` (alias `StatStripData`) | Computed DB counts | `StatStrip` KPI counter cards |
| `Run` (alias `RunHistoryItem`) | `runs` table | `RunHistory` autonomous cycle log |
| `Memory` | `memory` table (Breeth) | Breeth cognitive memory context drawers |
| `SourceStatusItem` / `SourceHealth` | `source_status` table | `SourceHealthPanel`, `ActivityPanel` |

---

## Endpoint Response Mapping

### 1. `POST /api/agent/init`
- **Description**: Initializes an autonomous PheonixZ agent persona instance.
- **Request Body**:
  ```json
  {
    "persona": {
      "name": "PheonixZ",
      "domain": "AI Product Strategy"
    }
  }
  ```
- **Response Payload Interface**: `InitResponse`
  ```typescript
  export interface InitResponse {
    agentId: string;
    name: string;
    domain: string;
    status: string;
    createdAt: string;
  }
  ```

---

### 2. `GET /api/agent/feed`
- **Description**: Fetches published editorial analysis posts sorted newest-first.
- **Query Parameters**: `?agentId=pz-agent-001&limit=20`
- **Response Payload Interface**: `FeedResponse`
  ```typescript
  export interface FeedResponse {
    posts: FeedItem[];
  }
  ```

---

### 3. `POST /api/internal/cycle`
- **Description**: Triggered by Vercel Cron or manual execution (protected by `CRON_SECRET` header).
- **Headers**: `Authorization: Bearer <CRON_SECRET>`
- **Response Payload Interface**: `CycleResponse`
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

---

### 4. Generic Wrapper Envelope: `ApiResponse<T>`
- **Response Payload Interface**:
  ```typescript
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
  }
  ```

---

## Development Handoff Guidelines

1. **Frontend**:
   - All components must import payload contracts exclusively from `@/types` or `@/types/phoenixz`.
   - Toggle `USE_MOCK_DATA = false` in `src/services/agentApi.ts` when live endpoints are ready.

2. **Backend**:
   - Route handlers under `/app/api/` must return JSON objects matching `InitResponse`, `FeedResponse`, and `CycleResponse` signatures.
