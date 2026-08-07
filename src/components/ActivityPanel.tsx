"use client";

import React from "react";
import { ActivityData, SourceHealth } from "@/types/phoenixz";
import { formatTimeOnly } from "@/lib/date";
import { Activity, Radio, CheckCircle, AlertTriangle, XOctagon } from "lucide-react";

interface ActivityPanelProps {
  activity: ActivityData;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activity }) => {
  const getStatusBadge = (status: SourceHealth) => {
    switch (status) {
      case "OK":
        return (
          <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-xs">
            <CheckCircle className="w-3 h-3" />
            <span>OK</span>
          </span>
        );
      case "DEGRADED":
        return (
          <span className="inline-flex items-center space-x-1 text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>DEGRADED</span>
          </span>
        );
      case "FAIL":
        return (
          <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-xs">
            <XOctagon className="w-3 h-3" />
            <span>FAIL</span>
          </span>
        );
    }
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
              {formatTimeOnly(activity.lastScan)}
            </strong>
          </span>
        </div>

        {/* Pipeline metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-zinc-900 border border-zinc-800 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Candidates Found</span>
            <span className="text-xl font-bold text-zinc-100">{activity.candidatesFound}</span>
            <span className="text-[10px] text-zinc-500 block mt-1">In current scan batch</span>
          </div>

          <div className="bg-zinc-900 border border-emerald-950 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Published</span>
            <span className="text-xl font-bold text-emerald-400">{activity.published}</span>
            <span className="text-[10px] text-zinc-500 block mt-1">Met 72+ threshold</span>
          </div>

          <div className="bg-zinc-900 border border-amber-950 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Watching</span>
            <span className="text-xl font-bold text-amber-400">{activity.watching}</span>
            <span className="text-[10px] text-zinc-500 block mt-1">Saved to Breeth memory</span>
          </div>

          <div className="bg-zinc-900 border border-rose-950 p-3">
            <span className="text-zinc-500 block uppercase mb-1">Rejected</span>
            <span className="text-xl font-bold text-rose-400">{activity.rejected}</span>
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
            {activity.sourceStatuses.length} Data Sources Monitored
          </span>
        </div>

        {/* Source Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-zinc-800">
            <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Source Name</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Last Success</th>
                <th className="px-4 py-2.5">Failures</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {activity.sourceStatuses.map((src) => (
                <tr key={src.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-zinc-200">
                    <div className="flex flex-col">
                      <span>{src.sourceName}</span>
                      <span className="text-[10px] text-zinc-500 truncate max-w-xs font-normal">
                        {src.url}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-xs text-[10px] text-zinc-400">
                      {src.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{src.lastSuccess}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {src.consecutiveFailures > 0 ? (
                      <span className="text-amber-400 font-bold">{src.consecutiveFailures}</span>
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
    </div>
  );
};
