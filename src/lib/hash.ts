import { createHash } from 'crypto';

/**
 * Deterministic SHA-256 content hash for deduplication.
 * Normalises company name and title to reduce near-duplicate misses.
 */
export function generateContentHash(company: string, title: string): string {
  const normalised = `${company.toLowerCase().trim()}::${title.toLowerCase().trim().slice(0, 80)}`;
  return createHash('sha256').update(normalised).digest('hex');
}
