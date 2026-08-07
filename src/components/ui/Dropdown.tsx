"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  label,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className={`relative font-mono text-xs ${className}`}>
      {label && <label className="block text-phoenix-tertiary mb-1 font-semibold">{label}</label>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={label || placeholder}
        className="w-full bg-phoenix-card border border-phoenix-border text-phoenix-text px-3 py-1.5 rounded-xs flex items-center justify-between hover:border-phoenix-border-strong transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="w-3.5 h-3.5 text-phoenix-tertiary ml-2" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-phoenix-card border border-phoenix-border rounded-xs shadow-lg py-1 animate-fadeIn max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 hover:bg-phoenix-elevated transition-colors cursor-pointer ${
                option.value === selectedValue ? "font-bold text-phoenix-accent bg-phoenix-bg/50" : "text-phoenix-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
