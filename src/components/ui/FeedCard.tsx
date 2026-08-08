"use client";

import React, { useState } from "react";
import { FeedItem, MoveType, SourceObject } from "@/types/phoenixz";
import { formatDate } from "@/lib/date";
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Database,
  Share2,
} from "lucide-react";

interface FeedCardProps {
  post: FeedItem;
  className?: string;
  initiallyExpanded?: boolean;
  onSourceClick?: (url: string) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  className = "",
  initiallyExpanded = false,
  onSourceClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const formatTimestamp = (iso: string) => {
    return formatDate(iso);
  };

  const getMoveTypeStyle = (moveType?: MoveType) => {
    switch (moveType) {
      case "launch":
        return "bg-emerald-950/60 dark:bg-emerald-950/60 text-emerald-400 dark:text-emerald-400 border-emerald-800";
      case "pricing":
        return "bg-sky-950/60 dark:bg-sky-950/60 text-sky-400 dark:text-sky-400 border-sky-800";
      case "feature_parity":
        return "bg-purple-950/60 dark:bg-purple-950/60 text-purple-400 dark:text-purple-400 border-purple-800";
      case "partnership":
        return "bg-amber-950/60 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-800";
      default:
        return "bg-zinc-800 dark:bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const rubricDimensions = post.scoreBreakdown
    ? [
        { label: "Market Pressure", score: post.scoreBreakdown.marketPressure, max: 25, color: "bg-emerald-500" },
        { label: "Strategic Signal", score: post.scoreBreakdown.strategicSignal, max: 20, color: "bg-sky-500" },
        { label: "Evidence Quality", score: post.scoreBreakdown.evidenceQuality, max: 20, color: "bg-blue-500" },
        { label: "Timeliness", score: post.scoreBreakdown.timeliness, max: 15, color: "bg-purple-500" },
        { label: "Persona Fit", score: post.scoreBreakdown.personaFit, max: 10, color: "bg-amber-500" },
        { label: "Pattern Continuity", score: post.scoreBreakdown.patternContinuity, max: 10, color: "bg-orange-500" },
      ]
    : [];

  const getSourceUrl = (src: string | SourceObject) =>
    typeof src === "string" ? src : src.url;
  const getSourceTitle = (src: string | SourceObject) =>
    typeof src === "string" ? src : src.title || src.url;

  return (
    <article
      className={`w-full bg-phoenix-card border border-phoenix-border rounded-sm overflow-hidden shadow-sm hover:border-phoenix-border-strong transition-all ${className}`}
    >
      {/* Analyst Report Top Bar */}
      <div className="bg-phoenix-bg/80 px-4 sm:px-6 py-3 border-b border-phoenix-border flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="font-bold text-phoenix-text uppercase">{post.company || "AI MOVES"}</span>
          {post.moveType && (
            <>
              <span className="text-phoenix-tertiary">•</span>
              <span className={`text-[10px] uppercase px-2 py-0.5 border rounded-xs ${getMoveTypeStyle(post.moveType)}`}>
                {post.moveType.replace("_", " ")}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 text-phoenix-tertiary">
          <span className="tabular-nums">{formatTimestamp(post.createdAt)}</span>
          {post.totalScore !== undefined && (
            <div className="flex items-center space-x-1 bg-phoenix-elevated border border-phoenix-border px-2 py-0.5 rounded-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-[10px]">SCORE:</span>
              <span className="font-bold text-emerald-400 tabular-nums">{post.totalScore}/100</span>
            </div>
          )}
        </div>
      </div>

      {/* Move Title */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <h3 className="text-base sm:text-lg font-bold text-phoenix-text leading-snug tracking-tight">
          {post.title}
        </h3>
      </div>

      {/* Section 1: The Move */}
      {post.moveText && (
        <div className="px-4 sm:px-6 py-3 bg-phoenix-elevated/40 border-y border-phoenix-border/50">
          <span className="font-mono text-[10px] uppercase font-bold text-phoenix-tertiary block mb-1">
            01 // The Move
          </span>
          <p className="text-sm text-phoenix-text leading-relaxed font-sans">{post.moveText}</p>
        </div>
      )}

      {/* Section 2: The Angle & Section 3: Strategic Pressure */}
      {(post.angleText || post.pressureText) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-6 py-4 border-b border-phoenix-border font-sans text-xs">
          {post.angleText && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-sky-400 block">
                02 // Strategic Angle
              </span>
              <p className="text-phoenix-secondary leading-relaxed">{post.angleText}</p>
            </div>
          )}
          {post.pressureText && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block">
                03 // Competitive Forcing Function
              </span>
              <p className="text-phoenix-secondary leading-relaxed">{post.pressureText}</p>
            </div>
          )}
        </div>
      )}

      {/* Section 4: PheonixZ Analyst Take */}
      {post.takeText && (
        <div className="px-4 sm:px-6 py-4 bg-orange-950/10 dark:bg-orange-950/20 border-b border-phoenix-border">
          <span className="font-mono text-[10px] uppercase font-bold text-orange-400 block mb-1.5 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            <span>04 // Analyst Synthesis</span>
          </span>
          <p className="text-sm font-medium text-phoenix-text leading-relaxed font-sans">{post.takeText}</p>
        </div>
      )}

      {/* Editorial Rationale Bar */}
      <div className="px-4 sm:px-6 py-3 bg-phoenix-bg flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-phoenix-tertiary">
          <Layers className="w-3.5 h-3.5 text-phoenix-tertiary" />
          <span className="text-[11px] truncate max-w-[280px] sm:max-w-md">
            Rationale: <span className="text-phoenix-secondary font-sans">{post.rationale}</span>
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-[11px] font-bold text-phoenix-accent hover:underline focus:outline-none"
        >
          <span>{isExpanded ? "Collapse Details" : "View Breakdown"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Analytical Breakdown */}
      {isExpanded && (
        <div className="bg-phoenix-bg/90 px-4 sm:px-6 py-4 border-t border-phoenix-border space-y-4 font-mono text-xs">
          {/* Rubric Breakdown */}
          {rubricDimensions.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase font-bold text-phoenix-tertiary mb-2.5 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100-Point Editorial Rubric Breakdown</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {rubricDimensions.map((dim, idx) => (
                  <div key={idx} className="bg-phoenix-elevated border border-phoenix-border p-2.5 rounded-xs space-y-1">
                    <div className="flex justify-between text-[10px] text-phoenix-tertiary">
                      <span>{dim.label}</span>
                      <span className="font-bold text-phoenix-text tabular-nums">{dim.score}/{dim.max}</span>
                    </div>
                    <div className="w-full h-1 bg-phoenix-border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${dim.color}`}
                        style={{ width: `${(dim.score / dim.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Breeth Memory Context */}
          {post.memoryContext && (
            <div className="bg-phoenix-elevated border border-phoenix-border p-3 rounded-xs space-y-1">
              <h4 className="text-[10px] uppercase font-bold text-sky-400 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Retrieved Breeth Context</span>
              </h4>
              <p className="text-xs text-phoenix-secondary font-sans leading-relaxed">{post.memoryContext}</p>
            </div>
          )}

          {/* Timeline Sequence Steps */}
          {post.timelineContext && post.timelineContext.length > 0 && (
            <div className="bg-phoenix-elevated border border-phoenix-border p-3 rounded-xs space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-purple-400 flex items-center space-x-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Competitive Timeline Sequence</span>
              </h4>
              <div className="space-y-1.5 font-sans">
                {post.timelineContext.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs">
                    <span className="font-mono text-[10px] text-phoenix-tertiary tabular-nums mt-0.5">{idx + 1}.</span>
                    <span className="font-bold text-phoenix-text">{step.company}:</span>
                    <span className="text-phoenix-secondary">{step.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Sources */}
          {post.sources && post.sources.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] uppercase font-bold text-phoenix-tertiary">Verified Primary Sources</h4>
              {post.sources.map((src, idx) => {
                const url = getSourceUrl(src);
                const title = getSourceTitle(src);
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onSourceClick && onSourceClick(url)}
                    className="flex items-center justify-between text-xs text-sky-400 hover:underline bg-phoenix-elevated border border-phoenix-border px-3 py-1.5 rounded-xs"
                  >
                    <span className="truncate">{title}</span>
                    <ExternalLink className="w-3 h-3 ml-2 flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
