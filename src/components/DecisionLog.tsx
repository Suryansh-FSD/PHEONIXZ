"use client";

import React, { useState, useMemo } from "react";
import { DecisionLogItem, DecisionType } from "@/types/phoenixz";
import { formatTimeOnly } from "@/lib/date";
import { CheckCircle2, Clock, XCircle, SlidersHorizontal, Search, ChevronDown, ChevronUp, ShieldCheck, Target, Layers, Globe, ExternalLink } from "lucide-react";

interface DecisionLogProps {
  items: DecisionLogItem[];
}

export const DecisionLog: React.FC<DecisionLogProps> = ({ items }) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

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
          <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>PUBLISHED</span>
          </span>
        );
      case "watch":
        return (
          <span className="bg-amber-50 text-amber-700 font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-amber-200 inline-flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>WATCHING</span>
          </span>
        );
      case "reject":
        return (
          <span className="bg-rose-50 text-rose-700 font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-rose-200 inline-flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>REJECTED</span>
          </span>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
          02 // DECISION LEDGER
        </span>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
          Audit every intelligence decision made by PhoenixZ.
        </h2>
      </div>

      {/* Filter / Search Bar - Identical to Analysis Feed */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Left: Filter Icon & Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center space-x-2">
            {[
              { id: "all", label: "All" },
              { id: "publish", label: "Published" },
              { id: "watch", label: "Watching" },
              { id: "reject", label: "Rejected" },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
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

        {/* Right: Search Box */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search decisions or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-xs font-sans pl-9 pr-3 py-2 rounded-md focus:outline-none focus:border-gray-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Decision Entries Styled as Brief Cards */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <article
                key={item.id}
                className="w-full bg-white border border-gray-200 rounded-xl p-5 shadow-2xs transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-xs font-sans flex items-center justify-center flex-shrink-0">
                      {item.company.charAt(0)}
                    </div>
                    <span className="font-bold text-base text-gray-900 font-sans uppercase">
                      {item.company}
                    </span>
                    {getDecisionBadge(item.decision)}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs text-gray-500">
                      {formatTimeOnly(item.timestamp)}
                    </span>

                    <div className="border border-emerald-200 bg-emerald-50/50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-md flex items-center space-x-1.5 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Score:</span>
                      <span className="text-emerald-700">{item.score}/100</span>
                    </div>

                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="p-1 text-gray-500 hover:text-gray-900 rounded-md cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Candidate Title */}
                <h3 className="text-base font-bold text-gray-900 font-sans mb-3">
                  {item.candidateTitle}
                </h3>

                {/* Main Rationale Preview */}
                <div className="bg-[#F8F9FA] border border-gray-200/80 rounded-md p-3.5 mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    DECISION RATIONALE
                  </span>
                  <p className="text-xs text-gray-700 font-sans leading-relaxed">
                    &ldquo;{item.reason}&rdquo;
                  </p>
                </div>

                {/* Expandable Details Drawer */}
                {isExpanded && item.scoreBreakdown && (
                  <div className="pt-3 border-t border-gray-200 space-y-4 animate-fadeIn">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                      SCORE BREAKDOWN & SUB-RUBRIC AUDIT
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-xs">
                      <div className="bg-gray-50 border border-gray-200 p-2.5 rounded text-center">
                        <span className="text-gray-500 text-[10px] block">Market Impact</span>
                        <span className="font-bold text-gray-900 text-xs">{item.scoreBreakdown.marketPressure}/25</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-2.5 rounded text-center">
                        <span className="text-gray-500 text-[10px] block">Strategic Signal</span>
                        <span className="font-bold text-gray-900 text-xs">{item.scoreBreakdown.strategicSignal}/20</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-2.5 rounded text-center">
                        <span className="text-gray-500 text-[10px] block">Evidence Quality</span>
                        <span className="font-bold text-gray-900 text-xs">{item.scoreBreakdown.evidenceQuality}/20</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-2.5 rounded text-center">
                        <span className="text-gray-500 text-[10px] block">Timeliness</span>
                        <span className="font-bold text-gray-900 text-xs">{item.scoreBreakdown.timeliness}/15</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-2.5 rounded text-center">
                        <span className="text-gray-500 text-[10px] block">Persona Fit</span>
                        <span className="font-bold text-gray-900 text-xs">{item.scoreBreakdown.personaFit}/10</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-2.5 rounded text-center">
                        <span className="text-gray-500 text-[10px] block">Pattern Continuity</span>
                        <span className="font-bold text-gray-900 text-xs">{item.scoreBreakdown.patternContinuity}/10</span>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 p-12 text-center rounded-lg space-y-2">
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider">
              No Decision Log Records Match Filter
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
