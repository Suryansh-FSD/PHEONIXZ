"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search moves or companies…",
  onClear,
  className = "",
}) => {
  return (
    <div className={`relative min-w-[200px] font-mono text-xs ${className}`}>
      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-phoenix-tertiary" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-phoenix-card border border-phoenix-border text-phoenix-text placeholder-phoenix-tertiary px-8 py-1.5 rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus:border-phoenix-border-strong transition-colors"
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            if (onClear) onClear();
          }}
          aria-label="Clear search input"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-phoenix-tertiary hover:text-phoenix-text cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-xs"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
