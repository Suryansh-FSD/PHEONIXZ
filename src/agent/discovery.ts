import Parser from 'rss-parser';
import { withTimeout, TimeoutError } from '@/lib/timeout';
import { recordSourceSuccess, recordSourceFailure, isSourceDead } from '@/db/sourceStatus';
import { clusterAndDeduplicate, type RawItem } from './clustering';

const RSS_TIMEOUT_MS = 12_000;

// ── Registered sources ──────────────────────────────────────────────────────
export const SOURCES = [
  { name: 'openai_blog',       url: 'https://openai.com/blog/rss.xml' },
  { name: 'anthropic_news',    url: 'https://www.anthropic.com/news/rss.xml' },
  { name: 'google_deepmind',   url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'techcrunch_ai',     url: 'https://techcrunch.com/tag/ai/feed/' },
  { name: 'verge_ai',          url: 'https://www.theverge.com/rss/ai/index.xml' },
  { name: 'venturebeat_ai',    url: 'https://venturebeat.com/category/ai/feed/' },
] as const;

// ── RSS fetcher ─────────────────────────────────────────────────────────────
async function fetchRSSFeed(source: { name: string; url: string }): Promise<RawItem[]> {
  const parser = new Parser({
    timeout: RSS_TIMEOUT_MS,
    headers: { 'User-Agent': 'PhoenixZ/1.0 (autonomous AI product analyst)' },
  });

  const feed = await withTimeout(
    () => parser.parseURL(source.url),
    RSS_TIMEOUT_MS,
    `rss:${source.name}`
  );

  const items: RawItem[] = (feed.items ?? [])
    .slice(0, 20) // cap per source
    .map((item) => ({
      title:       item.title?.trim() ?? '',
      body:        (item.contentSnippet ?? item.summary ?? item.content ?? '').trim(),
      url:         item.link ?? item.guid ?? '',
      publishedAt: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
      source:      source.name,
      sourceId:    item.guid ?? item.link ?? '',
    }))
    .filter((item) => item.title.length > 5 && item.url.length > 0);

  return items;
}

// ── Main discovery function ─────────────────────────────────────────────────
/**
 * Fetches all registered sources, isolating failures per-source.
 * Returns clustered + deduplicated raw items ready for AI normalization.
 */
export async function fetchAndClusterSources(): Promise<{
  items: RawItem[];
  sourceErrors: string[];
}> {
  const allItems: RawItem[] = [];
  const sourceErrors: string[] = [];

  for (const source of SOURCES) {
    // Skip dead sources
    try {
      const dead = await isSourceDead(source.name);
      if (dead) {
        console.warn(`[discovery] Skipping dead source: ${source.name}`);
        continue;
      }
    } catch {
      // If we can't check status, proceed anyway
    }

    try {
      const items = await fetchRSSFeed(source);
      await recordSourceSuccess(source.name);
      console.log(`[discovery] ${source.name}: ${items.length} items`);
      allItems.push(...items);
    } catch (err) {
      const msg = err instanceof TimeoutError
        ? `timeout after ${RSS_TIMEOUT_MS}ms`
        : err instanceof Error ? err.message : 'unknown error';

      console.error(`[discovery] Source "${source.name}" failed: ${msg}`);
      sourceErrors.push(`${source.name}: ${msg}`);

      try {
        await recordSourceFailure(source.name);
      } catch {
        // Don't let status recording failure kill the loop
      }
    }
  }

  // Cluster same-story items from different sources
  const clustered = clusterAndDeduplicate(allItems);
  console.log(`[discovery] ${allItems.length} raw → ${clustered.length} clustered`);

  return { items: clustered, sourceErrors };
}
