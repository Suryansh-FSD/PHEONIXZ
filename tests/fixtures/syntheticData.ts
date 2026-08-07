import type { RawItem } from '@/agent/clustering';

export const STORY_A: RawItem = {
  title: 'Company Alpha Slashes Developer API Prices by 50 Percent Across All Tier Models',
  body: 'Company Alpha today announced a major 50% price reduction for its primary developer API endpoint, effective immediately.',
  url: 'https://openai.com/blog/alpha-slashes-api-prices',
  publishedAt: '2026-08-07T08:00:00Z',
  source: 'openai_blog',
  sourceId: 'alpha-pricing-1',
};

export const STORY_B: RawItem = {
  title: 'Company Beta Launches Matching Low-Cost Model Tier in Direct Response to Market Cuts',
  body: 'Following recent pricing shifts by Company Alpha, Company Beta has launched a new model tier to maintain developer parity.',
  url: 'https://anthropic.com/news/beta-launches-matching-tier',
  publishedAt: '2026-08-07T14:00:00Z',
  source: 'anthropic_news',
  sourceId: 'beta-response-1',
};

export const STORY_C: RawItem = {
  title: 'Reflections on the Philosophy and Future Dynamics of Artificial Intelligence',
  body: 'An essay discussing long-term philosophical implications of intelligence without describing any product or API changes.',
  url: 'https://techcrunch.com/tag/ai/feed/reflections-future-ai',
  publishedAt: '2026-08-07T09:00:00Z',
  source: 'techcrunch_ai',
  sourceId: 'essay-1',
};

export const STORY_D: RawItem = {
  title: 'Company Alpha Slashes Developer API Prices by 50 Percent Across All Tier Models',
  body: 'Company Alpha today announced a major 50% price reduction for its primary developer API endpoint, effective immediately.',
  url: 'https://verge.com/ai/alpha-slashes-api-prices-duplicate',
  publishedAt: '2026-08-07T08:30:00Z',
  source: 'verge_ai',
  sourceId: 'alpha-pricing-dup',
};

export const STORY_E: RawItem = {
  title: 'Rumor: Anonymous Sources Claim Company Gamma Might Announce Something Next Quarter',
  body: 'Unverified blog post claiming Company Gamma could potentially explore new offerings in the future.',
  url: 'https://venturebeat.com/ai/gamma-rumor-speculation',
  publishedAt: '2026-08-07T07:00:00Z',
  source: 'venturebeat_ai',
  sourceId: 'speculation-1',
};

export const SYNTHETIC_FIXTURES = [STORY_A, STORY_B, STORY_C, STORY_D, STORY_E];
