"use client";

import React, { useState } from "react";
import Image from "next/image";
import { initAgent } from "@/services/agentApi";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PhoenixZBrand } from "@/components/ui/PhoenixZBrand";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  Search,
  CheckCircle2,
} from "lucide-react";

interface LandingPageProps {
  onAgentInitialized: (agentId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAgentInitialized }) => {
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeAgent = async () => {
    setIsInitializing(true);
    try {
      const res = await initAgent("PhoenixZ", "AI/Technology");
      if (res?.agentId) {
        localStorage.setItem("phoenixz_agent_id", res.agentId);
        onAgentInitialized(res.agentId);
      }
    } catch (err) {
      console.error("Failed to initialize agent:", err);
    } finally {
      setIsInitializing(false);
    }
  };

  const agentLoopSteps = [
    {
      num: "01",
      name: "DISCOVER",
      title: "Live Information Ingestion",
      description: "Continuously monitors live RSS feeds and market sources for concrete AI product actions.",
      icon: Search,
    },
    {
      num: "02",
      name: "ANALYZE",
      title: "Candidate Normalization",
      description: "Extracts verifiable claims, evidence quality, and company move types.",
      icon: Layers,
    },
    {
      num: "03",
      name: "DECIDE",
      title: "Editorial Scoring Rubric",
      description: "Evaluates candidates against a 100-point rubric. PUBLISH (72+), WATCH (55-71), REJECT (<55).",
      icon: ShieldCheck,
    },
    {
      num: "04",
      name: "VERIFY",
      title: "Quality & Memory Gate",
      description: "Retrieves Breeth semantic memory, checks duplicates, and validates analyst voice.",
      icon: Database,
    },
    {
      num: "05",
      name: "PUBLISH",
      title: "Autonomous Brief Generation",
      description: "Generates structured 4-part intelligence briefs and updates vector memory.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-gray-900 font-sans antialiased selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      {/* Top Navigation Header - Top Left Brand Anchored */}
      <header className="border-b border-gray-200 bg-white py-4 px-8 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-sans text-xs">
          {/* Top-Left: Reusable Official PhoenixZ Brand Component */}
          <a href="#" className="focus:outline-none">
            <PhoenixZBrand showSubtitle={true} />
          </a>

          {/* Top-Right Navigation & CTA */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6 text-gray-600 font-medium text-xs">
              <a href="#system" className="hover:text-gray-900 transition-colors">System</a>
              <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            </nav>

            <button
              onClick={() => setIsInitModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-sans font-bold text-xs px-4 py-2 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              START AGENT ENGINE
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-12 flex-1 flex flex-col justify-center">
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          {/* Official Phoenix Hero Logo Banner */}
          <div className="w-48 sm:w-64 mx-auto relative h-28 sm:h-36">
            <Image
              src="/phoenixz-logo.png"
              alt="Phoenix Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 border border-orange-200 bg-orange-50/60 rounded-md font-mono text-xs text-orange-600 uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>AUTONOMOUS INTELLIGENCE SYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 uppercase leading-none font-sans">
            TURN SIGNALS INTO <span className="text-orange-600">INTELLIGENCE.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-sans">
            PhoenixZ continuously discovers, analyzes, evaluates, and publishes competitive intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsInitModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-orange-700 transition-colors rounded-md flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>START AGENT ENGINE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-300 text-gray-700 font-sans text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-md flex items-center justify-center cursor-pointer shadow-2xs"
            >
              EXPLORE THE SYSTEM
            </a>
          </div>
        </div>

        {/* Autonomous Loop Step-by-Step Architecture */}
        <div id="how-it-works" className="border border-gray-200 bg-white p-6 sm:p-8 rounded-xl space-y-6 shadow-2xs">
          <div className="text-center space-y-1 font-mono">
            <span className="text-[11px] uppercase tracking-widest text-orange-600 font-bold">
              AUTONOMOUS ARCHITECTURE
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase font-sans">
              The 5-Step Autonomous Agent Loop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
            {agentLoopSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="border border-gray-200 bg-gray-50/50 p-4 rounded-md flex flex-col justify-between space-y-3 font-mono text-xs hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-orange-600 font-bold text-sm font-mono">{step.num}</span>
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block font-mono">
                      {step.name}
                    </span>
                    <h3 className="font-bold text-gray-900 text-xs leading-snug font-sans">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[11px] font-sans text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 px-8 font-sans text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <PhoenixZBrand compact={true} showSubtitle={false} />
          <span>Autonomous AI Security Intelligence Platform</span>
        </div>
      </footer>

      {/* Initialization Modal */}
      <Modal
        isOpen={isInitModalOpen}
        onClose={() => setIsInitModalOpen(false)}
        title="INITIALIZE PHOENIXZ AGENT"
      >
        <div className="space-y-4 font-sans text-xs">
          <p className="text-gray-600 leading-relaxed">
            Initialize your primary autonomous agent instance for <strong>AI Security & Market Intelligence</strong>.
          </p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-[11px] space-y-1">
            <div><span className="text-gray-400">Persona:</span> <span className="font-bold text-gray-900">PhoenixZ</span></div>
            <div><span className="text-gray-400">Domain:</span> <span className="font-bold text-gray-900">AI / Technology</span></div>
            <div><span className="text-gray-400">Status:</span> <span className="font-bold text-emerald-600">LIVE (Autonomous)</span></div>
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsInitModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleInitializeAgent}
              isLoading={isInitializing}
            >
              LAUNCH AGENT
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
