import { dbClient } from "@/db/supabase";
import { mockFeed, mockDecisions, mockActivity } from "@/mocks";
import { EditorialPost, DecisionLogItem, ActivityData } from "@/types/phoenixz";

export class AgentsRepository {
  async getOrCreateDefaultAgent() {
    return {
      id: "pz-agent-001",
      name: "PheonixZ",
      domain: "AI Product Strategy",
      active: true,
      createdAt: new Date().toISOString(),
    };
  }
}

export class PostsRepository {
  async getLatestPosts(agentId?: string): Promise<EditorialPost[]> {
    return mockFeed;
  }

  async createPost(post: Partial<EditorialPost>): Promise<EditorialPost> {
    return dbClient.insert<EditorialPost>("posts", post);
  }
}

export class DecisionsRepository {
  async getDecisions(agentId?: string): Promise<DecisionLogItem[]> {
    return mockDecisions;
  }

  async recordDecision(decision: Partial<DecisionLogItem>): Promise<DecisionLogItem> {
    return dbClient.insert<DecisionLogItem>("decisions", decision);
  }
}

export class RunsRepository {
  async getLatestActivity(): Promise<ActivityData> {
    return mockActivity;
  }
}

export const agentsRepo = new AgentsRepository();
export const postsRepo = new PostsRepository();
export const decisionsRepo = new DecisionsRepository();
export const runsRepo = new RunsRepository();
