-- ============================================================
-- PHEONIXZ — Security Migration: Row Level Security (RLS)
-- Migration: 002_security_rls.sql
-- ============================================================

-- Enable RLS on all 6 operational tables
alter table agents enable row level security;
alter table candidates enable row level security;
alter table decisions enable row level security;
alter table posts enable row level security;
alter table runs enable row level security;
alter table source_status enable row level security;

-- Note: The application accesses Supabase exclusively from server-side Node environment
-- using SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS policies automatically.
-- By default, enabling RLS with no public policies blocks all direct unauthenticated
-- and anon client access to internal tables.
-- Public feed access is handled safely via GET /api/agent/feed endpoint.
