import { getLastPublishedAt } from '@/db/posts';

/**
 * Returns true if publishing is allowed (cooldown has elapsed).
 * Returns false if within the cooldown window.
 */
export async function isPublishingAllowed(agentId: string): Promise<boolean> {
  const lastPublished = await getLastPublishedAt(agentId);
  if (!lastPublished) return true; // No posts yet — always allowed

  const cooldownHours = parseFloat(process.env.PUBLISH_COOLDOWN_HOURS ?? '2');
  const cooldownMinutes = parseFloat(
    process.env.PUBLISH_COOLDOWN_MINUTES ?? String(cooldownHours * 60)
  );

  const cooldownMs = cooldownMinutes * 60 * 1000;
  const elapsed = Date.now() - lastPublished.getTime();

  if (elapsed < cooldownMs) {
    const remainingSec = Math.ceil((cooldownMs - elapsed) / 1000);
    console.log(`[rate-limit] Publishing blocked for agent ${agentId}. ${remainingSec}s remaining in cooldown.`);
    return false;
  }

  return true;
}
