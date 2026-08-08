"use client";

import React from "react";
import { StatStripData } from "@/types/phoenixz";
import { Eye, XCircle, Clock, CheckCircle2 } from "lucide-react";

interface StatStripProps {
  stats: StatStripData;
  activeFilter?: string;
  onSelectFilter?: (filter: string) => void;
}

export const StatStrip: React.FC<StatStripProps> = ({
  stats,
  activeFilter = "all",
  onSelectFilter,
}) => {
  const statItems = [
    {
      id: "observed",
      label: "Observed",
      count: stats.observed,
      icon: Eye,
      color: "text-zinc-300",
      borderColor: "border-zinc-800",
      description: "Total candidate signals ingested",
    },
    {
      id: "rejected",
      label: "Rejected",
      count: stats.rejected,
      icon: XCircle,
      color: "text-rose-400",
      borderColor: "border-rose-950/40",
      description: "<55 score or hype filter hit",
    },
    {
      id: "watching",
      label: "Watching",
      count: stats.watching,
      icon: Clock,
      color: "text-amber-400",
      borderColor: "border-amber-950/40",
      description: "55-71 score saved for memory tracking",
    },
    {
      id: "published",
      label: "Published",
      count: stats.published,
      icon: CheckCircle2,
      color: "text-emerald-400",
      borderColor: "border-emerald-950/40",
      description: "72+ score quality verified takes",
    },
  ];

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeFilter === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectFilter && onSelectFilter(item.id)}
              aria-label={`Filter by ${item.label}`}
              className={`flex flex-col p-3.5 sm:p-4 min-h-[72px] justify-between rounded-xs bg-phoenix-card border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                isSelected
                  ? "border-phoenix-border-strong bg-phoenix-elevated shadow-sm"
                  : `${item.borderColor} hover:border-phoenix-border-strong hover:bg-phoenix-elevated`
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color}`} aria-hidden="true" />
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold font-mono text-zinc-100 tabular-nums">
                  {item.count.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                  {((item.count / (stats.observed || 1)) * 100).toFixed(0)}%
                </span>
              </div>

              <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
