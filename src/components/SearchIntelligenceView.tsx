"use client";

import React, { useState } from "react";
import { SearchIntelligenceResult } from "@/types/phoenixz";
import { searchIntelligence } from "@/services/agentApi";
import { formatTimeOnly } from "@/lib/date";
import {
  Search,
  Sparkles,
  ExternalLink,
  Target,
  ShieldCheck,
  Globe,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const INITIAL_SUGGESTIONS = [
  "Claude",
  "OpenAI",
  "Gemini",
  "OpenAI API pricing",
  "Microsoft Copilot",
  "Claude latest features",
];

export const SearchIntelligenceView: React.FC = () => {
  const [queryInput, setQueryInput] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return INITIAL_SUGGESTIONS.slice(0, 4);
    try {
      const stored = localStorage.getItem("phoenixz_recent_searches");
      return stored ? JSON.parse(stored) : INITIAL_SUGGESTIONS.slice(0, 4);
    } catch {
      return INITIAL_SUGGESTIONS.slice(0, 4);
    }
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchIntelligenceResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const saveRecentSearch = (query: string) => {
    try {
      const updated = [query, ...recentSearches.filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem("phoenixz_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleExecuteSearch = async (targetQuery?: string) => {
    const q = (targetQuery || queryInput).trim();
    if (!q) return;

    setQueryInput(q);
    setIsSearching(true);
    setErrorMsg(null);
    saveRecentSearch(q);

    try {
      const result = await searchIntelligence(q);
      setSearchResult(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to execute intelligence search";
      setErrorMsg(msg);
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="w-full space-y-6 font-sans">
      {/* Page Header */}
      <div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
          07 // SEARCH INTELLIGENCE
        </span>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
          Search PhoenixZ indexed competitive intelligence for any company, product, or strategic signal.
        </h2>
      </div>

      {/* Prominent Search Bar Entry Point */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteSearch();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies, products, launches, features, pricing (e.g. OpenAI, Claude vs Gemini)..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full bg-[#FAFBFC] border border-gray-200 text-gray-900 placeholder-gray-400 text-xs font-sans pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 transition-colors shadow-2xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching || !queryInput.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white font-sans font-bold text-xs px-6 py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2 shadow-xs"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>SEARCHING…</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>SEARCH INTELLIGENCE</span>
              </>
            )}
          </button>
        </form>

        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs font-mono">
            <span className="text-gray-400 text-[10px] uppercase font-bold flex-shrink-0">
              RECENT SEARCHES:
            </span>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {recentSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExecuteSearch(item)}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-sans text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEARCHING STATE */}
      {isSearching && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-3 shadow-2xs animate-fadeIn">
          <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 text-orange-600 mx-auto flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-600 block">
            ANALYZING INTELLIGENCE
          </span>
          <p className="text-xs text-gray-500 font-sans">
            Finding relevant PhoenixZ signals and synthesizing market analysis for &ldquo;{queryInput}&rdquo;…
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {errorMsg && !isSearching && (
        <div className="bg-rose-50/60 border border-rose-200 p-6 rounded-xl text-center space-y-2 font-mono text-xs shadow-2xs">
          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto mb-1" />
          <span className="font-bold text-rose-700 block uppercase">Search Failed</span>
          <p className="text-rose-600 font-sans text-xs max-w-md mx-auto">{errorMsg}</p>
        </div>
      )}

      {/* SEARCH RESULTS DISPLAY */}
      {searchResult && !isSearching && (
        <div className="space-y-6 animate-fadeIn">
          {/* Result Card Container */}
          <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-6">
            {/* Header: Entity Name & Category Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-bold text-base font-mono flex items-center justify-center flex-shrink-0">
                  {searchResult.entity.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-gray-900 font-sans uppercase">
                      {searchResult.entity.name}
                    </h3>
                    <span className="bg-orange-50 text-orange-700 border border-orange-200 font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                      {searchResult.entity.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono block mt-0.5">
                    Parent: {searchResult.entity.parentCompany || "Market Entity"} • Intent: {searchResult.intent.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-md font-mono text-xs font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified PhoenixZ Intelligence</span>
              </div>
            </div>

            {/* 01 // OVERVIEW */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                01 // OVERVIEW
              </span>
              <p className="text-xs text-gray-800 leading-relaxed font-sans font-medium">
                {searchResult.overview}
              </p>
            </div>

            {/* 02 // CURRENT SIGNAL */}
            <div className="bg-[#F8F9FA] border border-gray-200/80 p-4 rounded-lg space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                02 // CURRENT SIGNAL KNOWLEDGE
              </span>
              <p className="text-xs text-gray-800 leading-relaxed font-sans">
                {searchResult.currentSignal}
              </p>
            </div>

            {/* 03 // RECENT MOVES */}
            {searchResult.recentMoves.length > 0 && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                  03 // RECENT MOVES & SIGNAL RECORDS ({searchResult.recentMoves.length})
                </span>

                <div className="space-y-2.5">
                  {searchResult.recentMoves.map((move, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50/70 border border-gray-200 p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded">
                            {move.category}
                          </span>
                          <span className="font-bold text-gray-900 font-sans">{move.company}</span>
                        </div>
                        <p className="text-xs text-gray-800 font-sans font-medium">{move.title}</p>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-500 font-mono text-[11px]">
                        <span>{formatTimeOnly(move.timestamp)}</span>
                        {move.score && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
                            {move.score}/100
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 04 // COMPETITIVE IMPACT */}
            <div className="bg-orange-50/40 border border-orange-200 p-4 rounded-lg space-y-1.5">
              <div className="flex items-center space-x-2 text-orange-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>04 // COMPETITIVE IMPACT & FORCING FUNCTION</span>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed font-sans font-medium">
                {searchResult.competitiveImpact}
              </p>
            </div>

            {/* 05 // VERIFIED SOURCES */}
            {searchResult.sources.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  05 // VERIFIED SOURCE REFERENCES
                </span>
                <div className="flex flex-wrap gap-2">
                  {searchResult.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-200 hover:border-orange-500 text-gray-700 hover:text-orange-600 px-3 py-1.5 rounded-md font-mono text-[11px] inline-flex items-center space-x-1.5 transition-colors shadow-2xs"
                    >
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span>{src.title || src.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED ENTITIES */}
            <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block mb-2">
                  RELATED COMPANIES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {searchResult.relatedEntities.companies.map((company, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecuteSearch(company)}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded font-sans text-xs transition-colors cursor-pointer"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block mb-2">
                  RELATED PRODUCTS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {searchResult.relatedEntities.products.map((prod, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecuteSearch(prod)}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded font-sans text-xs transition-colors cursor-pointer"
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* EMPTY / INITIAL SUGGESTIONS STATE */}
      {!searchResult && !isSearching && !errorMsg && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-orange-600 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>EXPLORE PHOENIXZ COMPETITIVE INTELLIGENCE</span>
          </div>

          <p className="text-xs text-gray-600 font-sans leading-relaxed">
            Enter any AI company name, model title, feature announcement, or competitive comparison to query PhoenixZ&apos;s indexed intelligence engine.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
            {INITIAL_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteSearch(item)}
                className="bg-gray-50 hover:bg-orange-50/60 border border-gray-200 hover:border-orange-300 text-gray-800 p-3 rounded-lg text-left transition-all cursor-pointer space-y-1 shadow-2xs group"
              >
                <div className="flex items-center justify-between text-gray-400 group-hover:text-orange-600">
                  <span className="text-[10px] uppercase font-bold">Query</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-gray-900 font-sans text-xs block">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
