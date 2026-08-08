import { createLogger } from "@/lib/logger";

const logger = createLogger("SupabaseClient");

export interface DatabaseClient {
  isConfigured: boolean;
  query<T>(tableName: string, options?: Record<string, unknown>): Promise<T[]>;
  insert<T>(tableName: string, data: Record<string, unknown>): Promise<T>;
}

class MockSupabaseClient implements DatabaseClient {
  public isConfigured: boolean;

  constructor() {
    this.isConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    logger.info("Initialized Supabase Client", { isConfigured: this.isConfigured });
  }

  async query<T>(tableName: string, options?: Record<string, unknown>): Promise<T[]> {
    logger.debug(`Query table ${tableName}`, { options });
    return [] as T[];
  }

  async insert<T>(tableName: string, data: Record<string, unknown>): Promise<T> {
    logger.info(`Insert record into ${tableName}`, { data });
    return { id: `mock-${Date.now()}`, ...data } as T;
  }
}

export const dbClient = new MockSupabaseClient();

export function getSupabaseServerClient() {
  return dbClient;
}
