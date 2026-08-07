import { NextRequest } from "next/server";
import { postsRepo } from "@/repositories";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (agentId === "invalid") {
    return apiSuccess({ posts: [] });
  }

  const posts = await postsRepo.getLatestPosts(agentId || undefined);
  return apiSuccess({ posts });
});
