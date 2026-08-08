"use client";

import React from "react";

export interface TimelineStep {
  title: string;
  subtitle?: string;
  timestamp?: string;
  status?: "completed" | "active" | "pending";
  children?: React.ReactNode;
}

export interface TimelineProps {
  steps: TimelineStep[];
}

export const Timeline: React.FC<TimelineProps> = ({ steps }) => {
  return (
    <div className="space-y-4 font-mono text-xs max-w-xl mx-auto py-2">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={index} className="flex space-x-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  step.status === "completed"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : step.status === "active"
                    ? "bg-orange-950 text-orange-400 border border-orange-800"
                    : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                }`}
              >
                {index + 1}
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-zinc-800 my-1" />}
            </div>

            <div className="flex-1 bg-zinc-900/80 border border-zinc-800 p-3 rounded-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100">{step.title}</span>
                {step.timestamp && <span className="text-[10px] text-zinc-500">{step.timestamp}</span>}
              </div>
              {step.subtitle && <p className="text-zinc-400 text-[11px]">{step.subtitle}</p>}
              {step.children}
            </div>
          </div>
        );
      })}
    </div>
  );
};
