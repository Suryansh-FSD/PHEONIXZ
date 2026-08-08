export interface EnvConfig {
  geminiApiKey: string;
  agentRouterApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  breethApiKey: string;
  breethProjectId: string;
  cronSecret: string;
  appUrl: string;
}

export function validateEnv(): EnvConfig {
  return {
    geminiApiKey: process.env.GEMINI_API_KEY || "mock-gemini-key",
    agentRouterApiKey: process.env.AGENT_ROUTER_API_KEY || "mock-router-key",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "mock-service-key",
    breethApiKey: process.env.BREETH_API_KEY || "mock-breeth-key",
    breethProjectId: process.env.BREETH_PROJECT_ID || "mock-breeth-project",
    cronSecret: process.env.CRON_SECRET || "mock-cron-secret",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };
}

export const env = validateEnv();
