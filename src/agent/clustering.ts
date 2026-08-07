import { generateContentHash } from '@/lib/hash';

export interface RawItem {
  title: string;
  body: string;
  url: string;
  publishedAt: string;
  source: string;
  sourceId: string;
}

/**
 * Token overlap similarity between two strings.
 * Returns 0–1 where 1 = identical.
 */
function tokenSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.toLowerCase().split(/\s+/).filter((t) => t.length > 3));
  const tokensB = new Set(b.toLowerCase().split(/\s+/).filter((t) => t.length > 3));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let overlap = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap++;
  }

  return overlap / Math.max(tokensA.size, tokensB.size);
}

/**
 * Cluster items covering the same topic into groups.
 * Returns one representative per cluster (most recent with most content).
 * Threshold: 0.65 token overlap = same story.
 */
export function clusterAndDeduplicate(items: RawItem[]): RawItem[] {
  const SIMILARITY_THRESHOLD = 0.65;
  const clusters: RawItem[][] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < items.length; i++) {
    if (assigned.has(i)) continue;

    const cluster: RawItem[] = [items[i]];
    assigned.add(i);

    for (let j = i + 1; j < items.length; j++) {
      if (assigned.has(j)) continue;

      const sim = tokenSimilarity(items[i].title, items[j].title);
      if (sim >= SIMILARITY_THRESHOLD) {
        cluster.push(items[j]);
        assigned.add(j);
      }
    }

    clusters.push(cluster);
  }

  // Pick representative: most recent, prefer longer body
  return clusters.map((cluster) => {
    return cluster.sort((a, b) => {
      const dateDiff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.body.length - a.body.length;
    })[0];
  });
}

/**
 * Compute content hash for a raw item prior to normalization.
 * Used for pre-DB deduplication.
 */
export function rawItemHash(item: RawItem): string {
  // Use URL as the most reliable unique identifier before we have company/moveType
  return generateContentHash(item.source, item.url);
}
