import { z } from 'zod';

export function parseJsonResponse<T>(rawText: string, schema: z.ZodSchema<T>, providerName: string): T {
  let text = rawText.trim();

  // Strip markdown code fences if present (e.g. ```json { ... } ``` or ``` { ... } ```)
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // Find first '{' or '[' and last '}' or ']'
  const firstBrace = text.search(/[\{\[]/);
  const lastBrace = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[${providerName}] JSON parse error: ${msg}. Raw text preview: "${rawText.slice(0, 200)}"`);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `[${providerName}] Schema validation failed: ${result.error.message}\nParsed JSON: ${JSON.stringify(parsed).slice(0, 300)}`
    );
  }

  return result.data;
}
