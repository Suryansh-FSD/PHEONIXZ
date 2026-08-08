export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startAutonomousScheduler } = await import('@/agent/scheduler');
    startAutonomousScheduler();
  }
}
