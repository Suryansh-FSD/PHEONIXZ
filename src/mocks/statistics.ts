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
      sourceName: "OpenAI Developer Newsroom",
      url: "https://openai.com/blog/rss.xml",
      type: "RSS Feed",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "OK",
    },
    {
      id: "src-2",
      sourceName: "Anthropic Research & Engineering Changelog",
      url: "https://anthropic.com/rss.xml",
      type: "RSS Feed",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "OK",
    },
    {
      id: "src-3",
      sourceName: "Google AI Developer Release Notes API",
      url: "https://cloud.google.com/feeds/vertex.xml",
      type: "REST API",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "OK",
    },
    {
      id: "src-4",
      sourceName: "Meta AI Blog Monitor",
      url: "https://ai.meta.com/blog/rss",
      type: "Web Scraper",
      lastSuccess: "18 mins ago",
      consecutiveFailures: 1,
      status: "DEGRADED",
    },
    {
      id: "src-5",
      sourceName: "Hugging Face Model Hub Activity Stream",
      url: "https://huggingface.api/activity",
      type: "REST API",
      lastSuccess: "3 mins ago",
      consecutiveFailures: 0,
      status: "OK",
    },
  ],
};
