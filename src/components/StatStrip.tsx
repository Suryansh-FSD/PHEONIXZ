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
      label: "OBSERVED",
      count: stats.observed || 12,
      percentage: "100%",
      icon: Eye,
      iconBg: "bg-emerald-50 text-emerald-600",
      description: "Candidates analyzed",
    },
    {
      id: "rejected",
      label: "REJECTED",
      count: stats.rejected || 1,
      percentage: `${((stats.rejected / (stats.observed || 1)) * 100).toFixed(0)}%`,
      icon: XCircle,
      iconBg: "bg-rose-50 text-rose-600",
      description: "Filtered by quality gates",
    },
    {
      id: "watching",
      label: "WATCHING",
      count: stats.watching || 7,
      percentage: `${((stats.watching / (stats.observed || 1)) * 100).toFixed(0)}%`,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
      description: "Competitive signals tracked",
    },
    {
      id: "published",
      label: "PUBLISHED",
      count: stats.published || 1,
      percentage: `${((stats.published / (stats.observed || 1)) * 100).toFixed(0)}%`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
      description: "Published intelligence briefs",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isSelected = activeFilter === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectFilter && onSelectFilter(item.id)}
            className={`bg-white border rounded-xl p-4 text-left flex items-start justify-between transition-all cursor-pointer shadow-2xs ${
              isSelected ? "border-orange-400 ring-1 ring-orange-200" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start space-x-3.5">
              {/* Icon Circle */}
              <div className={`w-9 h-9 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Metric Text */}
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-500 block mb-0.5">
                  {item.label}
                </span>
                <span className="text-2xl font-extrabold font-mono text-gray-900 tracking-tight block">
                  {item.count}
                </span>
                <span className="text-xs text-gray-500 font-sans mt-0.5 block">
                  {item.description}
                </span>
              </div>
            </div>

            {/* Percentage on Right */}
            <span className="font-mono text-xs font-medium text-gray-400 self-end">
              {item.percentage}
            </span>
          </button>
        );
      })}
    </div>
  );
};
