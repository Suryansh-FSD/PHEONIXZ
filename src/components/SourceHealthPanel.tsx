"use client";

import React, { useState } from "react";
import { Radio, CheckCircle, AlertTriangle, XOctagon, SlidersHorizontal, Search, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { SourceHealth } from "@/types/phoenixz";

export interface SourceHealthPanelProps {
  statuses?: SourceHealth[];
}

export const SourceHealthPanel: React.FC<SourceHealthPanelProps> = ({
  statuses = [
    { id: "1", name: "OpenAI Blog RSS", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
    { id: "2", name: "Google DeepMind Press", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
    { id: "3", name: "TechCrunch AI Feed", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
    { id: "4", name: "VentureBeat AI News", status: "ok", consecutiveFailures: 0, updatedAt: "Just now" },
  ],
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(statuses[0]?.id || null);

  const getStatusBadge = (status: string) => {
    const s = String(status).toLowerCase();
    if (s === "ok") {
      return (
        <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] uppercase px-2.5 py-0.5 rounded border border-emerald-200 inline-flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>● HEALTHY</span>
        </span>
      );
    } else if (s === "degraded") {
      return (
        <span className="bg-amber-50 text-amber-700 font-mono font-bold text-[10px] uppercase px-2.5 py-0.5 rounded border border-amber-200 inline-flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>● DEGRADED</span>
        </span>
      );
    } else {
      return (
        <span className="bg-rose-50 text-rose-700 font-mono font-bold text-[10px] uppercase px-2.5 py-0.5 rounded border border-rose-200 inline-flex items-center space-x-1">
          <XOctagon className="w-3 h-3 text-rose-600" />
          <span>● DEAD</span>
        </span>
      );
    }
  };

  return (
    <section className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
          05 // SOURCE HEALTH
        </span>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
          Monitor the sources powering PhoenixZ intelligence.
        </h2>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>
          <button className="text-xs font-sans font-semibold px-3.5 py-2 rounded-md bg-orange-50/60 border border-orange-500 text-orange-600 shadow-2xs">
            All Sources ({statuses.length})
          </button>
        </div>
      </div>

      {/* Source Cards */}
      <div className="space-y-4 font-mono text-xs">
        {statuses.map((src) => {
          const isExpanded = expandedId === src.id;
          return (
            <article
              key={src.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-900 font-sans block">
                      {src.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      Updated {src.updatedAt || "Just now"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {getStatusBadge(src.status)}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : src.id)}
                    className="p-1 text-gray-500 hover:text-gray-900 rounded cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Source Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 border border-gray-200/80 p-3.5 rounded-lg">
                <div>
                  <span className="text-gray-500 text-[10px] block">LAST CHECK</span>
                  <span className="font-bold text-gray-900 text-xs">Just now</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">LATEST SIGNAL</span>
                  <span className="font-bold text-gray-900 text-xs">OpenAI Update</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">RESPONSE TIME</span>
                  <span className="font-bold text-emerald-600 text-xs">142ms</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">FAILURES</span>
                  <span className="font-bold text-gray-900 text-xs">{src.consecutiveFailures}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
