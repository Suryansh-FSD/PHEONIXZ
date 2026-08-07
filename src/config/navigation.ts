import { Newspaper, FileText, GitPullRequest, Activity, History, Radio, LucideIcon } from "lucide-react";

export interface NavItemConfig {
  id: "feed" | "decisions" | "threads" | "runHistory" | "sourceHealth" | "activity";
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const navItemsConfig: NavItemConfig[] = [
  { id: "feed", label: "Live Feed", icon: Newspaper, badge: "4" },
  { id: "decisions", label: "Decision Log", icon: FileText, badge: "6" },
  { id: "threads", label: "Competitive Threads", icon: GitPullRequest, badge: "3" },
  { id: "runHistory", label: "Run History", icon: History, badge: "4" },
  { id: "sourceHealth", label: "Source Health", icon: Radio, badge: "5" },
  { id: "activity", label: "System Activity", icon: Activity, badge: "LIVE" },
];
