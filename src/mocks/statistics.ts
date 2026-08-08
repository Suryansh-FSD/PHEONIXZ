import { StatStripData, ActivityData } from "@/types/phoenixz";

export const mockStatStrip: StatStripData = {
  observed: 482,
  rejected: 394,
  watching: 56,
  published: 32,
};

export const mockActivity: ActivityData = {
  lastScan: "2026-08-07T21:28:00Z",
  candidatesFound: 14,
  published: 2,
  rejected: 9,
  watching: 3,
  sourceStatuses: [
    {
      id: "src-1",
      name: "OpenAI Developer Newsroom",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "ok",
      updatedAt: "2026-08-07T21:25:00Z",
    },
    {
      id: "src-2",
      name: "Anthropic Research & Engineering Changelog",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "ok",
      updatedAt: "2026-08-07T21:25:00Z",
    },
    {
      id: "src-3",
      name: "Google AI Developer Release Notes API",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "ok",
      updatedAt: "2026-08-07T21:25:00Z",
    },
    {
      id: "src-4",
      name: "Meta AI Blog Monitor",
      lastSuccess: "18 mins ago",
      consecutiveFailures: 1,
      status: "degraded",
      updatedAt: "2026-08-07T21:10:00Z",
    },
    {
      id: "src-5",
      name: "Hugging Face Model Hub Activity Stream",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "ok",
      updatedAt: "2026-08-07T21:25:00Z",
    },
  ],
};
