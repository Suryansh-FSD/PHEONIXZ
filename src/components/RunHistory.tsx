"use client";

import React from "react";
import { CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { Run } from "@/types/phoenixz";
import { formatTimeOnly } from "@/lib/date";

export interface RunHistoryProps {
  runs?: Run[];
}

const defaultRunHistory: Run[] = [
  {
    id: "run-901",
    startedAt: "2026-08-07T21:28:00Z",
    finishedAt: "2026-08-07T21:28:14Z",
    status: "success",
    candidatesFound: 8,
    published: 1,
    watched: 2,
    rejected: 5,
    errors: 0,
  },
  {
    id: "run-902",
    startedAt: "2026-08-07T21:13:00Z",
    finishedAt: "2026-08-07T21:13:12Z",
    status: "success",
    candidatesFound: 6,
    published: 1,
    watched: 1,
    rejected: 4,
    errors: 0,
  },
  {
    id: "run-903",
    startedAt: "2026-08-07T20:58:00Z",
    finishedAt: "2026-08-07T20:58:15Z",
    status: "success",
    candidatesFound: 12,
    published: 0,
    watched: 3,
    rejected: 9,
    errors: 0,
  },
  {
    id: "run-904",
    startedAt: "2026-08-07T20:43:00Z",
    finishedAt: "2026-08-07T20:43:18Z",
    status: "partial",
    candidatesFound: 5,
    published: 0,
    watched: 1,
    rejected: 4,
    errors: 1,
  },
];

export const RunHistory: React.FC<RunHistoryProps> = ({
  runs = defaultRunHistory,
}) => {
  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-sm font-mono text-xs overflow-hidden">
      <div className="bg-zinc-900/90 p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-orange-400" aria-hidden="true" />
          <h2 className="font-bold text-zinc-100 uppercase tracking-wide">
            Autonomous Cycle Run History
          </h2>
        </div>
        <span className="text-zinc-500 text-[11px] tabular-nums">
          {runs.length} Recorded Cycles
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3">Run ID</th>
              <th className="px-4 py-3">Execution Time</th>
              <th className="px-4 py-3">Found</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Watched</th>
              <th className="px-4 py-3">Rejected</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-zinc-900/60 transition-colors">
                <td className="px-4 py-3 font-bold text-zinc-200">{run.id}</td>
                <td className="px-4 py-3 text-zinc-400 tabular-nums">
                  {formatTimeOnly(run.startedAt)}
                </td>
                <td className="px-4 py-3 font-bold text-zinc-100 tabular-nums">{run.candidatesFound}</td>
                <td className="px-4 py-3 text-emerald-400 font-bold tabular-nums">{run.published}</td>
                <td className="px-4 py-3 text-amber-400 font-bold tabular-nums">{run.watched}</td>
                <td className="px-4 py-3 text-rose-400 font-bold tabular-nums">{run.rejected}</td>
                <td className="px-4 py-3">
                  {run.status === "success" ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-xs text-[10px]">
                      <CheckCircle className="w-3 h-3" />
                      <span>SUCCESS</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-xs text-[10px]">
                      <AlertTriangle className="w-3 h-3" />
                      <span>PARTIAL</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
