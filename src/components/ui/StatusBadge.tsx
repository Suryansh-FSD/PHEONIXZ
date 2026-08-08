"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";

export type StatusType = "live" | "publish" | "watch" | "reject" | "degraded";

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showDot = true,
  className = "",
}) => {
  const configs = {
    live: {
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/80",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
      defaultLabel: "LIVE",
    },
    publish: {
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/80",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
      defaultLabel: "✓ Published",
    },
    watch: {
      color: "text-amber-400 bg-amber-950/60 border-amber-800/80",
      dot: "bg-amber-500",
      icon: Clock,
      defaultLabel: "⊘ Watching",
    },
    reject: {
      color: "text-rose-400 bg-rose-950/60 border-rose-800/80",
      dot: "bg-rose-500",
      icon: XCircle,
      defaultLabel: "✕ Rejected",
    },
    degraded: {
      color: "text-amber-400 bg-amber-950/60 border-amber-800/80",
      dot: "bg-amber-500",
      icon: AlertTriangle,
      defaultLabel: "DEGRADED",
    },
  };

  const config = configs[status] || configs.live;
  const displayText = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-mono text-xs px-2 py-0.5 border rounded-xs ${config.color} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {status === "live" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
        </span>
      )}
      <span>{displayText}</span>
    </span>
  );
};
