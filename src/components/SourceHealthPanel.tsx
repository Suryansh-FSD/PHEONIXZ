"use client";

import React from "react";
import { Radio, CheckCircle, AlertTriangle, XOctagon } from "lucide-react";
import { SourceHealth } from "@/types/phoenixz";

export interface SourceHealthPanelProps {
  statuses?: SourceHealth[];
}

export const SourceHealthPanel: React.FC<SourceHealthPanelProps> = ({
  statuses = [
    { id: "1", name: "OpenAI Blog RSS", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
    { id: "2", name: "Google DeepMind Press", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
    { id: "3", name: "TechCrunch AI News", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
    { id: "4", name: "VentureBeat AI Feed", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
  ],
}) => {
  const getStatusBadge = (status: string) => {
    const s = String(status).toLowerCase();
    if (s === "ok") {
      return (
        <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-xs">
          <CheckCircle className="w-3 h-3" aria-hidden="true" />
          <span>OK</span>
        </span>
      );
    } else if (s === "degraded") {
      return (
        <span className="inline-flex items-center space-x-1 text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-xs">
          <AlertTriangle className="w-3 h-3" aria-hidden="true" />
          <span>DEGRADED</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-xs">
          <XOctagon className="w-3 h-3" aria-hidden="true" />
          <span>DEAD</span>
        </span>
      );
    }
  };

  return (
    <div className="w-full bg-phoenix-card border border-phoenix-border rounded-sm font-mono text-xs overflow-hidden shadow-sm">
      <div className="bg-phoenix-bg/90 p-4 border-b border-phoenix-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <h2 className="font-bold text-phoenix-text uppercase tracking-wide">
            Source Ingestion Health Monitor
          </h2>
        </div>
        <span className="text-phoenix-tertiary text-[11px] tabular-nums">
          {statuses.length} Monitored Sources
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-phoenix-bg text-phoenix-tertiary uppercase text-[10px] tracking-wider border-b border-phoenix-border">
            <tr>
              <th className="px-4 py-3">Source Name</th>
              <th className="px-4 py-3">Last Success</th>
              <th className="px-4 py-3">Failures</th>
              <th className="px-4 py-3">Health Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-phoenix-border bg-phoenix-card text-phoenix-text">
            {statuses.map((src) => (
              <tr key={src.id} className="hover:bg-phoenix-elevated/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-phoenix-text">
                  <span>{src.name}</span>
                </td>
                <td className="px-4 py-3 text-phoenix-tertiary">{src.lastSuccess || "Recently"}</td>
                <td className="px-4 py-3 text-phoenix-tertiary">
                  {src.consecutiveFailures > 0 ? (
                    <span className="text-amber-400 font-bold tabular-nums">{src.consecutiveFailures}</span>
                  ) : (
                    "0"
                  )}
                </td>
                <td className="px-4 py-3">{getStatusBadge(src.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
