import { describe, it, expect } from 'vitest';
import type { EditorialPost } from '@/types/phoenixz';

function filterPosts(
  posts: EditorialPost[],
  selectedCategory: string,
  searchQuery: string
): EditorialPost[] {
  return posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.moveType === selectedCategory;
    const matchesSearch =
      (post.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (post.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (post.takeText?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (post.text?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}

describe('Feed Data Flow & Filtering Regression Tests', () => {
  const samplePosts: EditorialPost[] = [
    {
      id: 'post-1',
      createdAt: '2026-08-09T10:00:00Z',
      company: 'OpenAI',
      moveType: 'pricing',
      title: 'OpenAI Slashes API Pricing',
      moveText: 'THE MOVE\nOpenAI cut prices by 50%.',
      angleText: 'Aggressive pricing move.',
      pressureText: 'Forces Anthropic response.',
      takeText: 'PhoenixZ Take on pricing.',
      text: 'THE MOVE\nOpenAI cut prices.',
      totalScore: 85,
      scoreBreakdown: { marketPressure: 22, strategicSignal: 18, evidenceQuality: 18, timeliness: 13, personaFit: 8, patternContinuity: 6 },
      rationale: 'Pricing shift rationale.',
      sources: [{ title: 'Article', url: 'https://openai.com' }],
    },
    {
      id: 'post-2',
      createdAt: '2026-08-09T11:00:00Z',
      company: 'Anthropic',
      moveType: 'launch',
      title: 'Anthropic Launches Claude 3.7',
      moveText: 'THE MOVE\nAnthropic released Claude 3.7.',
      angleText: 'Frontier model launch.',
      pressureText: 'Puts pressure on OpenAI.',
      takeText: 'PhoenixZ Take on launch.',
      text: 'THE MOVE\nAnthropic released Claude 3.7.',
      totalScore: 90,
      scoreBreakdown: { marketPressure: 24, strategicSignal: 20, evidenceQuality: 19, timeliness: 14, personaFit: 8, patternContinuity: 5 },
      rationale: 'Launch rationale.',
      sources: [{ title: 'Blog', url: 'https://anthropic.com' }],
    },
    {
      id: 'post-3',
      createdAt: '2026-08-09T12:00:00Z',
      company: 'Google DeepMind',
      moveType: 'dx_change',
      title: 'Google Updates Gemini API SDK',
      moveText: 'THE MOVE\nGoogle updated developer SDK.',
      angleText: 'DX improvement.',
      pressureText: 'Improves developer retention.',
      takeText: 'PhoenixZ Take on DX.',
      text: 'THE MOVE\nGoogle updated developer SDK.',
      totalScore: 78,
      scoreBreakdown: { marketPressure: 18, strategicSignal: 16, evidenceQuality: 18, timeliness: 12, personaFit: 8, patternContinuity: 6 },
      rationale: 'DX rationale.',
      sources: [{ title: 'Docs', url: 'https://deepmind.google' }],
    },
  ];

  it('1. "all" category displays all returned feed items', () => {
    const result = filterPosts(samplePosts, 'all', '');
    expect(result).toHaveLength(3);
  });

  it('2. Category filters correctly isolate matching moveTypes', () => {
    const pricing = filterPosts(samplePosts, 'pricing', '');
    expect(pricing).toHaveLength(1);
    expect(pricing[0].id).toBe('post-1');

    const launches = filterPosts(samplePosts, 'launch', '');
    expect(launches).toHaveLength(1);
    expect(launches[0].id).toBe('post-2');

    const dx = filterPosts(samplePosts, 'dx_change', '');
    expect(dx).toHaveLength(1);
    expect(dx[0].id).toBe('post-3');
  });

  it('3. Search query filters across title, company, takeText, and text', () => {
    const searchOpenAI = filterPosts(samplePosts, 'all', 'OpenAI');
    expect(searchOpenAI).toHaveLength(1);
    expect(searchOpenAI[0].company).toBe('OpenAI');

    const searchClaude = filterPosts(samplePosts, 'all', 'Claude');
    expect(searchClaude).toHaveLength(1);
    expect(searchClaude[0].company).toBe('Anthropic');
  });

  it('4. Empty API response yields zero filtered posts without throwing', () => {
    const result = filterPosts([], 'all', '');
    expect(result).toHaveLength(0);
  });

  it('5. Items with missing optional fields are not incorrectly excluded', () => {
    const incompletePost: EditorialPost = {
      id: 'post-incomplete',
      createdAt: '2026-08-09T13:00:00Z',
      company: 'TestCompany',
      moveType: 'launch',
      title: 'Minimal Brief',
      moveText: 'Minimal move',
      angleText: '',
      pressureText: '',
      takeText: '',
      text: 'Minimal move',
      totalScore: 75,
      scoreBreakdown: { marketPressure: 20, strategicSignal: 15, evidenceQuality: 15, timeliness: 10, personaFit: 8, patternContinuity: 7 },
      rationale: 'Minimal rationale',
      sources: [],
    };

    const result = filterPosts([incompletePost], 'all', '');
    expect(result).toHaveLength(1);
  });
});
