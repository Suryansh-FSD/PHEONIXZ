# PHOENIXZ — FRONTEND HANDOFF DOCUMENTATION FOR BACKEND ENGINEER

**Author**: Senior Frontend Lead & Product Designer  
**Target Audience**: Senior Backend / Systems Engineer  
**Status**: Frontend 100% Complete & Integration-Ready  
**Architecture Reference**: `PHEONIXZ_ARCHITECTURE.md`

---

## 1. Overview of Frontend Architecture

The **PHEONIXZ** frontend is built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. It provides a serious, data-dense product strategy dashboard adhering to the design principles of Bloomberg (data precision), Stripe (pristine borders), and Linear (Obsidian dark palette).

The frontend is **completely decoupled** from the backend. All data fetching is routed through a single client service layer (`src/services/agentApi.ts`), allowing seamless transition from typed mock data to live production endpoints.

---

## 2. Directory & Component Structure

```
├── app/
│   ├── globals.css           # CSS Custom Properties, Obsidian Dark / Slate Light themes
│   ├── layout.tsx            # Root layout, fonts, metadata
│   ├── page.tsx              # Main entry page (renders LandingPage or AppShell)
│   └── api/                  # API Route Handlers (OWNED BY BACKEND ENGINEER)
│       ├── agent/init/       # POST /api/agent/init
│       ├── agent/feed/       # GET /api/agent/feed
│       └── internal/cycle/   # POST /api/internal/cycle
├── src/
│   ├── types/                # SHARED TYPE CONTRACTS (DO NOT MODIFY INCOMPATIBLY)
│   │   ├── phoenixz.ts       # FeedItem, Decision, CompetitiveThread, Agent, etc.
│   │   └── index.ts          # Barrel export
│   ├── config/
│   │   └── navigation.ts     # Single-source navigation item configuration
│   ├── lib/
│   │   └── date.ts           # Shared timestamp formatting utilities
│   ├── services/
│   │   └── agentApi.ts       # CLIENT SERVICE LAYER (API vs MOCK TOGGLE SITE)
│   ├── mocks/                # CANONICAL TYPED MOCK DATA (READ-ONLY REFERENCE)
│   │   ├── agent.ts
│   │   ├── feed.ts
│   │   ├── decisions.ts
│   │   ├── threads.ts
│   │   └── statistics.ts
│   └── components/
│       ├── AppShell.tsx              # SaaS Dashboard Shell & Top Nav
│       ├── LandingPage.tsx           # Editorial Hero & Live Preview Landing Page
│       ├── LiveFeed.tsx              # Analysis feed list
│       ├── DecisionLog.tsx           # High-density decision ledger table
│       ├── CompetitiveThreadView.tsx # Interactive vertical timeline
│       ├── ActivityPanel.tsx         # System activity & scan stats
│       ├── RunHistory.tsx            # Autonomous cycle history table
│       ├── SourceHealthPanel.tsx     # Ingestion source health monitor
│       ├── SettingsDrawer.tsx        # Persona & threshold settings
│       └── ui/                       # 22 Production UI Components (Button, Card, etc.)
└── docs/
    ├── API_CONTRACT.md        # Official API Endpoint Specifications
    ├── API_CONTRACTS.md       # Type Mapping & Database Model Contracts
    ├── DESIGN_SYSTEM.md       # Design Tokens & Theme Documentation
    └── components.md          # Component Specifications
```

---

## 3. Where API Calls & Mock Data Currently Live

1. **Client API Service Layer**: `src/services/agentApi.ts`
   - All frontend components call functions in `agentApi.ts`:
     - `initAgent()`
     - `fetchAgentFeed()`
     - `fetchSystemHeaderState()`
     - `fetchStatStripData()`
     - `fetchDecisionLogItems()`
     - `fetchActivityData()`
     - `fetchCompetitiveThreads()`
   - Currently, `USE_MOCK_DATA = true` is hardcoded at the top of `src/services/agentApi.ts`.

2. **Canonical Mock Data**: `src/mocks/`
   - Serves typed objects matching the database schemas and route contracts specified in `PHEONIXZ_ARCHITECTURE.md`.

---

## 4. How Backend Should Replace Mock Data

When you are ready to connect live backend API endpoints:

1. **Step 1**: Implement `/app/api/agent/init`, `/app/api/agent/feed`, and `/app/api/internal/cycle` route handlers.
2. **Step 2**: Open `src/services/agentApi.ts`.
3. **Step 3**: Change `const USE_MOCK_DATA = true;` to `const USE_MOCK_DATA = false;`.
4. **Step 4**: The frontend will automatically route requests to `/api/agent/init`, `/api/agent/feed`, etc., receiving live payloads with zero UI changes!

---

## 5. Ownership & File Safety Boundaries

### 🚫 Files You Should NEVER Modify (Frontend Domain)
- `src/components/**` (All React visual components)
- `src/components/ui/**` (Design System UI library)
- `app/globals.css` (CSS variables & theme engine)
- `app/page.tsx` (Main layout controller)
- `src/config/navigation.ts` (Navigation configuration)

### ✅ Files You OWN (Backend Domain)
- `app/api/**` (API routes)
- `src/agent/**` (Discovery, clustering, 100-pt editorial scoring, writer, quality check)
- `src/ai/**` (LLM Provider abstraction & Gemini integration)
- `src/db/**` (Supabase client & SQL queries)
- `src/memory/**` (Breeth memory retrieval layer)
- `src/schemas/**` (Zod runtime validation schemas)
- `supabase/**` (Database migrations)
- `.github/workflows/**` (Vercel Cron & autonomous worker GitHub Actions)

### 🤝 Shared Contracts (Requires Coordination)
- `src/types/phoenixz.ts` (Shared payload contracts — do not break existing property names!)

---

## 6. How to Test Integration

1. Start local development server:
   ```bash
   npm run dev
   ```
2. Verify frontend renders at `http://localhost:3000`.
3. Set `USE_MOCK_DATA = false` in `src/services/agentApi.ts`.
4. Click **RUN CYCLE** in the top navigation bar or trigger `POST /api/internal/cycle`.
5. Observe live published posts rendering inside `LiveFeed.tsx` with the 4 Visual Pillars (*THE MOVE*, *THE ANGLE*, *THE PRESSURE*, *PHEONIXZ TAKE*).

---

## 7. Backend Completion Checklist

- [ ] Install `@supabase/supabase-js`, `zod`, `@google/generative-ai` in `package.json`.
- [ ] Create Supabase database tables (`agents`, `candidates`, `decisions`, `posts`, `runs`, `source_status`).
- [ ] Implement Zod schemas under `src/schemas/`.
- [ ] Implement LLM Provider interface & Gemini 100-pt scoring prompt in `src/agent/editorial.ts`.
- [ ] Implement Breeth memory layer under `src/memory/breeth.ts`.
- [ ] Implement route handlers:
  - [ ] `POST /api/agent/init`
  - [ ] `GET /api/agent/feed`
  - [ ] `POST /api/internal/cycle` (with `CRON_SECRET` validation)
- [ ] Toggle `USE_MOCK_DATA = false` in `src/services/agentApi.ts` and verify end-to-end flow.
