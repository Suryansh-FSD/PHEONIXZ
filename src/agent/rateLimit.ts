import { getLastPublishedAt } from '@/db/posts';

const DEFAULT_COOLDOWN_HOURS = parseInt(process.env.PUBLISH_COOLDOWN_HOURS ?? '2', 10);

/**
 * Returns true if publishing is allowed (cooldown has elapsed).
 * Returns false if within the cooldown window.
 */
export async function isPublishingAllowed(agentId: string): Promise<boolean> {
  const lastPublished = await getLastPublishedAt(agentId);
  if (!lastPublished) return true; // No posts yet — always allowed

  const cooldownMs = DEFAULT_COOLDOWN_HOURS * 60 * 60 * 1000;
  const elapsed = Date.now() - lastPublished.getTime();

  if (elapsed < cooldownMs) {
    const remainingMin = Math.ceil((cooldownMs - elapsed) / 60_000);
    console.log(`[rate-limit] Publishing blocked. ${remainingMin}min remaining in cooldown.`);
    return false;
  }

  return true;
}
