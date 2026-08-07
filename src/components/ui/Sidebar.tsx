"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
  brandTitle?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeId,
  onSelect,
  brandTitle = "PHOENIXZ",
}) => {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full font-mono text-xs p-4 space-y-6">
      <div className="flex items-center space-x-2 px-2">
        <div className="w-7 h-7 bg-zinc-900 border border-zinc-700 font-bold flex items-center justify-center text-zinc-100 rounded-xs">
          PZ
        </div>
        <span className="font-bold text-sm text-zinc-100 uppercase tracking-wider">
          {brandTitle}
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-label={`Navigate to ${item.label}`}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xs border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                isActive
                  ? "bg-zinc-900 border-zinc-700 text-zinc-100 font-bold"
                  : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-orange-400" : "text-zinc-500"}`} aria-hidden="true" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
