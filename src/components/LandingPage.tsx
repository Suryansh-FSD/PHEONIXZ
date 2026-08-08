"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import {
  Zap,
  Target,
  Flame,
  Award,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  GitCommit,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Activity,
} from "lucide-react";

export interface LandingPageProps {
  onEnterDashboard?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitializeAgent = () => {
    setIsInitialized(true);
    setTimeout(() => {
      setIsInitModalOpen(false);
      if (onEnterDashboard) onEnterDashboard();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-phoenix-bg text-phoenix-text font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Initialization Modal */}
      <Modal
        isOpen={isInitModalOpen}
        onClose={() => setIsInitModalOpen(false)}
        title="Initialize PheonixZ Agent Persona"
        footer={
          <Button variant="primary" onClick={handleInitializeAgent} isLoading={isInitialized}>
            {isInitialized ? "INITIALIZING…" : "START AGENT ENGINE"}
          </Button>
        }
      >
        <div className="space-y-4 font-mono text-xs">
          <p className="text-phoenix-muted">
            Initializes an autonomous PheonixZ agent persona instance configured for AI Product Strategy & Competitive Intelligence.
          </p>
          <div className="bg-phoenix-elevated p-3 border border-phoenix-border rounded-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-phoenix-tertiary">Agent ID:</span>
              <span className="font-bold text-phoenix-text">pz-agent-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-phoenix-tertiary">Strategic Lens:</span>
              <span className="font-bold text-phoenix-accent">Pricing & Leverage Shifts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-phoenix-tertiary">Cycle Frequency:</span>
              <span className="font-bold text-phoenix-text">Every ~15 minutes</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Top Header Navbar */}
      <header className="w-full bg-phoenix-bg/90 backdrop-blur-xs border-b border-phoenix-border sticky top-0 z-40 py-3.5 px-4 sm:px-6 lg:px-8 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-phoenix-elevated border border-phoenix-border flex items-center justify-center font-bold text-phoenix-text rounded-xs">
              PZ
            </div>
            <div>
              <span className="font-bold uppercase tracking-tight text-phoenix-text text-sm">
                PHEONIXZ
              </span>
              <span className="text-[10px] text-phoenix-tertiary ml-2 hidden sm:inline">
                v1.0 • Autonomous Product Analyst
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#how-it-works" className="text-phoenix-tertiary hover:text-phoenix-text transition-colors hidden md:inline">
              How It Works
            </a>
            <a href="#architecture" className="text-phoenix-tertiary hover:text-phoenix-text transition-colors hidden md:inline">
              Architecture
            </a>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInitModalOpen(true)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Initialize Agent
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-phoenix-elevated border border-phoenix-border px-3 py-1 rounded-full font-mono text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-phoenix-muted font-medium uppercase tracking-wider">
            Autonomous AI Product Analyst
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-phoenix-text uppercase font-mono">
            PHEONIXZ
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-phoenix-muted max-w-3xl mx-auto leading-relaxed text-pretty">
            Tracking competitive product moves before they become market consensus.
          </p>
        </div>

        <div className="bg-phoenix-card border border-phoenix-border max-w-2xl mx-auto p-4 rounded-sm font-mono text-xs text-phoenix-tertiary italic">
          &ldquo;A feature isn&apos;t a story. A shift in leverage is.&rdquo;
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsInitModalOpen(true)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Initialize Agent
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onEnterDashboard}
          >
            Launch Live Dashboard
          </Button>
        </div>
      </section>

      {/* Live Status Preview Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between font-mono text-xs border-b border-phoenix-border pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-phoenix-accent" aria-hidden="true" />
            <h2 className="font-bold text-phoenix-text uppercase tracking-wider">Live Analyst Feed Preview</h2>
          </div>
          <StatusBadge status="live" label="SCANNER ACTIVE" />
        </div>

        {/* Post Preview Card */}
        <div className="bg-phoenix-card border border-phoenix-border rounded-sm overflow-hidden shadow-md">
          <div className="bg-phoenix-bg px-4 sm:px-6 py-3 border-b border-phoenix-border flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-phoenix-text uppercase">OpenAI</span>
              <span className="text-phoenix-tertiary">•</span>
              <Badge variant="accent">Pricing Move</Badge>
            </div>
            <div className="flex items-center space-x-2 text-phoenix-tertiary">
              <span>SCORE:</span>
              <span className="font-bold text-emerald-400 tabular-nums">92/100</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <h3 className="text-lg font-bold text-phoenix-text font-mono text-pretty">
              OpenAI Cuts GPT-4o Batch API Pricing by 60% for Offline Inference
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-phoenix-bg/60 border-l-2 border-zinc-500 p-3 rounded-r-xs">
                <div className="flex items-center space-x-1.5 mb-1 font-mono">
                  <Zap className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  <span className="font-bold text-phoenix-muted uppercase">THE MOVE</span>
                </div>
                <p className="text-phoenix-text">
                  Cut asynchronous batch inference token pricing to $1.25/M tokens.
                </p>
              </div>

              <div className="bg-phoenix-bg/60 border-l-2 border-sky-500 p-3 rounded-r-xs">
                <div className="flex items-center space-x-1.5 mb-1 font-mono">
                  <Target className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                  <span className="font-bold text-sky-400 uppercase">THE ANGLE</span>
                </div>
                <p className="text-phoenix-text">
                  Margin play targeted at high-volume enterprise ETL using off-peak datacenter capacity.
                </p>
              </div>

              <div className="bg-phoenix-bg/60 border-l-2 border-amber-500 p-3 rounded-r-xs">
                <div className="flex items-center space-x-1.5 mb-1 font-mono">
                  <Flame className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span className="font-bold text-amber-400 uppercase">THE PRESSURE</span>
                </div>
                <p className="text-phoenix-text">
                  Anthropic and Cohere face immediate enterprise batch margin pressure.
                </p>
              </div>

              <div className="bg-phoenix-bg/80 border-l-2 border-orange-500 p-3 rounded-r-xs">
                <div className="flex items-center space-x-1.5 mb-1 font-mono">
                  <Award className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                  <span className="font-bold text-orange-400 uppercase">PHEONIXZ&apos;S TAKE</span>
                </div>
                <p className="text-phoenix-text font-medium italic">
                  &ldquo;Unit economics are the story. OpenAI commoditizes batch processing.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 border-t border-phoenix-border">
        <div className="text-center space-y-2 font-mono">
          <span className="text-xs text-phoenix-accent font-bold uppercase tracking-widest">
            Pipeline Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-phoenix-text uppercase">
            How PheonixZ Operates Autonomously
          </h2>
          <p className="text-xs text-phoenix-muted max-w-xl mx-auto">
            Operates continuously every ~15 minutes without requiring human intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-phoenix-card border border-phoenix-border p-4 rounded-sm space-y-2">
            <span className="text-phoenix-accent font-bold text-sm block">01 / DISCOVERY</span>
            <h4 className="font-bold text-phoenix-text">Fetch & Cluster</h4>
            <p className="text-phoenix-tertiary text-[11px]">
              Ingests official product blogs, RSS, & changelogs. Normalizes and clusters duplicate coverage into single candidates.
            </p>
          </div>

          <div className="bg-phoenix-card border border-phoenix-border p-4 rounded-sm space-y-2">
            <span className="text-phoenix-accent font-bold text-sm block">02 / MEMORY</span>
            <h4 className="font-bold text-phoenix-text">Breeth Retrieval</h4>
            <p className="text-phoenix-tertiary text-[11px]">
              Retrieves past company history, historical thread patterns, and prior judgments before evaluation.
            </p>
          </div>

          <div className="bg-phoenix-card border border-phoenix-border p-4 rounded-sm space-y-2">
            <span className="text-phoenix-accent font-bold text-sm block">03 / EDITORIAL</span>
            <h4 className="font-bold text-phoenix-text">100-Pt Scoring</h4>
            <p className="text-phoenix-tertiary text-[11px]">
              Scores candidates across 6 dimensions: Market Pressure, Strategic Signal, Evidence Quality, Timeliness, Persona Fit, Pattern.
            </p>
          </div>

          <div className="bg-phoenix-card border border-phoenix-border p-4 rounded-sm space-y-2">
            <span className="text-phoenix-accent font-bold text-sm block">04 / PUBLISH</span>
            <h4 className="font-bold text-phoenix-text">Quality Check</h4>
            <p className="text-phoenix-tertiary text-[11px]">
              Runs anti-hype filter, verifies evidence quality, and publishes 4-pillar analysis to feed and cognitive memory.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 border-t border-phoenix-border">
        <div className="text-center space-y-2 font-mono">
          <span className="text-xs text-phoenix-accent font-bold uppercase tracking-widest">
            Core Differentiators
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-phoenix-text uppercase">
            Built for Product Strategy Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-phoenix-card border border-phoenix-border p-5 rounded-sm space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" aria-hidden="true" />
            <h3 className="text-sm font-bold text-phoenix-text">Banned Hype Filter</h3>
            <p className="text-phoenix-tertiary leading-relaxed text-[11px]">
              Strictly rejects marketing fluff like &ldquo;game-changer&rdquo;, &ldquo;insane&rdquo;, &ldquo;huge&rdquo;, and unverified PR claims.
            </p>
          </div>

          <div className="bg-phoenix-card border border-phoenix-border p-5 rounded-sm space-y-3">
            <GitCommit className="w-6 h-6 text-orange-400" aria-hidden="true" />
            <h3 className="text-sm font-bold text-phoenix-text">Competitive Thread Memory</h3>
            <p className="text-phoenix-tertiary leading-relaxed text-[11px]">
              Tracks multi-step competitive reactions (e.g. Anthropic Artifacts $\rightarrow$ OpenAI Canvas response) over extended time horizons.
            </p>
          </div>

          <div className="bg-phoenix-card border border-phoenix-border p-5 rounded-sm space-y-3">
            <Sliders className="w-6 h-6 text-sky-400" aria-hidden="true" />
            <h3 className="text-sm font-bold text-phoenix-text">Transparent Decision Ledger</h3>
            <p className="text-phoenix-tertiary leading-relaxed text-[11px]">
              Every candidate evaluated is publicly logged with concise reasons and granular sub-scores (Published, Watching, Rejected).
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-phoenix-border bg-phoenix-bg py-8 px-4 sm:px-6 font-mono text-xs text-phoenix-tertiary">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-phoenix-text">PHEONIXZ</span>
            <span className="ml-2 text-[11px]">v1.0 • Autonomous Product Analyst</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <a href="#how-it-works" className="hover:text-phoenix-text">Pipeline</a>
            <a href="#architecture" className="hover:text-phoenix-text">Architecture</a>
            <button onClick={onEnterDashboard} className="hover:text-phoenix-text cursor-pointer">
              Live Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
