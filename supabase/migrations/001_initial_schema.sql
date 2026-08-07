-- ============================================================
-- PHEONIXZ — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- agents: registered PheonixZ personas
create table if not exists agents (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  domain       text not null,
  persona_json jsonb not null default '{}',
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- candidates: discovered product move signals
create table if not exists candidates (
  id            uuid primary key default gen_random_uuid(),
  agent_id      uuid not null references agents(id) on delete cascade,
  title         text not null,
  summary       text not null,
  company       text not null,
  move_type     text not null check (move_type in ('launch','pricing','feature_parity','partnership','dx_change')),
  url           text not null,
  source        text not null,
  source_id     text not null,
  discovered_at timestamptz not null,
  content_hash  text not null unique,
  created_at    timestamptz not null default now()
);

create index if not exists idx_candidates_agent_id on candidates(agent_id);
create index if not exists idx_candidates_created_at on candidates(created_at desc);

-- decisions: editorial scoring results for every candidate
create table if not exists decisions (
  id                    uuid primary key default gen_random_uuid(),
  candidate_id          uuid not null references candidates(id) on delete cascade,
  agent_id              uuid not null references agents(id) on delete cascade,
  market_pressure       int not null check (market_pressure between 0 and 25),
  strategic_signal      int not null check (strategic_signal between 0 and 20),
  evidence_quality      int not null check (evidence_quality between 0 and 20),
  timeliness            int not null check (timeliness between 0 and 15),
  persona_fit           int not null check (persona_fit between 0 and 10),
  pattern_continuity    int not null check (pattern_continuity between 0 and 10),
  score                 int not null check (score between 0 and 100),
  decision              text not null check (decision in ('publish','watch','reject')),
  reason                text not null,
  scored_breakdown_json jsonb not null,
  created_at            timestamptz not null default now()
);

create index if not exists idx_decisions_agent_id on decisions(agent_id);
create index if not exists idx_decisions_candidate_id on decisions(candidate_id);
create index if not exists idx_decisions_created_at on decisions(created_at desc);

-- posts: published PheonixZ analysis pieces
create table if not exists posts (
  id                   uuid primary key default gen_random_uuid(),
  agent_id             uuid not null references agents(id) on delete cascade,
  related_candidate_id uuid references candidates(id) on delete set null,
  move_text            text not null,
  angle_text           text not null,
  pressure_text        text not null,
  take_text            text not null,
  text                 text not null,
  rationale            text not null,
  sources              text[] not null default '{}',
  created_at           timestamptz not null default now()
);

create index if not exists idx_posts_agent_id on posts(agent_id);
create index if not exists idx_posts_created_at on posts(created_at desc);

-- runs: audit log of every autonomous cycle
create table if not exists runs (
  id               uuid primary key default gen_random_uuid(),
  agent_id         uuid not null references agents(id) on delete cascade,
  started_at       timestamptz not null default now(),
  finished_at      timestamptz,
  status           text not null default 'running' check (status in ('running','completed','failed')),
  candidates_found int not null default 0,
  published        int not null default 0,
  watched          int not null default 0,
  rejected         int not null default 0,
  error            text,
  created_at       timestamptz not null default now()
);

create index if not exists idx_runs_agent_id on runs(agent_id);
create index if not exists idx_runs_created_at on runs(created_at desc);

-- source_status: health tracking for each RSS/API source
create table if not exists source_status (
  id                   uuid primary key default gen_random_uuid(),
  source               text not null unique,
  last_success         timestamptz,
  last_failure         timestamptz,
  consecutive_failures int not null default 0,
  status               text not null default 'ok' check (status in ('ok','degraded','dead')),
  updated_at           timestamptz not null default now()
);
