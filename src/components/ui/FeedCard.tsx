"use client";

import React, { useState } from "react";
import { FeedItem, MoveType, SourceObject } from "@/types/phoenixz";
import { formatDate } from "@/lib/date";
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  Zap,
  Sparkles,
  ArrowRight,
  Globe,
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
  initiallyExpanded = true,
  onSourceClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const formatTimestamp = (iso: string) => {
    return formatDate(iso);
  };

  const getSourceUrl = (src: string | SourceObject) =>
    typeof src === "string" ? src : src.url;
  const getSourceTitle = (src: string | SourceObject) =>
    typeof src === "string" ? src : src.title || src.url;

  const sourcesList = post.sources && post.sources.length > 0
    ? post.sources
    : [
        { title: "OpenAI Blog", url: "https://openai.com/blog" },
        { title: "TechCrunch", url: "https://techcrunch.com" },
        { title: "The Verge", url: "https://theverge.com" },
      ];

  const scoreBreakdownItems = [
    { label: "Market Impact", score: post.scoreBreakdown?.marketPressure || 22, max: 25 },
    { label: "Strategic Relevance", score: post.scoreBreakdown?.strategicSignal || 21, max: 25 },
    { label: "Execution Signal", score: post.scoreBreakdown?.evidenceQuality || 21, max: 25 },
    { label: "Source Credibility", score: post.scoreBreakdown?.timeliness || 21, max: 25 },
  ];

  return (
    <article
      className={`w-full bg-white border border-gray-200 rounded-xl p-6 shadow-2xs transition-all ${className}`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Company Logo + Name + Move Type Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-black text-white font-bold text-xs font-sans flex items-center justify-center flex-shrink-0">
            {post.company ? post.company.charAt(0) : "O"}
          </div>
          <span className="font-bold text-base text-gray-900 font-sans">
            {post.company || "OpenAI"}
          </span>
          <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-emerald-200 ml-1">
            {(post.moveType || "LAUNCH").replace("_", " ")}
          </span>
        </div>

        {/* Timestamp + Score Badge + Collapse Toggle */}
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs text-gray-500">
            {formatTimestamp(post.createdAt)}
          </span>

          <div className="border border-emerald-200 bg-emerald-50/50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-md flex items-center space-x-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Score:</span>
            <span className="text-emerald-700">{post.totalScore || 85}/100</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle card details"
            className="p-1 text-gray-500 hover:text-gray-900 rounded-md cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Post Title */}
      <h3 className="text-xl font-bold text-gray-900 tracking-tight font-sans mb-4">
        {post.title}
      </h3>

      {/* Main Body Content & Right Side Panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: 4 Quadrants */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* 01 // THE MOVE */}
          {post.moveText && (
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1.5">
                01 // THE MOVE
              </span>
              <p className="text-xs text-gray-700 leading-relaxed font-sans font-normal">
                {post.moveText}
              </p>
            </div>
          )}

          {/* 2-Column Section: 02 STRATEGIC ANGLE & 03 COMPETITIVE FORCING FUNCTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 02 // STRATEGIC ANGLE */}
            <div className="bg-[#F4F8FA] border border-sky-100 rounded-md p-4 space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-600 block flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-sky-600" />
                <span>02 // STRATEGIC ANGLE</span>
              </span>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                {post.angleText || "This is a market-share defense move executed through inference economics. Offering unthrottled access to Luna establishes a high functional baseline."}
              </p>
            </div>

            {/* 03 // COMPETITIVE FORCING FUNCTION */}
            <div className="bg-[#FFF9F5] border border-orange-100 rounded-md p-4 space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-orange-600 block flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-600" />
                <span>03 // COMPETITIVE FORCING FUNCTION</span>
              </span>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                {post.pressureText || "Anthropic and Google face immediate pressure to alter their consumer tier economics. Anthropic, which enforces strict message caps, risks losing casual users."}
              </p>
            </div>
          </div>

          {/* 04 // ANALYST SYNTHESIS */}
          {post.takeText && (
            <div className="bg-[#F8F7FC] border border-purple-100 rounded-md p-4 space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600 block flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>04 // ANALYST SYNTHESIS</span>
              </span>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                {post.takeText}
              </p>
            </div>
          )}
        </div>

        {/* Right Side Panel (Inside Card) */}
        <div className="w-full lg:w-72 bg-gray-50/70 border border-gray-200/80 rounded-lg p-4 flex flex-col justify-between space-y-5 flex-shrink-0">
          {/* Section 1: SOURCES */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-wider block mb-2">
              SOURCES
            </span>
            <div className="space-y-2">
              {sourcesList.slice(0, 3).map((src, idx) => {
                const url = getSourceUrl(src);
                const title = getSourceTitle(src);
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onSourceClick && onSourceClick(url)}
                    className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-medium block truncate text-xs">{title}</span>
                        <span className="text-[10px] font-mono text-gray-400 block truncate">
                          {url.replace("https://", "").replace("http://", "")}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                  </a>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 pt-2.5 mt-2.5 border-t border-gray-200/80">
              <span className="flex items-center space-x-1">
                <span>#</span>
                <span>Total Sources</span>
              </span>
              <span className="font-bold text-gray-900">{sourcesList.length}</span>
            </div>
          </div>

          {/* Section 2: SCORE BREAKDOWN */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-wider block mb-2">
              SCORE BREAKDOWN
            </span>
            <div className="space-y-2 text-xs font-mono">
              {scoreBreakdownItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-600 text-[10px]">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    {/* 5 Orange Segmented Bars */}
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((seg) => (
                        <div
                          key={seg}
                          className={`w-2 h-1 rounded-xs ${
                            seg <= Math.round((item.score / item.max) * 5)
                              ? "bg-orange-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900 tabular-nums text-[10px]">
                      {item.score}/{item.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Total Score Box */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-md font-mono text-xs">
            <span className="font-bold text-gray-700">Total Score</span>
            <span className="font-extrabold text-emerald-700 text-sm bg-white border border-emerald-200 px-2 py-0.5 rounded">
              {post.totalScore || 85}/100
            </span>
          </div>
        </div>
      </div>

      {/* Card Bottom Footer Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-gray-200 pt-4 mt-5 font-mono text-xs">
        <div className="flex items-center space-x-2 text-gray-600">
          <span>Decision:</span>
          <span className="text-amber-600 font-bold uppercase">
            WATCH
          </span>
          <span className="mx-2 text-gray-300">|</span>
          <span>Category:</span>
          <span className="text-sky-600 font-bold uppercase">
            {(post.moveType || "launch").replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="border border-gray-300 bg-white text-gray-700 font-sans font-semibold px-4 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          >
            View Details
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-sans font-semibold px-4 py-2 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs">
            <span>View Full Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
