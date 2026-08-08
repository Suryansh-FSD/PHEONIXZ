"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionItemProps> = ({
  title,
  children,
  badge,
  defaultExpanded = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className={`w-full bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-4 py-3 bg-zinc-900/80 hover:bg-zinc-900 flex items-center justify-between text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 font-mono text-xs"
      >
        <div className="flex items-center space-x-3">
          <span className="font-bold text-zinc-200">{title}</span>
          {badge}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 text-xs text-zinc-300 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};
