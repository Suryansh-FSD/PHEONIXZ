import { NextRequest } from "next/server";
import { runAutonomousCycle } from "@/agent/cycle";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { env } from "@/lib/env";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  if (process.env.NODE_ENV === "production" && env.cronSecret) {
    if (authHeader !== `Bearer ${env.cronSecret}`) {
      return apiError("Unauthorized. Invalid CRON_SECRET token.", 401);
    }
  }

  const body = await req.json().catch(() => ({}));
  const agentId = body?.agentId || "pz-agent-001";

  const result = await runAutonomousCycle(agentId);

  return apiSuccess({
    candidatesFound: result.candidatesFound,
    published: result.published,
    watched: result.watched,
    rejected: result.rejected,
    errors: result.errors,
    cycleTimestamp: new Date().toISOString(),
  });
});
