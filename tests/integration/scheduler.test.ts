import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  executeSchedulerTick,
  startAutonomousScheduler,
  stopAutonomousScheduler,
  getSchedulerIntervalMs,
  isSchedulerEnabled,
} from '@/agent/scheduler';
import * as cycleModule from '@/agent/cycle';
import * as runsDb from '@/db/runs';
import { db } from '@/db/client';

vi.mock('@/agent/cycle');
vi.mock('@/db/runs');
vi.mock('@/db/client', () => ({
  db: { from: vi.fn() },
}));

const AGENT_A = '00000000-0000-0000-0000-00000000000a';
const AGENT_B = '00000000-0000-0000-0000-00000000000b';

/** Mocks db.from('agents').select(...).eq('active', true) */
function mockActiveAgents(agents: Array<{ id: string; name: string; domain: string }>) {
  vi.mocked(db.from).mockReturnValue({
    select: () => ({
      eq: () => Promise.resolve({ data: agents, error: null }),
    }),
  } as unknown as ReturnType<typeof db.from>);
}

const EMPTY_RESULT = { candidatesFound: 0, published: 0, watched: 0, rejected: 0, errors: 0 };

describe('Autonomous Scheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stopAutonomousScheduler();
    delete process.env.AUTONOMOUS_INTERVAL_MS;
    delete process.env.AUTONOMOUS_SCHEDULER_ENABLED;
    vi.mocked(runsDb.getActiveRunForAgent).mockResolvedValue(null);
    vi.mocked(cycleModule.runAutonomousCycle).mockResolvedValue(EMPTY_RESULT);
  });

  afterEach(() => {
    stopAutonomousScheduler();
    vi.useRealTimers();
  });

  describe('Interval configuration', () => {
    it('defaults to 60000ms when AUTONOMOUS_INTERVAL_MS is unset', () => {
      expect(getSchedulerIntervalMs()).toBe(60_000);
    });

    it('reads AUTONOMOUS_INTERVAL_MS from the environment', () => {
      process.env.AUTONOMOUS_INTERVAL_MS = '120000';
      expect(getSchedulerIntervalMs()).toBe(120_000);
    });

    it('falls back to the default for invalid or non-positive values', () => {
      process.env.AUTONOMOUS_INTERVAL_MS = 'not-a-number';
      expect(getSchedulerIntervalMs()).toBe(60_000);
      process.env.AUTONOMOUS_INTERVAL_MS = '0';
      expect(getSchedulerIntervalMs()).toBe(60_000);
    });

    it('is enabled by default and disabled only by explicit false', () => {
      expect(isSchedulerEnabled()).toBe(true);
      process.env.AUTONOMOUS_SCHEDULER_ENABLED = 'false';
      expect(isSchedulerEnabled()).toBe(false);
    });
  });

  describe('Recurring execution without further API requests', () => {
    it('runs a second cycle automatically after the configured interval elapses', async () => {
      vi.useFakeTimers();
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);

      startAutonomousScheduler(60_000);

      // Cycle 1 — first tick fires after the 5s startup delay.
      await vi.advanceTimersByTimeAsync(5_000);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(1);

      // Scheduler waits — no cycle mid-interval.
      await vi.advanceTimersByTimeAsync(30_000);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(1);

      // Cycle 2 — triggered by the interval alone, with no additional request.
      await vi.advanceTimersByTimeAsync(30_000);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(2);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledWith(AGENT_A);

      // Cycle 3 — continues indefinitely.
      await vi.advanceTimersByTimeAsync(60_000);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(3);
    });

    it('does not start a second interval when called twice (idempotent)', async () => {
      vi.useFakeTimers();
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);

      startAutonomousScheduler(60_000);
      startAutonomousScheduler(60_000);

      await vi.advanceTimersByTimeAsync(65_000);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(2);
    });

    it('does not schedule anything when AUTONOMOUS_SCHEDULER_ENABLED=false', async () => {
      vi.useFakeTimers();
      process.env.AUTONOMOUS_SCHEDULER_ENABLED = 'false';
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);

      startAutonomousScheduler(60_000);

      await vi.advanceTimersByTimeAsync(180_000);
      expect(cycleModule.runAutonomousCycle).not.toHaveBeenCalled();
    });
  });

  describe('No overlapping cycle for the same agent', () => {
    it('skips an agent that already has an active run', async () => {
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);
      vi.mocked(runsDb.getActiveRunForAgent).mockResolvedValue({
        id: 'run-active-1',
        agent_id: AGENT_A,
        started_at: new Date().toISOString(),
        finished_at: null,
        status: 'running',
        candidates_found: 0,
        published: 0,
        watched: 0,
        rejected: 0,
        error: null,
        created_at: new Date().toISOString(),
      });

      await executeSchedulerTick();

      expect(cycleModule.runAutonomousCycle).not.toHaveBeenCalled();
    });

    it('never executes two concurrent ticks', async () => {
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);

      let release: () => void = () => {};
      vi.mocked(cycleModule.runAutonomousCycle).mockImplementation(
        () => new Promise((resolve) => {
          release = () => resolve(EMPTY_RESULT);
        })
      );

      const first = executeSchedulerTick();
      await Promise.resolve();

      // Second tick lands while the first cycle is still in flight.
      await executeSchedulerTick();
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(1);

      release();
      await first;
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(1);
    });

    it('allows the next tick once the in-flight cycle has finished', async () => {
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);

      await executeSchedulerTick();
      await executeSchedulerTick();

      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(2);
    });
  });

  describe('Failure isolation', () => {
    it('logs a failed cycle and still runs the next scheduled tick', async () => {
      vi.useFakeTimers();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);

      vi.mocked(cycleModule.runAutonomousCycle)
        .mockRejectedValueOnce(new Error('LLM provider unavailable'))
        .mockResolvedValue(EMPTY_RESULT);

      startAutonomousScheduler(60_000);

      await vi.advanceTimersByTimeAsync(5_000);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalled();

      // The failure did not kill the interval.
      await vi.advanceTimersByTimeAsync(60_000);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledTimes(2);

      errorSpy.mockRestore();
    });

    it('isolates one agent failure from other agents in the same tick', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockActiveAgents([
        { id: AGENT_A, name: 'Agent A', domain: 'AI Product Strategy' },
        { id: AGENT_B, name: 'Agent B', domain: 'Developer Tooling' },
      ]);

      vi.mocked(cycleModule.runAutonomousCycle).mockImplementation(async (agentId: string) => {
        if (agentId === AGENT_A) throw new Error('Agent A cycle exploded');
        return EMPTY_RESULT;
      });

      await executeSchedulerTick();

      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledWith(AGENT_A);
      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledWith(AGENT_B);
      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });

    it('survives a database error while listing active agents', async () => {
      vi.mocked(db.from).mockReturnValue({
        select: () => ({
          eq: () => Promise.resolve({ data: null, error: { message: 'connection refused' } }),
        }),
      } as unknown as ReturnType<typeof db.from>);

      await expect(executeSchedulerTick()).resolves.toBeUndefined();
      expect(cycleModule.runAutonomousCycle).not.toHaveBeenCalled();
    });
  });

  describe('Pipeline reuse', () => {
    it('delegates to runAutonomousCycle rather than reimplementing the pipeline', async () => {
      mockActiveAgents([{ id: AGENT_A, name: 'PheonixZ', domain: 'AI Product Strategy' }]);

      await executeSchedulerTick();

      expect(cycleModule.runAutonomousCycle).toHaveBeenCalledExactlyOnceWith(AGENT_A);
    });
  });
});
