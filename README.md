# PhoenixZ — Autonomous AI Security & Market Intelligence Platform

PhoenixZ is an autonomous AI technology & market intelligence platform that scans tech news, clusters developments, evaluates market impact, synthesizes strategic insights, and persists published analysis without requiring human manual operation.

```text
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                                 PHOENIXZ SYSTEM                                 │
 └─────────────────────────────────────────────────────────────────────────────────┘
                                         │
 User / Evaluator                        │
       │                                 ▼
       ├───► POST /api/agent/init ───► Supabase (agents table) [Write-Once / Idempotent]
       │                                 ▲
       │                                 │
       └──────► GET /api/agent/feed ───────► Supabase (posts table) [100% Read-Only]
                                                   ▲
                                                   │
GitHub Actions Autonomous Scheduler ──────────────┤
 (Runs every 10 mins via .github/workflows/       │
  autonomous-cycle.yml -> /api/internal/cycle)     │
                                                   │
                                          16-Step Autonomous Cycle
                                          (Discover ──► Cluster ──► Score ──► Write ──► QC ──► Persist)
```

---

## Technical Stack & Architecture

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript 5
- **Database**: Supabase PostgreSQL (Row Level Security, RPC functions)
- **AI Gateway**: Provider-agnostic multi-provider architecture with automatic fallback (Groq `llama-3.3-70b-versatile` → Google Gemini `gemini-flash-latest` → OpenRouter → Claude AgentRouter)
- **Scheduler**: GitHub Actions Workflow (`.github/workflows/autonomous-cycle.yml`)
- **Testing**: Vitest with unit, integration, and API test coverage

---

## Local Development Setup

### Installation

```bash
git clone https://github.com/Suryansh-FSD/PHEONIXZ.git
cd PHEONIXZ
npm install
```

### Environment Configuration

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Primary LLM Provider (Groq)
GROQ_API_KEY=your-groq-api-key

# Fallback LLM Providers
GEMINI_API_KEY=your-gemini-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
AGENT_ROUTER_API_KEY=your-agentrouter-api-key

# Internal Authorization Secret
CRON_SECRET=your-cron-secret-token
```

### Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Verification Suite

Run the full automated test suite, typecheck, linter, and production build:

```bash
# Run unit & integration tests
npm test

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Build production bundle
npm run build
```

---

## Production Environment Variables

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

## Autonomous Scheduling with GitHub Actions

PhoenixZ uses **GitHub Actions** as its production autonomous scheduler, eliminating Vercel Cron tier restrictions and keeping deployments 100% compatible with the Vercel Hobby free tier.

### Role Breakdown

- **GitHub Actions**: Production autonomous scheduler (triggers cycle every 10 minutes).
- **Vercel**: Application hosting & API endpoint provider.
- **Supabase**: PostgreSQL database & distributed locking registry.
- **PhoenixZ**: Autonomous intelligence cycle execution engine.

### Setup Instructions

1. **Deploy PhoenixZ to Vercel**:
   Import your repository into Vercel and deploy the Next.js application.

2. **Add CRON_SECRET to Vercel**:
   In Vercel Project Settings → Environment Variables, add `CRON_SECRET` with a secure random token.

3. **Configure GitHub Repository Secret**:
   - Go to your GitHub repository: **Settings** → **Secrets and variables** → **Actions**.
   - Create a **New repository secret**:
     - Name: `CRON_SECRET`
     - Value: `<same secret token used in Vercel>`

4. **Configure GitHub Repository Variable**:
   - In the same Actions settings page, click the **Variables** tab.
   - Create a **New repository variable**:
     - Name: `PHOENIXZ_APP_URL`
     - Value: `https://your-production-app.vercel.app`

5. **Test Manual Trigger**:
   - Navigate to GitHub **Actions** tab → **Autonomous PhoenixZ Cycle**.
   - Click **Run workflow** → Select `main` branch → **Run workflow**.

6. **Automatic Execution**:
   Once configured, GitHub Actions will trigger `POST /api/internal/cycle` automatically every 10 minutes (`*/10 * * * *`).

---

## Evaluator Contract Compliance

- `POST /api/agent/init`: Initializes agent instance (`{"persona":{"name":"PhoenixZ","domain":"AI/Technology"}}`).
- `GET /api/agent/feed?agentId=<id>`: Returns 100% read-only list of published intelligence posts.
- `POST /api/agent/search`: User-facing competitive intelligence search query endpoint.
- `POST /api/internal/cycle`: Internal route triggered by GitHub Actions or dashboard UI to execute autonomous cycles.

---

## License

MIT
