import { db } from './client';

export interface SourceStatusRow {
  id: string;
  source: string;
  last_success: string | null;
  last_failure: string | null;
  consecutive_failures: number;
  status: 'ok' | 'degraded' | 'dead';
  updated_at: string;
}

export async function recordSourceSuccess(source: string): Promise<void> {
  const { error } = await db
    .from('source_status')
    .upsert(
      {
        source,
        last_success: new Date().toISOString(),
        consecutive_failures: 0,
        status: 'ok',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source' }
    );

  if (error) throw new Error(`recordSourceSuccess: ${error.message}`);
}

export async function recordSourceFailure(source: string): Promise<void> {
  // Fetch current failure count first
  const { data: existing } = await db
    .from('source_status')
    .select('consecutive_failures')
    .eq('source', source)
    .maybeSingle();

  const consecutive = (existing?.consecutive_failures ?? 0) + 1;
  const status = consecutive >= 5 ? 'dead' : consecutive >= 3 ? 'degraded' : 'ok';

  const { error } = await db
    .from('source_status')
    .upsert(
      {
        source,
        last_failure: new Date().toISOString(),
        consecutive_failures: consecutive,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source' }
    );

  if (error) throw new Error(`recordSourceFailure: ${error.message}`);
}

export async function getSourceStatuses(): Promise<SourceStatusRow[]> {
  const { data, error } = await db
    .from('source_status')
    .select()
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`getSourceStatuses: ${error.message}`);
  return data ?? [];
}

export async function isSourceDead(source: string): Promise<boolean> {
  const { data } = await db
    .from('source_status')
    .select('status')
    .eq('source', source)
    .maybeSingle();

  return data?.status === 'dead';
}
