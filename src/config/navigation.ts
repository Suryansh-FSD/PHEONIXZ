import {
  Rss,
  FileCheck2,
  GitCompare,
  History,
  Activity,
  Radio,
  LucideIcon,
} from "lucide-react";

export type NavTab =
  | "feed"
  | "decisions"
  | "threads"
  | "runHistory"
  | "sourceHealth"
  | "activity";

export interface NavItemConfig {
  id: NavTab;
  label: string;
  badge?: string;
  icon: LucideIcon;
}

export const navItemsConfig: NavItemConfig[] = [
  { id: "feed", label: "Analysis Feed", icon: Rss },
  { id: "decisions", label: "Decision Ledger", icon: FileCheck2 },
  { id: "threads", label: "Competitive Threads", icon: GitCompare },
  { id: "runHistory", label: "Run History", icon: History },
  { id: "sourceHealth", label: "Source Health", icon: Radio },
  { id: "activity", label: "Ingestion & Activity", icon: Activity },
];
