"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  isActive = false,
  onClick,
  className = "",
}) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-emerald-400";
      case "down":
        return "text-rose-400";
      default:
        return "text-zinc-500";
    }
  };

  return (
    <div
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={(e) => onClick && (e.key === "Enter" || e.key === " ") && onClick()}
      className={`p-3.5 rounded-sm bg-zinc-900 border text-left font-mono transition-all ${
        onClick ? "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400" : ""
      } ${
        isActive
          ? "border-zinc-500 bg-zinc-800 shadow-sm"
          : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90"
      } ${className}`}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-zinc-500" aria-hidden="true" />}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-bold text-zinc-100 tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span className={`text-[11px] tabular-nums font-bold ${getTrendColor()}`}>
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="text-[11px] text-zinc-500 mt-1 truncate">{subtext}</p>}
    </div>
  );
};
