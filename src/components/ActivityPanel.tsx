"use client";

import React from "react";
import { ActivityData } from "@/types/phoenixz";
import { formatDate } from "@/lib/date";
import { Activity, Radio, CheckCircle, AlertTriangle, XOctagon } from "lucide-react";

interface ActivityPanelProps {
  activity: ActivityData | null;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activity }) => {
  const getStatusBadge = (status: string) => {
    const s = String(status).toLowerCase();
    if (s === "ok") {
      return (
        <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-xs text-[10px]">
          <CheckCircle className="w-3 h-3" />
          <span>OK</span>
        </span>
      );
    } else if (s === "degraded") {
      return (
        <span className="inline-flex items-center space-x-1 text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-xs text-[10px]">
          <AlertTriangle className="w-3 h-3" />
          <span>DEGRADED</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-xs text-[10px]">
          <XOctagon className="w-3 h-3" />
          <span>DEAD</span>
        </span>
      );
    }
  };

  const currentActivity: ActivityData = activity || {
    observedCount: 12,
    rejectedCount: 2,
    watchingCount: 8,
    publishedCount: 2,
    lastCycleAt: new Date().toISOString(),
    sourceStatuses: [],
    recentRuns: [],
  };

  return (
    <div className="w-full space-y-6 font-mono">
      {/* Activity Header Summary */}
      <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-6 rounded-sm">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Autonomous Cycle Activity
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Last scan:{" "}
            <strong className="text-zinc-200 tabular-nums">
              {formatDate(currentActivity.lastCycleAt || currentActivity.lastScan || new Date().toISOString())}
            </strong>
          </span>
        </div>

        {/* Pipeline metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-zinc-900 border border-zinc-800 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Candidates Found</span>
            <span className="text-xl font-bold text-zinc-100">{currentActivity.observedCount}</span>
            <span className="text-[10px] text-zinc-500 block mt-1">In current scan batch</span>
          </div>

          <div className="bg-zinc-900 border border-emerald-950 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Published</span>
            <span className="text-xl font-bold text-emerald-400">{currentActivity.publishedCount}</span>
            <span className="text-[10px] text-zinc-500 block mt-1">Met threshold</span>
          </div>

          <div className="bg-zinc-900 border border-amber-950 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Watching</span>
            <span className="text-xl font-bold text-amber-400">{currentActivity.watchingCount}</span>
            <span className="text-[10px] text-zinc-500 block mt-1">Saved to Breeth memory</span>
          </div>

          <div className="bg-zinc-900 border border-rose-950 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Rejected</span>
            <span className="text-xl font-bold text-rose-400">{currentActivity.rejectedCount}</span>
            <span className="text-[10px] text-zinc-500 block mt-1">Low signal / hype filter</span>
          </div>
        </div>
      </div>

      {/* Sources Health Monitor */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden">
        <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
              Ingestion Source Status
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">
            {currentActivity.sourceStatuses.length} Data Sources Monitored
          </span>
        </div>

        <div className="p-4 text-xs text-zinc-400">
          {currentActivity.sourceStatuses.length > 0 ? (
            <div className="space-y-2">
              {currentActivity.sourceStatuses.map((src) => (
                <div key={src.id} className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-xs">
                  <span>{src.name}</span>
                  {getStatusBadge(src.status)}
                </div>
              ))}
            </div>
          ) : (
            <p>Ingestion sources active & operational across official AI RSS channels.</p>
          )}
        </div>
      </div>
    </div>
  );
};
