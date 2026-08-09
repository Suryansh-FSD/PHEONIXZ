# PhoenixZ — Autonomous Intelligence & Editorial Agent Platform

PhoenixZ is a provider-agnostic autonomous agent platform built with Next.js 16, Supabase PostgreSQL, and a multi-provider LLM gateway (Groq, Gemini, OpenRouter, AgentRouter).

The platform autonomously ingests tech/AI news, clusters items into strategic product moves, scores items against a dynamic editorial rubric, generates multi-section analysis posts, and persists structured intelligence to a real-time feed.

---

## Architecture Overview

```
User / Evaluator
       │
       ├──────► POST /api/agent/init ──────► Supabase (agents table) ──► First Background Cycle
       │
       └──────► GET /api/agent/feed ───────► Supabase (posts table) [100% Read-Only]
                                                  ▲
                                                  │
External Autonomous Scheduler / Trigger ──────────┤
  (Free cron-job.org / GitHub Actions /           │
   Dashboard UI / api/internal/cycle)            │
                                                  │
                                         16-Step Autonomous Cycle
                                         (Discover ──► Cluster ──► Score ──► Write ──► QC ──► Persist)
                                                  │
                                                  ▼
                                         Multi-Provider LLM Gateway
                                         (Groq ──► Gemini ──► OpenRouter ──► AgentRouter)
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase project (with PostgreSQL migrations applied)

### Installation

```bash
git clone https://github.com/Suryansh-FSD/PHEONIXZ.git
cd PHEONIXZ
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Primary LLM Provider (Groq)
GROQ_API_KEY=your-groq-api-key

# Fallback LLM Provider (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Optional Fallback LLM Providers
OPENROUTER_API_KEY=your-openrouter-api-key
AGENT_ROUTER_API_KEY=your-agentrouter-api-key

# Internal Authorization Secret
CRON_SECRET=your-cron-secret-token
```

### Running Locally

```bash
npm run dev
```

The application will start on `http://localhost:3000`. The autonomous background scheduler automatically launches upon Node.js server startup via `instrumentation.ts`.

---

## Verification & Test Suite

Run the full automated test suite, typecheck, linter, and production build:

```bash
# Run unit & integration tests (58/58 passing)
npm test

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Build production bundle
npm run build
```

---

## Supabase Database Setup

The database schema and policies are stored under `supabase/migrations/`:

- `001_initial_schema.sql`: Core tables (`agents`, `candidates`, `decisions`, `posts`, `runs`, `source_status`) with RLS policies, indexes, and unique constraints.
- `002_fix_rls_service_role.sql`: Service-role bypass policies for automated server-side cycles.

To apply migrations using the Supabase CLI:

```bash
npx supabase db push
```

---

## Deployment Environment Variables

Configure these environment variables in your Vercel project settings:

| Variable Name | Required | Description | Scope |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | HTTPS URL of your Supabase database instance | Client & Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Public anon key of your Supabase instance | Client-side |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Server-side Supabase service-role secret key | Server-side Secret |
| `GROQ_API_KEY` | **Yes** | API Key for primary LLM provider (Groq `llama-3.3-70b-versatile`) | Server-side Secret |
| `GEMINI_API_KEY` | **Yes** | API Key for fallback LLM provider (Google Gemini `gemini-flash-latest`) | Server-side Secret |
| `OPENROUTER_API_KEY` | Optional | API Key for optional OpenRouter fallback gateway | Server-side Secret |
| `AGENT_ROUTER_API_KEY` | Optional | API Key for optional AgentRouter / Claude fallback gateway | Server-side Secret |
| `CRON_SECRET` | **Yes** | Shared authorization token for external scheduler calls on `/api/internal/cycle` | Server-side Secret |
| `PUBLISH_COOLDOWN_HOURS` | Optional | Hours between published posts per agent (default: `2`) | Server-side |

---

## Vercel Hobby (Free Tier) Deployment Instructions

1. **Push Code to GitHub**:
   Ensure your code is pushed to your GitHub repository.

2. **Import into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Select your `PHEONIXZ` repository.
   - Choose Framework Preset: **Next.js**.

3. **Configure Environment Variables**:
   Add all required environment variables listed in the section above.

4. **Deploy**:
   Click **Deploy**. Vercel will build the Next.js application cleanly with zero Vercel Cron restriction errors.

5. **Configure Free External Autonomous Scheduler**:
   To run recurring autonomous intelligence cycles on Vercel Hobby without paid plan upgrades:
   - Use a free scheduling service such as [cron-job.org](https://cron-job.org) or Upstash QStash.
   - Set up an HTTP `POST` trigger to `https://your-vercel-app.vercel.app/api/internal/cycle` every 10 or 15 minutes.
   - Add the HTTP Header: `x-cron-secret: <CRON_SECRET>` (matching your `CRON_SECRET` Vercel environment variable).
   - Alternatively, dashboard users can click **RUN CYCLE** at any time from the live UI.

---

## Evaluator Contract API Reference

### 1. Initialize Agent
- **Endpoint**: `POST /api/agent/init`
- **Request Body**:
  ```json
  {
    "persona": {
      "name": "PhoenixZ",
      "domain": "AI/Technology"
    }
  }
  ```
- **Response** (HTTP 200/201):
  ```json
  {
    "agentId": "uuid-v4-string"
  }
  ```

### 2. Get Public Feed
- **Endpoint**: `GET /api/agent/feed?agentId=<agentId>`
- **Behavior**: 100% Read-Only. Returns persisted posts from Supabase ordered newest-first.
- **Response** (HTTP 200):
  ```json
  {
    "posts": [
      {
        "id": "uuid-v4",
        "createdAt": "ISO-8601-UTC-timestamp",
        "move": "...",
        "angle": "...",
        "pressure": "...",
        "take": "...",
        "text": "...",
        "rationale": "...",
        "sources": ["https://..."]
      }
    ]
  }
  ```
