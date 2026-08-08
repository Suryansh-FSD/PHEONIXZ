import { CompetitiveThread } from "@/types/phoenixz";

export const mockThreads: CompetitiveThread[] = [
  {
    id: "thread-01",
    topic: "Developer Workflow Environment Capture (Artifacts vs Canvas)",
    category: "dx_change",
    strategicPattern: "Asynchronous IDE-adjacent context capture",
    companyAMove: {
      company: "Anthropic",
      action: "Launched Claude Artifacts & Workspace Repository Sync",
      timestamp: "2026-08-05",
      sourceUrl: "https://anthropic.com/news",
    },
    companyBResponse: {
      company: "OpenAI",
      action: "Released ChatGPT Canvas Interface with inline code edition & Git diffs",
      timestamp: "2026-08-07",
      sourceUrl: "https://openai.com/blog",
    },
    phoenixzTake: "This is a classical surface-area battle. Neither player is competing on raw benchmark scores here; they are fighting to become the default canvas where product specs and code logic are authored. OpenAI's Canvas response confirms that chat-window ephemeral prompts are dead end products for high-value developer retention.",
  },
  {
    id: "thread-02",
    topic: "Commoditization of Vision & Multimodal Extraction",
    category: "pricing",
    strategicPattern: "Subsidized foundational weights to destroy competitor API margins",
    companyAMove: {
      company: "OpenAI / Anthropic",
      action: "Maintained $5.00-$10.00/M token premium pricing on multimodal document parsing",
      timestamp: "2026-07-20",
    },
    companyBResponse: {
      company: "Meta",
      action: "Open-sourced Llama 3.2 Vision (11B/90B) under permissive commercial license",
      timestamp: "2026-08-06",
    },
    phoenixzTake: "Meta executed a classic flank. By releasing competitive vision weights for zero licensing fee, they stripped 80% of document extraction workloads from proprietary API balance sheets. proprietary providers are now forced to compete on specialized low-latency execution rather than vision reasoning capabilities.",
  },
  {
    id: "thread-03",
    topic: "Batch Processing Unit Economics & Datacenter Arbitrage",
    category: "pricing",
    strategicPattern: "Off-peak GPU yield monetization",
    companyAMove: {
      company: "Google Cloud",
      action: "Introduced Gemini 1.5 Flash 8B with sub-$0.05 batch rate",
      timestamp: "2026-08-04",
    },
    companyBResponse: {
      company: "OpenAI",
      action: "Cut GPT-4o Batch API prices by 60% to $1.25/M tokens",
      timestamp: "2026-08-07",
    },
    phoenixzTake: "Hyperscalers with owned power and silicon pipeline (Google TPU vs OpenAI/Microsoft Azure clusters) are weaponizing off-peak capacity. Third-party model hosting startups without custom ASICs face a collapsing gross margin profile.",
  },
];
