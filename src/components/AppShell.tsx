"use client";

import React, { useState, useEffect } from "react";
import { NavTab } from "@/config/navigation";
import { SettingsDrawer } from "./SettingsDrawer";
import { StatStrip } from "./StatStrip";
import { LiveFeed } from "./LiveFeed";
import { DecisionLog } from "./DecisionLog";
import { ActivityPanel } from "./ActivityPanel";
import { CompetitiveThreadView } from "./CompetitiveThreadView";
import { RunHistory } from "./RunHistory";
import { SourceHealthPanel } from "./SourceHealthPanel";
import { SearchIntelligenceView } from "./SearchIntelligenceView";
import { LandingPage } from "./LandingPage";
import { PhoenixZBrand } from "@/components/ui/PhoenixZBrand";
import {
  fetchAgentInfo,
  fetchAgentFeed,
  fetchDecisionLogItems,
  fetchRunHistory,
  fetchSourceStatuses,
} from "@/services/agentApi";
import {
  EditorialPost,
  SystemHeaderState,
  StatStripData,
  DecisionLogItem,
  ActivityData,
  CompetitiveThread,
} from "@/types/phoenixz";
import {
  Settings,
  Sun,
  Moon,
  RefreshCw,
  Rss,
  GitCommit,
  Clock,
  Radio,
  Activity,
  Flame,
  Home,
  Search,
} from "lucide-react";

export const AppShell: React.FC = () => {
  const [headerState, setHeaderState] = useState<SystemHeaderState | null>(null);
  const [statStrip, setStatStrip] = useState<StatStripData | null>(null);
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [decisions, setDecisions] = useState<DecisionLogItem[]>([]);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [threads] = useState<CompetitiveThread[]>([]);

  const [activeTab, setActiveTab] = useState<
    "feed" | "search" | "decisions" | "threads" | "runHistory" | "sourceHealth" | "activity"
  >("feed");
  const [isScanning, setIsScanning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [isViewingLanding, setIsViewingLanding] = useState(false);

  const [agentId, setAgentId] = useState<string>("");

  // Load theme and agent ID from localStorage
  useEffect(() => {
    async function setupAgent() {
      const storedId = localStorage.getItem("phoenixz_agent_id");
      if (storedId) {
        setAgentId(storedId);
      }
      const savedTheme = (localStorage.getItem("phoenixz_theme") as "dark" | "light") || "light";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }
    setupAgent();
  }, []);

  // Poll live feed and stats periodically when agentId is present
  useEffect(() => {
    if (!agentId) return;

    async function loadData() {
      try {
        const [agentInfo, feedPosts, decs, runs, sources] = await Promise.all([
          fetchAgentInfo(agentId),
          fetchAgentFeed(agentId),
          fetchDecisionLogItems(agentId),
          fetchRunHistory(agentId),
          fetchSourceStatuses(),
        ]);

        setPosts(feedPosts);
        setDecisions(decs);
        setHeaderState({
          name: agentInfo?.name || "PhoenixZ",
          domain: agentInfo?.domain || "AI SECURITY INTELLIGENCE",
          status: "LIVE",
          uptime: "Autonomous Online",
          lastScan: "Just now",
        });

        setActivity({
          recentRuns: runs,
          sourceStatuses: sources,
        });

        const published = feedPosts.length;
        const rejected = decs.filter((d) => d.decision === "reject").length;
        const watching = decs.filter((d) => d.decision === "watch").length;
        const observed = published + decs.length + (runs[0]?.candidatesFound || 0);

        setStatStrip({
          observed,
          rejected,
          watching,
          published,
        });
      } catch (err) {
        console.warn("Poll feed error:", err);
      }
    }

    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [agentId]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("phoenixz_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  const handleTriggerScan = async () => {
    setIsScanning(true);
    try {
      await fetch("/api/internal/cycle", { method: "POST" });
    } catch {
      // Ignore if authorization required
    }
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const sidebarNavItems = [
    { id: "feed", label: "Analysis Feed", icon: Rss },
    { id: "search", label: "Search Intelligence", icon: Search },
    { id: "decisions", label: "Decision Ledger", icon: GitCommit },
    { id: "threads", label: "Competitive Threads", icon: Flame },
    { id: "runHistory", label: "Run History", icon: Clock },
    { id: "sourceHealth", label: "Source Health", icon: Radio },
    { id: "activity", label: "Ingestion & Activity", icon: Activity },
  ];

  // Render Landing Page if requested or if no agent initialized yet
  if (!agentId || isViewingLanding) {
    return (
      <LandingPage
        onAgentInitialized={(newAgentId) => {
          setAgentId(newAgentId);
          setIsViewingLanding(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-gray-900 flex font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Settings Drawer */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 sticky top-0 h-screen z-30 flex-shrink-0">
        <div className="space-y-6">
          {/* Top Brand Header using PhoenixZBrand */}
          <button
            onClick={() => setIsViewingLanding(true)}
            className="text-left focus:outline-none cursor-pointer group"
            title="Navigate to Landing Page"
          >
            <PhoenixZBrand showSubtitle={true} />
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5 font-sans text-xs">
            {/* Mobile / Sidebar HOME navigation link */}
            <button
              onClick={() => setIsViewingLanding(true)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all cursor-pointer text-left font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Home className="w-4 h-4 text-gray-400" />
              <span>HOME</span>
            </button>

            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavTab)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all cursor-pointer text-left font-medium ${
                    isActive
                      ? "bg-orange-50/80 text-orange-600 border border-orange-200/80 font-semibold shadow-2xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Agent Card */}
        <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-3 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center font-mono flex-shrink-0">
            PZ
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-xs text-gray-900 block truncate">
              PhoenixZ Agent
            </span>
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-gray-500 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="font-bold text-emerald-600">LIVE</span>
              <span>Autonomous</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="px-8 py-4 flex items-center justify-between border-b border-gray-200/60 bg-transparent">
          {/* Mobile Brand Link */}
          <div className="flex items-center space-x-2 sm:hidden">
            <button onClick={() => setIsViewingLanding(true)} className="cursor-pointer">
              <PhoenixZBrand compact={true} showSubtitle={false} />
            </button>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {/* LIVE Autonomous Online Pill */}
            <div className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-md text-xs font-mono flex items-center space-x-2 text-gray-600 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span className="font-bold text-gray-900">LIVE</span>
              <span className="text-gray-500">Autonomous Online</span>
            </div>

            {/* HOME Button (Secondary Control) */}
            <button
              onClick={() => setIsViewingLanding(true)}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3.5 py-2 rounded-md font-sans text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Navigate to Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-gray-500" />
              <span>HOME</span>
            </button>

            {/* Primary RUN CYCLE Button */}
            <button
              onClick={handleTriggerScan}
              disabled={isScanning}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-sans text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "Scanning…" : "Run Cycle"}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-orange-400" />
              ) : (
                <Sun className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open settings"
              className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </header>

        {/* Metric Strip */}
        <div className="px-8 pt-6">
          {statStrip && (
            <StatStrip
              stats={statStrip}
              onSelectFilter={(id) => {
                if (id === "published" || id === "observed") setActiveTab("feed");
                else if (id === "rejected" || id === "watching") setActiveTab("decisions");
              }}
            />
          )}
        </div>

        {/* Main Content Workspace */}
        <main className="px-8 py-6 flex-1">
          {activeTab === "feed" && <LiveFeed posts={posts} />}
          {activeTab === "search" && <SearchIntelligenceView />}
          {activeTab === "decisions" && <DecisionLog items={decisions} />}
          {activeTab === "threads" && <CompetitiveThreadView threads={threads} />}
          {activeTab === "runHistory" && <RunHistory />}
          {activeTab === "sourceHealth" && activity && (
            <SourceHealthPanel statuses={activity.sourceStatuses} />
          )}
          {activeTab === "activity" && activity && <ActivityPanel activity={activity} />}
        </main>
      </div>
    </div>
  );
};
