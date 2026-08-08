import { db } from '@/db/client';
import { runAutonomousCycle } from './cycle';
import { getActiveRunForAgent } from '@/db/runs';

let schedulerInterval: NodeJS.Timeout | null = null;
let isExecutingTick = false;

/**
 * Executes one tick of the background scheduler.
 * Queries all active agents and runs cycles for eligible agents.
 */
export async function executeSchedulerTick(): Promise<void> {
  if (isExecutingTick) return;
  isExecutingTick = true;

  try {
    const { data: activeAgents, error } = await db
      .from('agents')
      .select('id, name, domain')
      .eq('active', true);

    if (error || !activeAgents || activeAgents.length === 0) {
      return;
    }

    for (const agent of activeAgents) {
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
        console.error(`[scheduler] Cycle failed for agent "${agent.name}":`, err);
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
export function startAutonomousScheduler(intervalMs = 60_000): void {
  if (schedulerInterval) return;

  console.log(`[scheduler] Starting autonomous background scheduler (interval: ${intervalMs}ms)...`);
  
  // Run first tick after short delay (5s) to allow DB connection to initialize
  setTimeout(() => {
    executeSchedulerTick().catch((err) => console.error('[scheduler] Initial tick error:', err));
  }, 5000);

  schedulerInterval = setInterval(() => {
    executeSchedulerTick().catch((err) => console.error('[scheduler] Periodic tick error:', err));
  }, intervalMs);
}
