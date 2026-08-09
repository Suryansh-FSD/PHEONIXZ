"use client";

import React from "react";
import { ActivityData } from "@/types/phoenixz";
import { formatDate } from "@/lib/date";
import { Activity, Radio, CheckCircle, Search, SlidersHorizontal, ArrowRight, Zap, ShieldCheck } from "lucide-react";

interface ActivityPanelProps {
  activity: ActivityData | null;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activity }) => {
  const activityStream = [
    {
      time: "10:42:18 PM",
      stage: "SOURCE INGESTION",
      source: "OpenAI Blog RSS",
      event: "New competitive signal detected: GPT-5.6 Sol update",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      time: "10:42:22 PM",
      stage: "AGENT ANALYSIS",
      source: "Researcher Agent",
      event: "Candidate classified as Launch & Feature Parity",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      time: "10:43:04 PM",
      stage: "DECISION ENGINE",
      source: "Editorial Judge",
      event: "Candidate evaluated: Scored 85 / 100 — Threshold Met",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      time: "10:43:31 PM",
      stage: "PUBLISHER",
      source: "PhoenixZ Writer",
      event: "Intelligence brief generated and stored in Breeth vector memory",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <section className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
          06 // INGESTION & ACTIVITY
        </span>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
          Monitor the real-time flow of intelligence through PhoenixZ.
        </h2>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>
          <button className="text-xs font-sans font-semibold px-3.5 py-2 rounded-md bg-orange-50/60 border border-orange-500 text-orange-600 shadow-2xs">
            Live Stream
          </button>
        </div>
      </div>

      {/* Activity Stream Entries */}
      <div className="space-y-4 font-mono text-xs">
        {activityStream.map((item, idx) => (
          <article
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-gray-400 font-mono text-xs">{item.time}</span>
                <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${item.badgeColor}`}>
                  {item.stage}
                </span>
              </div>
              <span className="text-gray-500 text-xs font-mono">{item.source}</span>
            </div>

            <p className="text-xs font-sans text-gray-900 font-medium leading-relaxed">
              {item.event}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
