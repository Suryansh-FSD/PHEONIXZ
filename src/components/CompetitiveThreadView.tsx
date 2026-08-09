"use client";

import React, { useState } from "react";
import { CompetitiveThread } from "@/types/phoenixz";
import { GitCommit, ArrowDown, ExternalLink, Flame, Target, Award, Search, SlidersHorizontal } from "lucide-react";

interface CompetitiveThreadViewProps {
  threads: CompetitiveThread[];
}

export const CompetitiveThreadView: React.FC<CompetitiveThreadViewProps> = ({
  threads,
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    threads[0]?.id || ""
  );

  const selectedThread =
    threads.find((t) => t.id === selectedThreadId) || threads[0];

  return (
    <section className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
          03 // COMPETITIVE THREADS
        </span>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
          Track how competitive signals evolve over time.
        </h2>
      </div>

      {/* Filter / Selector Bar - Identical to Analysis Feed */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center space-x-2">
            {threads.map((thread) => {
              const isSelected = thread.id === selectedThread?.id;
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`text-xs font-sans font-medium px-3.5 py-2 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-orange-50/60 border border-orange-500 text-orange-600 font-semibold shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {thread.topic}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Thread Card & Timeline */}
      {selectedThread && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-6">
          {/* Thread Header Info */}
          <div className="bg-gray-50/80 border border-gray-200 p-4 rounded-lg flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold block mb-1">
                STRATEGIC PATTERN & CATEGORY
              </span>
              <h3 className="text-base font-bold text-gray-900 font-sans">
                {selectedThread.strategicPattern}
              </h3>
            </div>
            <span className="text-xs font-mono uppercase px-2.5 py-1 bg-white border border-gray-200 text-gray-700 font-bold rounded">
              {selectedThread.category.replace("_", " ")}
            </span>
          </div>

          {/* Vertical Timeline Nodes */}
          <div className="relative max-w-3xl mx-auto py-4 space-y-6">
            <div
              className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 hidden sm:block"
              aria-hidden="true"
            />

            {/* NODE 1: Company A Move */}
            <div className="relative flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="w-12 h-12 bg-sky-50 border-2 border-sky-600 rounded-full flex items-center justify-center text-sky-600 z-10 flex-shrink-0 shadow-2xs">
                <Target className="w-5 h-5" />
              </div>

              <div className="flex-1 w-full bg-white border border-gray-200 p-5 rounded-lg space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                    SIGNAL DETECTED: {selectedThread.companyAMove.company}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {selectedThread.companyAMove.timestamp}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-gray-400 block mb-1">THE MOVE</span>
                  <p className="text-xs font-sans text-gray-800 font-normal leading-relaxed">
                    {selectedThread.companyAMove.action}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex items-center justify-center sm:pl-6 py-1">
              <div className="bg-white border border-gray-200 p-1.5 rounded-full text-orange-600 shadow-2xs">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* NODE 2: Company B Response */}
            <div className="relative flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="w-12 h-12 bg-amber-50 border-2 border-amber-600 rounded-full flex items-center justify-center text-amber-600 z-10 flex-shrink-0 shadow-2xs">
                <Flame className="w-5 h-5" />
              </div>

              <div className="flex-1 w-full bg-white border border-gray-200 p-5 rounded-lg space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    COMPETITOR REACTION: {selectedThread.companyBResponse.company}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {selectedThread.companyBResponse.timestamp}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-gray-400 block mb-1">STRATEGIC RESPONSE</span>
                  <p className="text-xs font-sans text-gray-800 font-normal leading-relaxed">
                    {selectedThread.companyBResponse.action}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex items-center justify-center sm:pl-6 py-1">
              <div className="bg-white border border-gray-200 p-1.5 rounded-full text-orange-600 shadow-2xs">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* NODE 3: PhoenixZ Decision & Synthesis */}
            <div className="relative flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="w-12 h-12 bg-orange-50 border-2 border-orange-600 rounded-full flex items-center justify-center text-orange-600 z-10 flex-shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>

              <div className="flex-1 w-full bg-orange-50/40 border border-orange-200 p-5 rounded-lg space-y-2">
                <div className="flex items-center space-x-2 border-b border-orange-200 pb-2">
                  <Award className="w-4 h-4 text-orange-600" />
                  <h4 className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider">
                    PHOENIXZ DECISION & SYNTHESIS
                  </h4>
                </div>
                <p className="text-xs font-sans text-gray-800 leading-relaxed font-medium">
                  {selectedThread.phoenixzTake}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
