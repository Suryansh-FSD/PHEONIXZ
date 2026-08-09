"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Activity, SlidersHorizontal, Search, ChevronDown, ChevronUp } from "lucide-react";
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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(runs[0]?.id || null);

  const filteredRuns = runs.filter((r) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "success") return r.status === "success";
    if (filterStatus === "partial") return r.status === "partial";
    return true;
  });

  return (
    <section className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
          04 // RUN HISTORY
        </span>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
          Review PhoenixZ autonomous execution cycles.
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center space-x-2">
            {[
              { id: "all", label: "All Runs" },
              { id: "success", label: "Completed" },
              { id: "partial", label: "Partial" },
            ].map((tab) => {
              const isSelected = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`text-xs font-sans font-medium px-3.5 py-2 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-orange-50/60 border border-orange-500 text-orange-600 font-semibold shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Execution Cycle Cards */}
      <div className="space-y-4 font-mono text-xs">
        {filteredRuns.map((run) => {
          const isExpanded = expandedId === run.id;
          return (
            <article
              key={run.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-sm text-gray-900 uppercase">
                    RUN #{run.id.replace("run-", "")}
                  </span>
                  {run.status === "success" ? (
                    <span className="bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>COMPLETED</span>
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 font-bold uppercase text-[10px] px-2 py-0.5 rounded border border-amber-200 inline-flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>PARTIAL</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-gray-500">
                  <span>{formatTimeOnly(run.startedAt)}</span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : run.id)}
                    className="p-1 text-gray-500 hover:text-gray-900 rounded cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cycle Execution Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 border border-gray-200/80 p-3.5 rounded-lg">
                <div>
                  <span className="text-gray-500 text-[10px] block">DISCOVERED</span>
                  <span className="font-extrabold text-gray-900 text-sm">{run.candidatesFound} signals</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">ANALYZED</span>
                  <span className="font-extrabold text-gray-900 text-sm">{run.published + run.watched + run.rejected} candidates</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">PUBLISHED</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{run.published} brief</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">DURATION</span>
                  <span className="font-extrabold text-gray-900 text-sm">14.2s</span>
                </div>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="pt-3 border-t border-gray-200 space-y-3 animate-fadeIn">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                    CYCLE PIPELINE STAGE BREAKDOWN
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
                    <div className="bg-white border border-gray-200 p-3 rounded space-y-1">
                      <span className="font-mono font-bold text-gray-900 text-[11px] block">DISCOVERY</span>
                      <p className="text-gray-600 text-[11px]">4 RSS sources polled cleanly.</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded space-y-1">
                      <span className="font-mono font-bold text-gray-900 text-[11px] block">EDITORIAL JUDGMENT</span>
                      <p className="text-gray-600 text-[11px]">1 Published, {run.watched} Watched, {run.rejected} Rejected.</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded space-y-1">
                      <span className="font-mono font-bold text-gray-900 text-[11px] block">VECTOR MEMORY</span>
                      <p className="text-gray-600 text-[11px]">Breeth AI context stored.</p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
