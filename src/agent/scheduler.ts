import { db } from '@/db/client';
import { runAutonomousCycle } from './cycle';
import { getActiveRunForAgent } from '@/db/runs';
import { createAgent } from '@/db/agents';

const DEFAULT_INTERVAL_MS = 60_000;
const FIRST_TICK_DELAY_MS = 5_000;

let schedulerInterval: NodeJS.Timeout | null = null;
let isExecutingTick = false;
const inFlightAgents = new Set<string>();

/**
 * Interval between scheduler ticks, from AUTONOMOUS_INTERVAL_MS.
 */
export function getSchedulerIntervalMs(): number {
  const parsed = Number(process.env.AUTONOMOUS_INTERVAL_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_INTERVAL_MS;
}

/**
 * The in-process scheduler is on by default. Set AUTONOMOUS_SCHEDULER_ENABLED=false
 * to rely solely on external triggers (Vercel Cron / GitHub Actions).
 */
export function isSchedulerEnabled(): boolean {
  return process.env.AUTONOMOUS_SCHEDULER_ENABLED !== 'false';
}

/**
 * Executes one tick of the background scheduler.
 * Queries all active agents and runs cycles for eligible agents.
 */
export async function executeSchedulerTick(): Promise<void> {
  if (isExecutingTick) return;
  isExecutingTick = true;

  try {
    const { data, error } = await db
      .from('agents')
      .select('id, name, domain')
      .eq('active', true);

    let activeAgents = data;

    if (error || !activeAgents || activeAgents.length === 0) {
      try {
        const defaultAgent = await createAgent({ name: 'PhoenixZ', domain: 'AI/Technology' });
        activeAgents = [{ id: defaultAgent.id, name: defaultAgent.name, domain: defaultAgent.domain }];
      } catch {
        return;
      }
    }

    for (const agent of activeAgents) {
      // Overlap guard — the same agent never executes two cycles at once.
      if (inFlightAgents.has(agent.id)) {
        console.log(`[scheduler] Agent "${agent.name}" (${agent.id}) cycle already in flight. Skipping.`);
        continue;
      }
      inFlightAgents.add(agent.id);

      try {
        const activeRun = await getActiveRunForAgent(agent.id);
        if (activeRun) {
          console.log(`[scheduler] Agent "${agent.name}" (${agent.id}) has active run ${activeRun.id}. Skipping.`);
          continue;
        }

        console.log(`[scheduler] Triggering autonomous cycle for agent "${agent.name}" (${agent.id})...`);
        const result = await runAutonomousCycle(agent.id);
        console.log(`[scheduler] Cycle complete for agent "${agent.name}":`, result);
      } catch (err) {
        // Failure isolation — log and continue; the next scheduled tick still runs.
        console.error(`[scheduler] Cycle failed for agent "${agent.name}":`, err);
      } finally {
        inFlightAgents.delete(agent.id);
      }
    }
  } catch (err) {
    console.error('[scheduler] Tick failed:', err);
  } finally {
    isExecutingTick = false;
  }
}

/**
 * Starts the durable background scheduler in Node.js server runtime.
 * Idempotent — will not start multiple intervals.
 */
export function startAutonomousScheduler(intervalMs = getSchedulerIntervalMs()): void {
  if (schedulerInterval) return;

  if (!isSchedulerEnabled()) {
    console.log('[scheduler] Disabled via AUTONOMOUS_SCHEDULER_ENABLED=false. Relying on external cron triggers.');
    return;
  }

  console.log(`[scheduler] Starting autonomous background scheduler (interval: ${intervalMs}ms)...`);

  setTimeout(() => {
    executeSchedulerTick().catch((err) => console.error('[scheduler] Initial tick error:', err));
  }, FIRST_TICK_DELAY_MS);

  schedulerInterval = setInterval(() => {
    executeSchedulerTick().catch((err) => console.error('[scheduler] Periodic tick error:', err));
  }, intervalMs);

  schedulerInterval.unref?.();
}

/**
 * Stops the background scheduler. Safe to call when not running.
 */
export function stopAutonomousScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
  inFlightAgents.clear();
}
