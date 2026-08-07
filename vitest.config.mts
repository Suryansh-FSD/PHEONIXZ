import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://mock.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role-key',
      CRON_SECRET: 'test-secret-123',
      GEMINI_API_KEY: 'mock-gemini-key',
    },
  },
});
