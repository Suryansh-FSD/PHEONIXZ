# PHEONIXZ — Architecture & Implementation Blueprint

> Version: 1.0  
> Purpose: Hackathon implementation blueprint for an autonomous AI Product Analyst  
> Primary development environment: Antigravity  
> Runtime AI: Gemini API  
> AI fallback: Agent Router API  
> Engineering reviewer: Claude Code  
> Parallel agent management: Superset Agent Manager  
> Cognitive memory: Breeth  
> Operational database: Supabase  
> Scheduler: GitHub Actions  
> Application: Next.js + TypeScript + Tailwind  
> Deployment: Vercel

---

# 1. Product Definition

## 1.1 Product

PheonixZ is an autonomous AI Product Analyst for AI product strategy and competitive intelligence.

PheonixZ does not behave like a generic AI news bot.

Its central question is:

> **What happened, and what does it force competitors to do next?**

The core editorial lens is:

- pricing moves
- model/product launches
- feature parity
- developer experience changes
- partnerships/distribution
- capability and positioning shifts

Core belief:

> **A feature isn't a story. A shift in leverage is.**

PheonixZ should be analytical, understated, skeptical of hype, and consistent.

Avoid generic hype language such as:

- huge
- insane
- game-changer
- this changes everything

Every published item follows:

1. THE MOVE — what happened
2. THE ANGLE — why it is a product/market decision
3. THE PRESSURE — who has to respond and how
4. PHEONIXZ'S TAKE — calibrated analyst judgment

---

# 2. System Goal

The evaluator should be able to:

1. Initialize PheonixZ once.
2. Leave the application alone.
3. Return later and see that PheonixZ has continued operating.
4. Inspect what it observed.
5. Inspect what it rejected.
6. Inspect what it watched.
7. Inspect what it published.
8. Understand why something was published.
9. See evidence of memory and competitive-thread reasoning.

The system must therefore be autonomous, append-oriented, observable, and resilient.

---

# 3. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │      DATA SOURCES    │
                         │                      │
                         │ RSS / APIs / Feeds   │
                         │ Official product     │
                         │ blogs / changelogs   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      DISCOVERY       │
                         │                      │
                         │ Fetch                │
                         │ Normalize            │
                         │ Classify             │
                         │ Deduplicate          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      CANDIDATES      │
                         │      SUPABASE        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                  ┌──────────────────────────────────┐
                  │        MEMORY RETRIEVAL          │
                  │             BREETH              │
                  │                                  │
                  │ Company history                  │
                  │ Competitive threads              │
                  │ Strategic patterns               │
                  │ PheonixZ judgments                │
                  └────────────────┬─────────────────┘
                                   │
                                   ▼
                  ┌──────────────────────────────────┐
                  │        EDITORIAL ENGINE           │
                  │                                  │
                  │ Gemini API                       │
                  │ Agent Router fallback            │
                  │                                  │
                  │ Market Pressure       /25        │
                  │ Strategic Signal      /20        │
                  │ Evidence Quality      /20        │
                  │ Timeliness            /15        │
                  │ Persona Fit           /10        │
                  │ Pattern Continuity    /10        │
                  └────────────────┬─────────────────┘
                                   │
                     ┌─────────────┼──────────────┐
                     │             │              │
                     ▼             ▼              ▼
                  REJECT         WATCH         PUBLISH
                                                   │
                                                   ▼
                                          ┌────────────────┐
                                          │     WRITER     │
                                          │ Gemini / Router│
                                          └───────┬────────┘
                                                  │
                                                  ▼
                                          ┌────────────────┐
                                          │ QUALITY CHECK  │
                                          │                │
                                          │ Schema         │
                                          │ Evidence       │
                                          │ Persona        │
                                          │ Hype filter    │
                                          │ Duplicate      │
                                          └───────┬────────┘
                                                  │
                                             PASS / FAIL
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │  SUPABASE   │
                                           │             │
                                           │ posts       │
                                           │ decisions   │
                                           │ runs        │
                                           └──────┬──────┘
                                                  │
                                                  ▼
                                               BREETH
                                                  │
                                                  ▼
                                           NEXT CYCLE

             ┌────────────────────────────────────────────┐
             │             GITHUB ACTIONS                 │
             │                every ~15m                  │
             │                                             │
             │ POST /api/internal/cycle                   │
             └────────────────────┬───────────────────────┘
                                  │
                                  ▼
                         runAutonomousCycle()
```

---

# 4. Core Architectural Principle

Separate:

## Operational truth

Supabase answers:

> What happened in the system?

Stores:

- agents
- candidates
- decisions
- posts
- runs
- source status

## Cognitive memory

Breeth answers:

> What does PheonixZ remember about what happened?

Stores/retrieves:

- company history
- competitive relationships
- strategic patterns
- competitive threads
- PheonixZ's previous judgments
- relevant prior episodes

Do not duplicate all Breeth memory into a second vector database.

Do not use Supabase as a substitute for cognitive memory.

Do not use Breeth as the primary operational database.

---

# 5. Runtime Components

## 5.1 Next.js

Responsibilities:

- frontend
- public API
- internal cycle endpoint
- server-side orchestration

Important endpoints:

```text
POST /api/agent/init
GET  /api/agent/feed
POST /api/internal/cycle
```

---

## 5.2 Gemini API

Primary runtime model.

Use for:

- discovery normalization
- editorial scoring
- competitive reasoning
- writing
- quality checking

Every AI call should return structured data.

Never rely on free-form model output for database writes.

---

## 5.3 Agent Router

Fallback provider.

Conceptually:

```text
Gemini
  |
  | success
  v
result

Gemini failure
  |
  v
Agent Router
  |
  v
result
```

Provider abstraction:

```ts
interface LLMProvider {
  generate<T>(
    input: unknown,
    schema: unknown
  ): Promise<T>;
}
```

The application should not depend directly on one provider's SDK throughout the codebase.

---

## 5.4 Claude Code

Claude Code is NOT the production PheonixZ brain.

Use it as:

- senior code reviewer
- debugger
- test runner
- security reviewer
- refactoring assistant
- integration reviewer

It should review the implementation created in Antigravity.

---

## 5.5 Antigravity

Primary development cockpit.

Use Antigravity for:

- repository implementation
- architecture execution
- coding
- local testing
- integration
- debugging
- prompt engineering
- deployment preparation

Antigravity is a development environment, not a production dependency.

---

## 5.6 Superset

Use Superset for isolated parallel development workspaces.

Recommended logical workspaces:

```text
pheonixz-brain
pheonixz-infra
pheonixz-frontend
pheonixz-review
```

All work must eventually integrate into `develop`, then `main`.

---

## 5.7 Breeth

Cognitive memory layer.

Recommended memory categories:

```text
competitive_move
competitive_response
strategic_pattern
pheonixz_judgment
competitive_thread
```

The application should retrieve relevant memory before editorial scoring.

After publication or meaningful rejection, it should write/update memory.

---

## 5.8 Supabase

Primary operational database.

Recommended tables:

```text
agents
candidates
decisions
posts
runs
source_status
```

---

## 5.9 GitHub Actions

Autonomous scheduler.

Target:

```text
every ~15 minutes
```

Workflow:

```text
GitHub Actions
    ↓
POST /api/internal/cycle
    ↓
authenticate with CRON_SECRET
    ↓
runAutonomousCycle(agentId)
```

The frontend must never be required for PheonixZ to operate.

---

# 6. Database Model

## agents

```text
id
name
domain
persona_json
active
created_at
```

## candidates

```text
id
agent_id
title
summary
company
move_type
url
source
source_id
discovered_at
content_hash
created_at
```

Move types:

```text
launch
pricing
feature_parity
partnership
dx_change
```

## decisions

```text
id
candidate_id
agent_id

market_pressure
strategic_signal
evidence_quality
timeliness
persona_fit
pattern_continuity

score
decision
reason
scored_breakdown_json

created_at
```

Decision values:

```text
publish
watch
reject
```

## posts

```text
id
agent_id
related_candidate_id

move_text
angle_text
pressure_text
take_text

text
rationale
sources

created_at
```

## runs

```text
id
agent_id
started_at
finished_at
status

candidates_found
published
watched
rejected

error
created_at
```

## source_status

```text
id
source
last_success
last_failure
consecutive_failures
status
updated_at
```

---

# 7. Editorial Rubric

```text
Market Pressure       /25
Strategic Signal      /20
Evidence Quality      /20
Timeliness            /15
Persona Fit            /10
Pattern Continuity     /10
--------------------------------
TOTAL                 /100
```

Thresholds:

```text
<55      REJECT
55-71    WATCH
72+      PUBLISH
```

Rate limiter:

> Never publish more than one post every few hours, regardless of how many candidates score above the threshold.

Cluster duplicate coverage before scoring.

Example:

```text
Source A ─┐
Source B ─┼── same pricing change ──> ONE candidate
Source C ─┘
```

---

# 8. Core Agent Cycle

The central application function:

```ts
runAutonomousCycle(agentId)
```

Pipeline:

```text
1. create run
2. fetch sources
3. normalize source items
4. classify product moves
5. deduplicate / cluster
6. store candidates
7. retrieve Breeth memory
8. editorial score
9. persist decisions
10. enforce rate limit
11. generate approved post
12. quality check
13. publish to Supabase
14. update Breeth memory
15. update run
16. return cycle result
```

Expected result:

```ts
type CycleResult = {
  candidatesFound: number;
  published: number;
  watched: number;
  rejected: number;
  errors: number;
};
```

---

# 9. AI Pipeline

## Call 1 — Discovery Normalizer

Input:

- source title
- source body/summary
- URL
- publication date

Output:

```json
{
  "isProductMove": true,
  "company": "Example",
  "moveType": "pricing",
  "title": "Example changes API pricing",
  "summary": "...",
  "claims": ["..."],
  "evidenceQuality": 18
}
```

---

## Call 2 — Editorial Judge

Input:

- candidate
- source evidence
- recent decisions
- Breeth memory

Output:

```json
{
  "marketPressure": 23,
  "strategicSignal": 18,
  "evidenceQuality": 20,
  "timeliness": 14,
  "personaFit": 10,
  "patternContinuity": 8,
  "total": 93,
  "decision": "publish",
  "reason": "..."
}
```

The application should verify the score:

```text
total =
marketPressure +
strategicSignal +
evidenceQuality +
timeliness +
personaFit +
patternContinuity
```

Do not blindly trust a model-generated total.

---

## Call 3 — Writer

Input:

- candidate
- decision
- memory context

Output:

```json
{
  "move": "...",
  "angle": "...",
  "pressure": "...",
  "take": "..."
}
```

---

## Call 4 — Quality Checker

Checks:

- JSON validity
- factual grounding
- source availability
- PheonixZ persona
- banned hype language
- duplicate content
- unsupported claims
- actual competitive pressure
- presence of all four sections

Output:

```json
{
  "pass": true,
  "issues": [],
  "revisedText": null
}
```

---

# 10. Frontend Architecture

Dashboard hierarchy:

```text
HEADER
  ↓
STATUS + UPTIME
  ↓
STAT STRIP
  ↓
LIVE FEED
  ↓
DECISION LOG
  ↓
COMPETITIVE THREADS
  ↓
ACTIVITY / SOURCE STATUS
```

## Header

Show:

```text
PHEONIXZ
Autonomous Product Analyst
● LIVE
Uptime
Last scan
```

## Stat strip

```text
Observed
Rejected
Watching
Published
```

## Feed

Each post:

```text
THE MOVE
THE ANGLE
THE PRESSURE
PHEONIXZ'S TAKE
```

Expandable:

```text
Why this got published
```

Show:

- score
- score breakdown
- rationale
- sources

## Decision Log

```text
✓ Published
⊘ Watching
✕ Rejected
```

Each decision has a concise reason.

## Competitive Thread View

Optional but high-value:

```text
Company A move
      ↓
Company B response
      ↓
PheonixZ's pattern analysis
```

## Activity

Show structured activity, not hidden chain-of-thought.

Never expose private reasoning tokens.

---

# 11. API Contracts

## POST /api/agent/init

Request:

```json
{
  "persona": {
    "name": "PheonixZ",
    "domain": "AI Product Strategy"
  }
}
```

Response:

```json
{
  "agentId": "abc-123"
}
```

Should be idempotent-safe.

---

## GET /api/agent/feed?agentId=abc-123

Response:

```json
{
  "posts": [
    {
      "id": "p7",
      "createdAt": "2026-08-07T10:30:00Z",
      "text": "...",
      "rationale": "...",
      "sources": ["https://..."]
    }
  ]
}
```

Requirements:

- newest first
- stable IDs
- ISO UTC timestamps
- empty feed returns `{ "posts": [] }`
- previously returned posts do not disappear or mutate

---

## POST /api/internal/cycle

Protected by:

```text
CRON_SECRET
```

Body:

```json
{
  "agentId": "abc-123"
}
```

Response:

```json
{
  "success": true,
  "candidatesFound": 8,
  "published": 1,
  "watched": 2,
  "rejected": 5
}
```

---

# 12. Repository Structure

```text
pheonixz/
├── app/
│   ├── api/
│   │   ├── agent/
│   │   │   ├── init/
│   │   │   └── feed/
│   │   └── internal/
│   │       └── cycle/
│   ├── dashboard/
│   └── page.tsx
│
├── src/
│   ├── agent/
│   │   ├── cycle.ts
│   │   ├── discovery.ts
│   │   ├── clustering.ts
│   │   ├── editorial.ts
│   │   ├── memory.ts
│   │   ├── writer.ts
│   │   └── quality.ts
│   │
│   ├── ai/
│   │   ├── provider.ts
│   │   ├── gemini.ts
│   │   └── agent-router.ts
│   │
│   ├── memory/
│   │   └── breeth.ts
│   │
│   ├── db/
│   │   └── supabase.ts
│   │
│   ├── schemas/
│   │   ├── candidate.ts
│   │   ├── decision.ts
│   │   ├── post.ts
│   │   ├── memory.ts
│   │   └── cycle.ts
│   │
│   └── prompts/
│       ├── discovery.ts
│       ├── editorial.ts
│       ├── writer.ts
│       └── quality.ts
│
├── supabase/
│   └── migrations/
│
├── .github/
│   └── workflows/
│       └── autonomous-worker.yml
│
├── docs/
├── .env.example
├── README.md
└── PROMPTS.md
```

---

# 13. Environment Variables

```env
GEMINI_API_KEY=

AGENT_ROUTER_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

BREETH_API_KEY=
BREETH_PROJECT_ID=

CRON_SECRET=

NEXT_PUBLIC_APP_URL=
```

Never expose server secrets through `NEXT_PUBLIC_*`.

Never commit `.env.local`.

---

# 14. Team Phase Plan

## PHASE 0 — Setup & Contract Lock

Everyone:

- GitHub
- Supabase
- Breeth
- Gemini
- Agent Router
- Antigravity
- Claude Code
- Superset
- Next.js skeleton
- environment variables

Then lock:

- database schema
- TypeScript interfaces
- API contracts
- cycle contract
- persona
- editorial rubric

No feature work before this is stable.

---

# PHASE 1 — Backend Foundation

### Backend teammate

Build:

- Supabase schema
- database client
- agents CRUD
- candidates CRUD
- decisions CRUD
- posts CRUD
- runs
- source status
- `/init`
- `/feed`
- `/internal/cycle` skeleton

Deliverable:

```text
API + database works with fake data.
```

### Frontend teammate

Build against fake data:

- dashboard shell
- header
- stat strip
- feed cards
- decision log
- responsive layout

Deliverable:

```text
Frontend works without backend.
```

---

# PHASE 2 — Agent Brain

### Backend / Agent teammate

Build:

1. source adapters
2. discovery normalization
3. clustering
4. Gemini provider
5. Agent Router fallback
6. editorial scoring
7. Zod validation
8. rate limiting

Deliverable:

```text
Fake candidates
→ editorial decision
→ valid structured output
```

No publishing yet.

---

# PHASE 3 — Memory

Build Breeth integration:

```text
retrieveMemory()
storeMemory()
findCompetitiveThread()
```

Memory flow:

```text
candidate
   ↓
retrieve relevant memory
   ↓
editorial model
   ↓
decision
   ↓
store meaningful memory
```

Deliverable:

Same story seen twice should not become two identical posts.

---

# PHASE 4 — Writer + Quality

Build:

```text
decision
  ↓
writer
  ↓
quality checker
  ↓
publish/reject
```

Deliverable:

One complete candidate can travel through the entire pipeline.

---

# PHASE 5 — Full Integration

Connect:

```text
Discovery
→ Clustering
→ Memory
→ Editorial
→ Decision
→ Writer
→ Quality
→ Supabase
→ Breeth
→ Feed
```

This is the **Hour 18 checkpoint**.

Stop adding features until this works end-to-end.

---

# PHASE 6 — Autonomy

Add GitHub Actions.

Test:

```text
/init
   ↓
leave system alone
   ↓
wait
   ↓
new run
   ↓
new decision
   ↓
new post
```

The frontend must not be opened.

---

# PHASE 7 — Frontend Intelligence

Once backend is stable, connect real data.

Add:

- live stats
- feed
- expandable rationale
- score bars
- decision log
- source activity
- competitive threads

Optional only if time remains:

- competitive map
- advanced filters
- animations

---

# PHASE 8 — Reliability

Break:

- Gemini JSON
- Agent Router
- Breeth
- RSS source
- duplicate worker
- empty cycle
- timeout
- malformed candidate
- repeated `/feed`
- rate limit

Expected behavior:

```text
failure
  ↓
recover / skip / retry
  ↓
cycle continues
```

No silent fake success.

---

# PHASE 9 — Production

Deploy:

```text
Next.js → Vercel
Supabase → production
GitHub Actions → production API
Breeth → production project
```

Then test from a clean browser.

---

# PHASE 10 — Demo Freeze

Demo sequence:

1. Show PheonixZ uptime.
2. Show observed/rejected/watching/published.
3. Open a published post.
4. Show why it was selected.
5. Show decision log.
6. Show competitive memory/thread.
7. Explain autonomous operation.
8. Close with the editorial thesis.

Do not demo architecture first.

---

# 15. Hard Rules

## Never

- expose API keys
- expose private chain-of-thought
- fake statistics
- fake uptime
- fake activity
- hardcode published posts as autonomous output
- let the LLM execute arbitrary SQL
- add unnecessary dependencies
- build a vector database
- build a chatbot
- build multi-agent runtime orchestration
- add authentication unless required
- add social posting
- add image generation

## Always

- validate model output
- store decisions
- store rejections
- deduplicate candidates
- rate-limit publishing
- log runs
- track source failures
- keep the frontend independent of the worker
- keep runtime provider abstraction
- test with fake candidates before live sources

---

# 16. 40-Hour Milestones

```text
H0–2      Setup + contracts
H2–8      Parallel foundation
H8–14     Agent + memory + frontend
H14–18    FULL INTEGRATION
H18–22    AUTONOMY PROOF
H22–26    MEMORY PROOF
H26–30    DECISION LEDGER
H30–33    FAILURE TESTING
H33–35    PRODUCTION DEPLOY
H35–37    JUDGE SIMULATION
H37–39    SUBMISSION
H39–40    FREEZE
```

---

# 17. Definition of Done

PheonixZ is hackathon-ready when:

- `/init` works
- `/feed` works
- GitHub Actions triggers the cycle
- the cycle runs without the frontend open
- at least one real source works
- candidates are persisted
- decisions are persisted
- rejected candidates are visible
- published posts are persisted
- score breakdowns are real
- Breeth memory is used
- duplicate stories are handled
- competitive threads can be demonstrated
- Gemini failures do not destroy the cycle
- malformed AI output is rejected/retried
- source failures are isolated
- frontend displays real data
- production deployment works
- repeated `/feed` calls are stable
- no secrets are committed

---

# 18. Primary Product Differentiator

The feature to protect above everything else:

```text
MOVE
  ↓
COMPETITIVE PRESSURE
  ↓
PHEONIXZ JUDGMENT
  ↓
MEMORY
  ↓
FUTURE RESPONSE
```

The system should make a judge think:

> "This isn't summarizing what companies said. It is forming a view about what companies now have to do."

That is PheonixZ.
