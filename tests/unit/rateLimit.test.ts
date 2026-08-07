import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isPublishingAllowed } from '@/agent/rateLimit';
import * as postsDb from '@/db/posts';

vi.mock('@/db/posts', () => ({
  getLastPublishedAt: vi.fn(),
}));

describe('Rate Limiter Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows publishing when no post has ever been published', async () => {
    vi.mocked(postsDb.getLastPublishedAt).mockResolvedValue(null);

    const allowed = await isPublishingAllowed('agent-123');
    expect(allowed).toBe(true);
  });

  it('blocks publishing when a post was published recently (< 2 hours ago)', async () => {
    const recentDate = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
    vi.mocked(postsDb.getLastPublishedAt).mockResolvedValue(recentDate);

    const allowed = await isPublishingAllowed('agent-123');
    expect(allowed).toBe(false);
  });

  it('allows publishing when previous post is older than cooldown (> 2 hours ago)', async () => {
    const oldDate = new Date(Date.now() - 130 * 60 * 1000); // 2 hours 10 mins ago
    vi.mocked(postsDb.getLastPublishedAt).mockResolvedValue(oldDate);

    const allowed = await isPublishingAllowed('agent-123');
    expect(allowed).toBe(true);
  });
});
