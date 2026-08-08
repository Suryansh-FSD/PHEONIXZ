"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sliders, ShieldCheck, Database, Key } from "lucide-react";

export interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="PHEONIXZ System Settings" position="right">
      <div className="space-y-6 font-mono text-xs">
        {/* Section 1: Persona */}
        <div className="space-y-3 bg-zinc-900/60 p-3.5 border border-zinc-800 rounded-sm">
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 text-zinc-200 font-bold">
            <Sliders className="w-4 h-4 text-orange-400" aria-hidden="true" />
            <span>Agent Persona Configuration</span>
          </div>
          <Input label="Agent Name" defaultValue="PheonixZ" readOnly />
          <Input label="Strategic Domain" defaultValue="AI Product Strategy & Market Intelligence" readOnly />
        </div>

        {/* Section 2: Editorial Rubric */}
        <div className="space-y-3 bg-zinc-900/60 p-3.5 border border-zinc-800 rounded-sm">
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 text-zinc-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Editorial Scoring Thresholds</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-zinc-950 border border-rose-950 p-2 rounded-xs">
              <span className="text-rose-400 font-bold block">&lt; 55</span>
              <span className="text-zinc-500">REJECT</span>
            </div>
            <div className="bg-zinc-950 border border-amber-950 p-2 rounded-xs">
              <span className="text-amber-400 font-bold block">55 – 71</span>
              <span className="text-zinc-500">WATCH</span>
            </div>
            <div className="bg-zinc-950 border border-emerald-950 p-2 rounded-xs">
              <span className="text-emerald-400 font-bold block">72 +</span>
              <span className="text-zinc-500">PUBLISH</span>
            </div>
          </div>
        </div>

        {/* Section 3: Runtime Infrastructure */}
        <div className="space-y-3 bg-zinc-900/60 p-3.5 border border-zinc-800 rounded-sm">
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 text-zinc-200 font-bold">
            <Database className="w-4 h-4 text-sky-400" aria-hidden="true" />
            <span>Infrastructure Integrations</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-2 rounded-xs">
              <span>Groq / Gemini LLM Gateway</span>
              <StatusBadge status="live" label="CONNECTED" showDot={false} />
            </div>
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-2 rounded-xs">
              <span>AgentRouter / Fallback Gateway</span>
              <StatusBadge status="watch" label="STANDBY" showDot={false} />
            </div>
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-2 rounded-xs">
              <span>Supabase Remote DB</span>
              <StatusBadge status="live" label="ONLINE" showDot={false} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Settings
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
