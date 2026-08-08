"use client";

import React, { useState, useEffect } from "react";
import { navItemsConfig, NavTab } from "@/config/navigation";
import { SidebarItem } from "@/components/ui/Sidebar";
import { SettingsDrawer } from "./SettingsDrawer";
import { StatStrip } from "./StatStrip";
import { LiveFeed } from "./LiveFeed";
import { DecisionLog } from "./DecisionLog";
import { ActivityPanel } from "./ActivityPanel";
import { CompetitiveThreadView } from "./CompetitiveThreadView";
import { RunHistory } from "./RunHistory";
import { SourceHealthPanel } from "./SourceHealthPanel";
import {
  initAgent,
  fetchAgentInfo,
  fetchAgentFeed,
  fetchDecisionLogItems,
  fetchRunHistory,
} from "@/services/agentApi";
import {
  EditorialPost,
  SystemHeaderState,
  StatStripData,
  DecisionLogItem,
  Run,
  SourceHealth,
  ActivityData,
  CompetitiveThread,
} from "@/types/phoenixz";
import {
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  RefreshCw,
  Clock,
  ChevronRight,
} from "lucide-react";

export const AppShell: React.FC = () => {
  const [headerState, setHeaderState] = useState<SystemHeaderState | null>(null);
  const [statStrip, setStatStrip] = useState<StatStripData | null>(null);
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [decisions, setDecisions] = useState<DecisionLogItem[]>([]);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [threads, setThreads] = useState<CompetitiveThread[]>([]);

  const [activeTab, setActiveTab] = useState<
    "feed" | "decisions" | "threads" | "runHistory" | "sourceHealth" | "activity"
  >("feed");
  const [isScanning, setIsScanning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [agentId, setAgentId] = useState<string>("");

  // Load and initialize agent ID from localStorage or POST /api/agent/init
  useEffect(() => {
    async function setupAgent() {
      let storedId = localStorage.getItem("phoenixz_agent_id");
      if (!storedId) {
        try {
          const initRes = await initAgent("PheonixZ", "AI Security");
          storedId = initRes.agentId;
          if (storedId) {
            localStorage.setItem("phoenixz_agent_id", storedId);
          }
        } catch (err) {
          console.warn("Agent init error:", err);
        }
      }
      if (storedId) {
        setAgentId(storedId);
      }
    }
    setupAgent();
  }, []);

  // Poll live feed and stats periodically when agentId is present
  useEffect(() => {
    if (!agentId) return;

    async function loadData() {
      try {
        const [agentInfo, feedPosts, decs, runs] = await Promise.all([
          fetchAgentInfo(agentId),
          fetchAgentFeed(agentId),
          fetchDecisionLogItems(agentId),
          fetchRunHistory(agentId),
        ]);

        setPosts(feedPosts);
        setDecisions(decs);
        setHeaderState({
          name: agentInfo?.name || "Ada",
          domain: agentInfo?.domain || "AI Security",
          status: "LIVE",
          uptime: "Autonomous Online",
          lastScan: "Just now",
        });

        const published = feedPosts.length;
        const observed = published + decs.length + (runs[0]?.candidatesFound || 0);
        setStatStrip({
          observed,
          rejected: decs.filter((d) => d.decision === "reject").length,
          watching: decs.filter((d) => d.decision === "watch").length,
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
      // Ignore if CRON_SECRET authorization required
    }
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const navItems: SidebarItem[] = navItemsConfig;

  return (
    <div className="min-h-screen bg-phoenix-bg text-phoenix-text flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Settings Drawer */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Top Navbar */}
      <header className="w-full bg-phoenix-card border-b border-phoenix-border text-phoenix-text py-3 px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation drawer"
              className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-phoenix-tertiary hover:text-phoenix-text bg-phoenix-elevated border border-phoenix-border rounded-xs cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            <div className="w-9 h-9 bg-phoenix-elevated border border-phoenix-border flex items-center justify-center rounded-xs font-bold text-phoenix-text text-sm font-mono">
              PZ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold uppercase tracking-tight text-phoenix-text font-mono">
                  {headerState?.name || "PHEONIXZ"}
                </h1>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.2 border border-phoenix-border text-phoenix-tertiary font-mono">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-phoenix-tertiary hidden sm:block font-mono">
                {headerState?.domain || "Autonomous Product Analyst"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1.5 bg-phoenix-elevated border border-phoenix-border px-3 py-2 min-h-[40px] rounded-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-phoenix-text font-bold hidden sm:inline">{headerState?.status || "LIVE"}</span>
            </div>

            <div className="hidden md:flex items-center space-x-1.5 text-phoenix-tertiary bg-phoenix-elevated border border-phoenix-border px-3 py-2 min-h-[40px] rounded-xs font-mono">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-phoenix-tertiary">UPTIME:</span>
              <span className="text-phoenix-text tabular-nums">{headerState?.uptime || "14d 06h 22m"}</span>
            </div>

            <button
              onClick={handleTriggerScan}
              disabled={isScanning}
              aria-label="Trigger manual agent scan cycle"
              className="flex items-center space-x-1.5 bg-phoenix-accent text-white hover:bg-phoenix-accent-hover px-3.5 py-2 min-h-[40px] rounded-xs transition-colors disabled:opacity-50 font-bold font-mono cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{isScanning ? "SCANNING…" : "RUN CYCLE"}</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              className="p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-phoenix-tertiary hover:text-phoenix-text bg-phoenix-elevated border border-phoenix-border rounded-xs cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              title="Toggle Dark / Light Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" aria-hidden="true" />
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open settings drawer"
              className="p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-phoenix-tertiary hover:text-phoenix-text bg-phoenix-elevated border border-phoenix-border rounded-xs cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
              title="System Settings"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Desktop Sidebar + Dashboard Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <aside
          className={`hidden lg:flex flex-col border-r border-phoenix-border bg-phoenix-card p-4 transition-all duration-200 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-phoenix-border font-mono text-xs">
            {!isSidebarCollapsed && (
              <span className="font-bold uppercase tracking-wider text-phoenix-tertiary text-[10px]">
                SECTIONS
              </span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label="Collapse sidebar"
              className="p-1 text-phoenix-tertiary hover:text-phoenix-text rounded-xs cursor-pointer"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? "" : "rotate-180"}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <nav className="space-y-1 font-mono text-xs flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavTab)}
                  aria-label={`Switch to ${item.label}`}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                    isActive
                      ? "bg-phoenix-elevated border-phoenix-border-strong text-phoenix-text font-bold"
                      : "bg-transparent border-transparent text-phoenix-muted hover:text-phoenix-text hover:bg-phoenix-elevated/50"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-phoenix-accent" : "text-phoenix-tertiary"}`}
                      aria-hidden="true"
                    />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && (
                    <span className="text-[10px] bg-phoenix-bg border border-phoenix-border px-1.5 py-0.2 rounded-xs text-phoenix-tertiary">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 font-mono animate-fadeIn">
            <div className="w-64 bg-phoenix-card border-r border-phoenix-border h-full p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-phoenix-border pb-3">
                <span className="font-bold text-xs text-phoenix-text uppercase">Sections</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="text-phoenix-tertiary hover:text-phoenix-text"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as NavTab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs transition-colors ${
                        isActive
                          ? "bg-phoenix-elevated text-phoenix-text font-bold border border-phoenix-border-strong"
                          : "text-phoenix-muted hover:text-phoenix-text"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-phoenix-accent" aria-hidden="true" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] bg-phoenix-bg border border-phoenix-border px-1.5 py-0.2">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Section 1: Statistics */}
          {statStrip && (
            <StatStrip
              stats={statStrip}
              onSelectFilter={(id) => {
                if (id === "published" || id === "observed") setActiveTab("feed");
                else if (id === "rejected" || id === "watching") setActiveTab("decisions");
              }}
            />
          )}

          {/* Active Modular Section Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {activeTab === "feed" && <LiveFeed posts={posts} />}
            {activeTab === "decisions" && <DecisionLog items={decisions} />}
            {activeTab === "threads" && <CompetitiveThreadView threads={threads} />}
            {activeTab === "runHistory" && <RunHistory />}
            {activeTab === "sourceHealth" && activity && (
              <SourceHealthPanel statuses={activity.sourceStatuses} />
            )}
            {activeTab === "activity" && activity && <ActivityPanel activity={activity} />}
          </main>

          {/* Footer */}
          <footer className="border-t border-phoenix-border bg-phoenix-card py-4 px-4 sm:px-6 text-center font-mono text-xs text-phoenix-tertiary">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>PHEONIXZ — Autonomous Product Analyst</span>
              <span>Lens: Pricing moves • Model/Product launches • Feature parity • DX changes</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
