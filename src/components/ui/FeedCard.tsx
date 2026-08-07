"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Zap, Target, Flame, Award, ShieldCheck, Database, GitCommit } from "lucide-react";
import { EditorialPost } from "@/types/phoenixz";
import { formatTimestamp } from "@/lib/date";

export interface FeedCardProps {
  post: EditorialPost;
  initiallyExpanded?: boolean;
  onSourceClick?: (url: string) => void;
  className?: string;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  initiallyExpanded = false,
  onSourceClick,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const getMoveTypeStyle = (type: string) => {
    switch (type) {
      case "pricing":
        return "bg-emerald-950/60 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-emerald-800";
      case "launch":
        return "bg-sky-950/60 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border-sky-800";
      case "dx_change":
        return "bg-amber-950/60 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-800";
      default:
        return "bg-zinc-800 dark:bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const rubricDimensions = [
    { label: "Market Pressure", score: post.scoreBreakdown.marketPressure, max: 25, color: "bg-emerald-500" },
    { label: "Strategic Signal", score: post.scoreBreakdown.strategicSignal, max: 20, color: "bg-sky-500" },
    { label: "Evidence Quality", score: post.scoreBreakdown.evidenceQuality, max: 20, color: "bg-blue-500" },
    { label: "Timeliness", score: post.scoreBreakdown.timeliness, max: 15, color: "bg-purple-500" },
    { label: "Persona Fit", score: post.scoreBreakdown.personaFit, max: 10, color: "bg-amber-500" },
    { label: "Pattern Continuity", score: post.scoreBreakdown.patternContinuity, max: 10, color: "bg-orange-500" },
  ];

  return (
    <article
      className={`w-full bg-phoenix-card border border-phoenix-border rounded-sm overflow-hidden shadow-sm hover:border-phoenix-border-strong transition-all ${className}`}
    >
      {/* Analyst Report Top Bar */}
      <div className="bg-phoenix-bg/80 px-4 sm:px-6 py-3 border-b border-phoenix-border flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="font-bold text-phoenix-text uppercase">{post.company}</span>
          <span className="text-phoenix-tertiary">•</span>
          <span className={`text-[10px] uppercase px-2 py-0.5 border rounded-xs ${getMoveTypeStyle(post.moveType)}`}>
            {post.moveType.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-phoenix-tertiary">
          <span className="tabular-nums">{formatTimestamp(post.createdAt)}</span>
          <div className="flex items-center space-x-1 bg-phoenix-elevated border border-phoenix-border px-2 py-0.5 rounded-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span className="text-[10px]">SCORE:</span>
            <span className="font-bold text-emerald-400 tabular-nums">{post.totalScore}/100</span>
          </div>
        </div>
      </div>

      {/* Move Title */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <h2 className="text-base sm:text-lg font-bold text-phoenix-text tracking-tight text-pretty">
          {post.title}
        </h2>
      </div>

      {/* 4 Visual Pillars (Analyst Report Style) */}
      <div className="px-4 sm:px-6 py-3 space-y-3.5 font-sans">
        {/* 1. THE MOVE */}
        <div className="bg-phoenix-bg/40 border-l-2 border-zinc-500 pl-3 py-1">
          <div className="flex items-center space-x-1.5 mb-1 font-mono">
            <Zap className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
            <h3 className="text-xs uppercase font-bold text-phoenix-muted tracking-wider">THE MOVE</h3>
          </div>
          <p className="text-xs sm:text-sm text-phoenix-text leading-relaxed">{post.moveText}</p>
        </div>

        {/* 2. THE ANGLE */}
        <div className="bg-phoenix-bg/40 border-l-2 border-sky-500 pl-3 py-1">
          <div className="flex items-center space-x-1.5 mb-1 font-mono">
            <Target className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <h3 className="text-xs uppercase font-bold text-sky-400 tracking-wider">THE ANGLE</h3>
          </div>
          <p className="text-xs sm:text-sm text-phoenix-text leading-relaxed">{post.angleText}</p>
        </div>

        {/* 3. THE PRESSURE */}
        <div className="bg-phoenix-bg/40 border-l-2 border-amber-500 pl-3 py-1">
          <div className="flex items-center space-x-1.5 mb-1 font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <h3 className="text-xs uppercase font-bold text-amber-400 tracking-wider">THE PRESSURE</h3>
          </div>
          <p className="text-xs sm:text-sm text-phoenix-text leading-relaxed">{post.pressureText}</p>
        </div>

        {/* 4. PHEONIXZ TAKE */}
        <div className="bg-phoenix-bg/80 border-l-2 border-orange-500 pl-3 py-2.5 rounded-r-xs">
          <div className="flex items-center space-x-1.5 mb-1 font-mono">
            <Award className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
            <h3 className="text-xs uppercase font-bold text-orange-400 tracking-wider">PHEONIXZ TAKE</h3>
          </div>
          <p className="text-xs sm:text-sm text-phoenix-text font-medium italic leading-relaxed">
            &ldquo;{post.takeText}&rdquo;
          </p>
        </div>
      </div>

      {/* Expandable Rubric Toggle */}
      <div className="border-t border-phoenix-border bg-phoenix-bg/60 px-4 sm:px-6 py-2.5 flex items-center justify-between font-mono text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label="Toggle full analyst report audit drawer"
          className="flex items-center space-x-2 text-phoenix-muted hover:text-phoenix-text transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-xs"
        >
          <span className="uppercase font-semibold">Why this got published</span>
          <span className="text-[10px] bg-phoenix-elevated border border-phoenix-border px-1.5 py-0.2 rounded-xs tabular-nums">
            {post.totalScore} pts
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>

        <span className="text-[11px] text-phoenix-tertiary">
          {post.sources.length} Verified Source{post.sources.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Expandable Analyst Audit Drawer: Score, Reason, Memory, Timeline, Sources */}
      {isExpanded && (
        <div className="bg-phoenix-bg border-t border-phoenix-border p-4 sm:p-6 space-y-4 font-mono text-xs animate-fadeIn">
          {/* 1. Score Breakdown */}
          <div>
            <div className="text-[10px] uppercase font-bold text-phoenix-tertiary mb-2">100-Point Rubric Sub-Scores</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {rubricDimensions.map((dim, idx) => (
                <div key={idx} className="bg-phoenix-card border border-phoenix-border p-2 rounded-xs">
                  <div className="flex justify-between items-center text-[10px] text-phoenix-tertiary mb-1">
                    <span>{dim.label}</span>
                    <span className="font-bold text-phoenix-text tabular-nums">{dim.score}/{dim.max}</span>
                  </div>
                  <div className="w-full bg-phoenix-bg h-1 rounded-full overflow-hidden border border-phoenix-border">
                    <div className={`h-full ${dim.color}`} style={{ width: `${(dim.score / dim.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Reason / Rationale */}
          <div className="bg-phoenix-elevated border border-phoenix-border p-3 rounded-xs space-y-1">
            <h4 className="text-[10px] uppercase font-bold text-phoenix-tertiary">Analyst Evaluation Reason</h4>
            <p className="text-xs text-phoenix-muted leading-relaxed">{post.rationale}</p>
          </div>

          {/* 3. Memory Context */}
          {post.memoryContext && (
            <div className="bg-phoenix-elevated border border-phoenix-border p-3 rounded-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-purple-400">
                <Database className="w-3.5 h-3.5" aria-hidden="true" />
                <h4 className="text-[10px] uppercase font-bold">Breeth Cognitive Memory Context</h4>
              </div>
              <p className="text-xs text-phoenix-muted leading-relaxed">{post.memoryContext}</p>
            </div>
          )}

          {/* 4. Timeline Context */}
          {post.timelineContext && post.timelineContext.length > 0 && (
            <div className="bg-phoenix-elevated border border-phoenix-border p-3 rounded-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-orange-400">
                <GitCommit className="w-3.5 h-3.5" aria-hidden="true" />
                <h4 className="text-[10px] uppercase font-bold">Competitive Move Sequence</h4>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {post.timelineContext.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between border-l-2 border-orange-500 pl-2">
                    <span>
                      <strong className="text-phoenix-text">{step.company}</strong>: {step.action}
                    </span>
                    <span className="text-phoenix-tertiary tabular-nums ml-2">{step.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Sources */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] uppercase font-bold text-phoenix-tertiary">Verified Primary Sources</h4>
            {post.sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onSourceClick && onSourceClick(src.url)}
                className="flex items-center justify-between text-xs text-sky-400 hover:underline bg-phoenix-elevated border border-phoenix-border px-3 py-1.5 rounded-xs"
              >
                <span className="truncate">{src.title}</span>
                <ExternalLink className="w-3 h-3 ml-2 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
