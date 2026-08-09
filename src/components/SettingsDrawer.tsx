"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Sliders, ShieldCheck, Database } from "lucide-react";

export interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="PHOENIXZ SYSTEM SETTINGS" position="right">
      <div className="space-y-5 font-mono text-xs">
        {/* Section 1: Persona */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-2.5 text-gray-900 font-bold">
            <Sliders className="w-4 h-4 text-orange-600" aria-hidden="true" />
            <span>Agent Persona Configuration</span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Agent Name</label>
            <input
              type="text"
              defaultValue="PhoenixZ"
              readOnly
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-mono text-xs px-3 py-2 rounded-md focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Strategic Domain</label>
            <input
              type="text"
              defaultValue="AI Product Strategy & Market Intelligence"
              readOnly
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-mono text-xs px-3 py-2 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Editorial Rubric Thresholds */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-2.5 text-gray-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Editorial Scoring Thresholds</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-rose-50/60 border border-rose-200 p-2.5 rounded-md">
              <span className="text-rose-700 font-extrabold block">&lt; 55</span>
              <span className="text-rose-600 text-[10px] font-bold">REJECT</span>
            </div>
            <div className="bg-amber-50/60 border border-amber-200 p-2.5 rounded-md">
              <span className="text-amber-700 font-extrabold block">55 – 71</span>
              <span className="text-amber-600 text-[10px] font-bold">WATCH</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-md">
              <span className="text-emerald-700 font-extrabold block">72 +</span>
              <span className="text-emerald-600 text-[10px] font-bold">PUBLISH</span>
            </div>
          </div>
        </div>

        {/* Section 3: Runtime Infrastructure */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-2.5 text-gray-900 font-bold">
            <Database className="w-4 h-4 text-sky-600" aria-hidden="true" />
            <span>Infrastructure & Memory Layer</span>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2.5 rounded-md">
              <span className="text-gray-800 font-medium">Groq / Gemini LLM Gateway</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded">CONNECTED</span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2.5 rounded-md">
              <span className="text-gray-800 font-medium">Breeth AI Semantic Memory</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2.5 rounded-md">
              <span className="text-gray-800 font-medium">Supabase Operational DB</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="border border-gray-300 bg-white text-gray-700 font-sans font-semibold text-xs px-4 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
          >
            Close Settings
          </button>
        </div>
      </div>
    </Drawer>
  );
};
