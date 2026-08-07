"use client";

import React, { useState } from "react";
import { CompetitiveThread } from "@/types/phoenixz";
import { GitCommit, ArrowDown, ExternalLink, Flame, Target, Award, Layers } from "lucide-react";

interface CompetitiveThreadViewProps {
  threads: CompetitiveThread[];
}

export const CompetitiveThreadView: React.FC<CompetitiveThreadViewProps> = ({
  threads,
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    threads[0]?.id || ""
  );

  const selectedThread =
    threads.find((t) => t.id === selectedThreadId) || threads[0];

  return (
    <div className="w-full space-y-6 font-mono">
      {/* Top Header & Thread Selector */}
      <div className="bg-phoenix-card border border-phoenix-border p-4 sm:p-5 rounded-sm space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-phoenix-border pb-3">
          <GitCommit className="w-4 h-4 text-phoenix-accent" aria-hidden="true" />
          <h2 className="text-sm font-bold text-phoenix-text uppercase tracking-wider">
            Competitive Thread Analysis & Vertical Timeline
          </h2>
        </div>
        <p className="text-xs text-phoenix-muted">
          Tracks multi-step competitive reactions, forced strategic responses, and pattern continuity over time.
        </p>

        {/* Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {threads.map((thread) => {
            const isSelected = thread.id === selectedThread?.id;
            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                aria-label={`Select thread: ${thread.topic}`}
                className={`text-xs px-3 py-1.5 rounded-xs border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                  isSelected
                    ? "bg-phoenix-elevated text-phoenix-text border-phoenix-border-strong font-bold shadow-xs"
                    : "bg-phoenix-bg/60 text-phoenix-tertiary border-phoenix-border hover:border-phoenix-border-strong hover:text-phoenix-text"
                }`}
              >
                {thread.topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Vertical Timeline Node Chain */}
      {selectedThread && (
        <div className="bg-phoenix-card border border-phoenix-border p-4 sm:p-6 lg:p-8 rounded-sm space-y-6 shadow-sm">
          {/* Thread Header Info */}
          <div className="bg-phoenix-bg border border-phoenix-border p-4 rounded-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-phoenix-accent font-bold block mb-1">
                Strategic Pattern & Category
              </span>
              <h3 className="text-sm sm:text-base font-bold text-phoenix-text">
                {selectedThread.strategicPattern}
              </h3>
            </div>
            <span className="text-xs uppercase px-2.5 py-1 bg-phoenix-elevated border border-phoenix-border text-phoenix-muted font-bold rounded-xs">
              {selectedThread.category.replace("_", " ")}
            </span>
          </div>

          {/* Vertical Timeline Connection Nodes */}
          <div className="relative max-w-3xl mx-auto py-4 space-y-6">
            {/* Vertical Connecting Line */}
            <div
              className="absolute left-6 top-8 bottom-8 w-0.5 bg-phoenix-border hidden sm:block"
              aria-hidden="true"
            />

            {/* NODE 1: Company A Move */}
            <div className="relative flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-6">
              {/* Timeline Node Icon */}
              <div className="w-12 h-12 bg-sky-950/80 border-2 border-sky-600 rounded-full flex items-center justify-center text-sky-400 z-10 flex-shrink-0 shadow-sm">
                <Target className="w-5 h-5" aria-hidden="true" />
              </div>

              {/* Node Card */}
              <div className="flex-1 w-full bg-phoenix-bg border border-phoenix-border p-4 sm:p-5 rounded-xs space-y-3 hover:border-sky-700/80 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-phoenix-border pb-2">
                  <span className="text-xs font-bold uppercase text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded-xs">
                    Company A Move: {selectedThread.companyAMove.company}
                  </span>
                  <span className="text-xs text-phoenix-tertiary tabular-nums">
                    {selectedThread.companyAMove.timestamp}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-phoenix-tertiary font-bold mb-1">THE MOVE</h4>
                  <p className="text-xs sm:text-sm font-sans text-phoenix-text font-medium leading-relaxed">
                    {selectedThread.companyAMove.action}
                  </p>
                </div>

                {selectedThread.companyAMove.sourceUrl && (
                  <a
                    href={selectedThread.companyAMove.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[11px] text-sky-400 hover:underline pt-1"
                  >
                    <span>View Primary Source</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Connection Arrow Indicator */}
            <div className="flex items-center justify-center sm:pl-6 py-1">
              <div className="bg-phoenix-elevated border border-phoenix-border p-1.5 rounded-full text-phoenix-tertiary shadow-xs">
                <ArrowDown className="w-4 h-4 text-phoenix-accent" aria-hidden="true" />
              </div>
            </div>

            {/* NODE 2: Company B Response & Pressure */}
            <div className="relative flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-6">
              {/* Timeline Node Icon */}
              <div className="w-12 h-12 bg-amber-950/80 border-2 border-amber-600 rounded-full flex items-center justify-center text-amber-400 z-10 flex-shrink-0 shadow-sm">
                <Flame className="w-5 h-5" aria-hidden="true" />
              </div>

              {/* Node Card */}
              <div className="flex-1 w-full bg-phoenix-bg border border-phoenix-border p-4 sm:p-5 rounded-xs space-y-3 hover:border-amber-700/80 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-phoenix-border pb-2">
                  <span className="text-xs font-bold uppercase text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-xs">
                    Company B Response: {selectedThread.companyBResponse.company}
                  </span>
                  <span className="text-xs text-phoenix-tertiary tabular-nums">
                    {selectedThread.companyBResponse.timestamp}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-phoenix-tertiary font-bold mb-1">FORCED RESPONSE</h4>
                  <p className="text-xs sm:text-sm font-sans text-phoenix-text font-medium leading-relaxed">
                    {selectedThread.companyBResponse.action}
                  </p>
                </div>

                {selectedThread.companyBResponse.sourceUrl && (
                  <a
                    href={selectedThread.companyBResponse.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[11px] text-sky-400 hover:underline pt-1"
                  >
                    <span>View Primary Source</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Connection Arrow Indicator */}
            <div className="flex items-center justify-center sm:pl-6 py-1">
              <div className="bg-phoenix-elevated border border-phoenix-border p-1.5 rounded-full text-phoenix-tertiary shadow-xs">
                <ArrowDown className="w-4 h-4 text-phoenix-accent" aria-hidden="true" />
              </div>
            </div>

            {/* NODE 3: PHEONIXZ'S Interpretation & Leverage Synthesis */}
            <div className="relative flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-6">
              {/* Timeline Node Icon */}
              <div className="w-12 h-12 bg-orange-950/80 border-2 border-orange-500 rounded-full flex items-center justify-center text-orange-400 z-10 flex-shrink-0 shadow-md">
                <Award className="w-5 h-5" aria-hidden="true" />
              </div>

              {/* Node Card */}
              <div className="flex-1 w-full bg-phoenix-bg/90 border-2 border-orange-500/80 p-5 rounded-xs space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 border-b border-orange-500/30 pb-2">
                  <Award className="w-4 h-4 text-orange-400" aria-hidden="true" />
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    PHEONIXZ TAKE & STRATEGIC LEVERAGE ANALYSIS
                  </h4>
                </div>
                <p className="text-xs sm:text-sm font-sans text-phoenix-text leading-relaxed font-medium">
                  {selectedThread.phoenixzTake}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
