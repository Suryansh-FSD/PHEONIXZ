"use client";

import React, { useState, useMemo } from "react";
import { DecisionLogItem, DecisionType } from "@/types/phoenixz";
import { formatTimeOnly } from "@/lib/date";
import { CheckCircle2, Clock, XCircle, Filter, Search, ChevronDown, ChevronUp } from "lucide-react";

interface DecisionLogProps {
  items: DecisionLogItem[];
}

export const DecisionLog: React.FC<DecisionLogProps> = ({ items }) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.decision === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        item.candidateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [items, statusFilter, searchQuery]);

  const getDecisionBadge = (decision: DecisionType) => {
    switch (decision) {
      case "publish":
        return (
          <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-xs font-mono text-xs">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
            <span>✓ Published</span>
          </span>
        );
      case "watch":
        return (
          <span className="inline-flex items-center space-x-1 text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-xs font-mono text-xs">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>⊘ Watching</span>
          </span>
        );
      case "reject":
        return (
          <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded-xs font-mono text-xs">
            <XCircle className="w-3 h-3" aria-hidden="true" />
            <span>✕ Rejected</span>
          </span>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full bg-phoenix-card border border-phoenix-border rounded-sm overflow-hidden font-mono text-xs shadow-sm">
      {/* Controls & Filter Bar */}
      <div className="bg-phoenix-bg/90 p-3 sm:p-4 border-b border-phoenix-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-phoenix-tertiary" aria-hidden="true" />
          <h2 className="font-bold text-phoenix-text uppercase tracking-wide">
            Autonomous Decision Ledger
          </h2>
          <span className="text-[10px] text-phoenix-tertiary bg-phoenix-elevated px-2 py-0.5 border border-phoenix-border rounded-xs tabular-nums">
            {filteredItems.length} Records
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Status Filters */}
          <div className="flex items-center space-x-1 bg-phoenix-elevated border border-phoenix-border p-1 rounded-xs">
            {[
              { id: "all", label: "All" },
              { id: "publish", label: "Published" },
              { id: "watch", label: "Watching" },
              { id: "reject", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                aria-label={`Filter decisions by ${tab.label}`}
                className={`text-xs px-2.5 py-1 rounded-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                  statusFilter === tab.id
                    ? "bg-phoenix-bg text-phoenix-text font-bold border border-phoenix-border"
                    : "text-phoenix-tertiary hover:text-phoenix-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-phoenix-tertiary" aria-hidden="true" />
            <input
              type="text"
              placeholder="Filter decisions…"
              aria-label="Filter decision ledger"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-phoenix-elevated border border-phoenix-border text-phoenix-text text-xs pl-8 pr-3 py-1.5 rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus:border-phoenix-border-strong w-full"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-phoenix-bg text-phoenix-tertiary uppercase text-[10px] tracking-wider border-b border-phoenix-border">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Decision</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-phoenix-border bg-phoenix-card text-phoenix-text">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      onClick={() => toggleExpand(item.id)}
                      className="hover:bg-phoenix-elevated/60 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-bold text-phoenix-text uppercase">
                        {item.company}
                      </td>
                      <td className="px-4 py-3">{getDecisionBadge(item.decision)}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400 tabular-nums">
                        {item.score}/100
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-phoenix-muted max-w-md truncate">
                        &ldquo;{item.reason}&rdquo;
                      </td>
                      <td className="px-4 py-3 text-phoenix-tertiary tabular-nums whitespace-nowrap text-[11px]">
                        {formatTimeOnly(item.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(item.id);
                          }}
                          aria-expanded={isExpanded}
                          aria-label="Toggle details"
                          className="p-1 text-phoenix-tertiary hover:text-phoenix-text rounded-xs"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Details Drawer Row */}
                    {isExpanded && item.scoreBreakdown && (
                      <tr className="bg-phoenix-bg/90">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="space-y-2 animate-fadeIn">
                            <div className="text-[10px] font-bold text-phoenix-tertiary uppercase">
                              6-Dimension Rubric Sub-Scores
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
                              <div className="bg-phoenix-card border border-phoenix-border p-2 text-center rounded-xs">
                                <span className="text-phoenix-tertiary block">Market Pressure</span>
                                <span className="text-emerald-400 font-bold tabular-nums">
                                  {item.scoreBreakdown.marketPressure}/25
                                </span>
                              </div>
                              <div className="bg-phoenix-card border border-phoenix-border p-2 text-center rounded-xs">
                                <span className="text-phoenix-tertiary block">Strategic Signal</span>
                                <span className="text-sky-400 font-bold tabular-nums">
                                  {item.scoreBreakdown.strategicSignal}/20
                                </span>
                              </div>
                              <div className="bg-phoenix-card border border-phoenix-border p-2 text-center rounded-xs">
                                <span className="text-phoenix-tertiary block">Evidence Quality</span>
                                <span className="text-blue-400 font-bold tabular-nums">
                                  {item.scoreBreakdown.evidenceQuality}/20
                                </span>
                              </div>
                              <div className="bg-phoenix-card border border-phoenix-border p-2 text-center rounded-xs">
                                <span className="text-phoenix-tertiary block">Timeliness</span>
                                <span className="text-purple-400 font-bold tabular-nums">
                                  {item.scoreBreakdown.timeliness}/15
                                </span>
                              </div>
                              <div className="bg-phoenix-card border border-phoenix-border p-2 text-center rounded-xs">
                                <span className="text-phoenix-tertiary block">Persona Fit</span>
                                <span className="text-amber-400 font-bold tabular-nums">
                                  {item.scoreBreakdown.personaFit}/10
                                </span>
                              </div>
                              <div className="bg-phoenix-card border border-phoenix-border p-2 text-center rounded-xs">
                                <span className="text-phoenix-tertiary block">Pattern Continuity</span>
                                <span className="text-orange-400 font-bold tabular-nums">
                                  {item.scoreBreakdown.patternContinuity}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-phoenix-tertiary">
                  No decision records found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
