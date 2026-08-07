import { NextRequest } from "next/server";
import { agentsRepo } from "@/repositories";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  const agent = await agentsRepo.getOrCreateDefaultAgent();

  return apiSuccess({
    agentId: agent.id,
    name: body?.persona?.name || agent.name,
    domain: body?.persona?.domain || agent.domain,
    status: "active",
    createdAt: agent.createdAt,
  });
});
