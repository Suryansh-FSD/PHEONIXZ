import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock next/server's after() — it's a no-op in test (background work is tested separately)
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>();
  return {
    ...actual,
    after: vi.fn((_cb: () => void) => {
      // In tests, after() is a no-op — we don't want background cycles during unit tests
    }),
  };
});

import { POST as initHandler } from '@/app/api/agent/init/route';
import { POST as cycleHandler } from '@/app/api/internal/cycle/route';
import { GET as feedHandler } from '@/app/api/agent/feed/route';
import * as agentsDb from '@/db/agents';
import * as cycleAgent from '@/agent/cycle';
import * as postsDb from '@/db/posts';

vi.mock('@/db/client', () => ({
  db: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          then: vi.fn((cb) => Promise.resolve(cb({ data: [] }))),
        }),
      }),
    }),
  },
}));

vi.mock('@/db/agents', () => ({
  getAgentByName: vi.fn(),
  createAgent: vi.fn(),
}));

vi.mock('@/agent/cycle', () => ({
  runAutonomousCycle: vi.fn(),
}));

vi.mock('@/db/posts', () => ({
  getPostsByAgent: vi.fn(),
}));

describe('API Security & Contract Tests', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV, CRON_SECRET: 'test-secret-123' };
  });

  describe('POST /api/internal/cycle - CRON_SECRET Auth Gate', () => {
    it('returns 401 when x-cron-secret header is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/internal/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: '00000000-0000-0000-0000-000000000001' }),
      });

      const res = await cycleHandler(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
      expect(cycleAgent.runAutonomousCycle).not.toHaveBeenCalled();
    });

    it('returns 401 when x-cron-secret header is incorrect', async () => {
      const req = new NextRequest('http://localhost:3000/api/internal/cycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': 'wrong-secret',
        },
        body: JSON.stringify({ agentId: '00000000-0000-0000-0000-000000000001' }),
      });

      const res = await cycleHandler(req);
      expect(res.status).toBe(401);
      expect(cycleAgent.runAutonomousCycle).not.toHaveBeenCalled();
    });

    it('allows execution when x-cron-secret matches process.env.CRON_SECRET', async () => {
      vi.mocked(cycleAgent.runAutonomousCycle).mockResolvedValue({
        candidatesFound: 2,
        published: 1,
        watched: 1,
        rejected: 0,
        errors: 0,
      });

      const req = new NextRequest('http://localhost:3000/api/internal/cycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': 'test-secret-123',
        },
        body: JSON.stringify({ agentId: '00000000-0000-0000-0000-000000000001' }),
      });

      const res = await cycleHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.candidatesFound).toBe(2);
      expect(cycleAgent.runAutonomousCycle).toHaveBeenCalledWith('00000000-0000-0000-0000-000000000001');
    });
  });

  describe('POST /api/agent/init - Evaluator Contract', () => {
    it('returns 200 with existing agent ID if agent already exists (idempotent)', async () => {
      vi.mocked(agentsDb.getAgentByName).mockResolvedValue({
        id: 'existing-agent-id',
        name: 'PheonixZ',
        domain: 'AI Product Strategy',
        persona_json: {},
        active: true,
        created_at: new Date().toISOString(),
      });

      const req = new NextRequest('http://localhost:3000/api/agent/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: { name: 'PheonixZ', domain: 'AI Product Strategy' },
        }),
      });

      const res = await initHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.agentId).toBe('existing-agent-id');
      expect(agentsDb.createAgent).not.toHaveBeenCalled();
    });

    it('returns 201 when creating a new agent — init is public per evaluator contract', async () => {
      vi.mocked(agentsDb.getAgentByName).mockResolvedValue(null);
      vi.mocked(agentsDb.createAgent).mockResolvedValue({
        id: 'newly-created-agent-id',
        name: 'Ada',
        domain: 'AI Security',
        persona_json: { name: 'Ada', domain: 'AI Security' },
        active: true,
        created_at: new Date().toISOString(),
      });

      const req = new NextRequest('http://localhost:3000/api/agent/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: { name: 'Ada', domain: 'AI Security' },
        }),
      });

      const res = await initHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.agentId).toBe('newly-created-agent-id');
      expect(agentsDb.createAgent).toHaveBeenCalled();
    });

    it('returns 400 when persona.name is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/agent/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: { domain: 'AI Security' },
        }),
      });

      const res = await initHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('persona.name');
    });

    it('returns 400 when persona.domain is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/agent/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: { name: 'Ada' },
        }),
      });

      const res = await initHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('persona.domain');
    });
  });

  describe('GET /api/agent/feed - Public Feed', () => {
    it('returns empty array { posts: [] } when no posts exist', async () => {
      vi.mocked(postsDb.getPostsByAgent).mockResolvedValue([]);

      const req = new NextRequest('http://localhost:3000/api/agent/feed?agentId=00000000-0000-0000-0000-000000000001');
      const res = await feedHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.posts).toEqual([]);
    });

    it('returns formatted posts array for valid agentId', async () => {
      vi.mocked(postsDb.getPostsByAgent).mockResolvedValue([
        {
          id: 'post-1',
          agent_id: '00000000-0000-0000-0000-000000000001',
          related_candidate_id: 'cand-1',
          move_text: 'Move section',
          angle_text: 'Angle section',
          pressure_text: 'Pressure section',
          take_text: 'Take section',
          text: 'Full text',
          rationale: 'Score 85',
          sources: ['https://example.com/source'],
          created_at: '2026-08-07T12:00:00Z',
        },
      ]);

      const req = new NextRequest('http://localhost:3000/api/agent/feed?agentId=00000000-0000-0000-0000-000000000001');
      const res = await feedHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.posts.length).toBe(1);
      expect(data.posts[0].id).toBe('post-1');
      expect(data.posts[0].move).toBe('Move section');
    });
  });
});
