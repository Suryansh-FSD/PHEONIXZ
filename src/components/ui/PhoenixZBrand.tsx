"use client";

import React from "react";

interface PhoenixZBrandProps {
  compact?: boolean;
  className?: string;
  showSubtitle?: boolean;
}

export const PhoenixZBrand: React.FC<PhoenixZBrandProps> = ({
  compact = false,
  className = "",
  showSubtitle = true,
}) => {
  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-center space-x-2.5">
        {/* PhoenixZ Orange Flame Mark */}
        <div className={`${compact ? "w-6 h-6" : "w-7 h-7"} flex items-center justify-center text-orange-600 flex-shrink-0`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2C10.5 4.5 9 6.5 9 9c0 2.2 1.8 4 4 4s4-1.8 4-4c0-2.5-1.5-4.5-3-7zm-4.5 6C6.5 10 5 12 5 14.5c0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5C18 12 16.5 10 15 8c-.5.8-1.2 1.5-2 2-1.5-2-1.5-4.5-1.5-4.5S10 7 8.5 8z" />
          </svg>
        </div>

        {/* PHOENIXZ Wordmark & Version Badge */}
        <div className="flex items-center space-x-2">
          <span className={`font-extrabold tracking-tight text-gray-900 font-sans ${compact ? "text-base" : "text-lg"}`}>
            PHOENIXZ
          </span>
          <span className="bg-gray-100 border border-gray-200 text-gray-500 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-sm">
            V1.0
          </span>
        </div>
      </div>

      {/* Subtitle Tagline */}
      {showSubtitle && !compact && (
        <p className="text-[10px] font-sans font-bold text-gray-400 tracking-wider uppercase mt-1">
          AI SECURITY INTELLIGENCE
        </p>
      )}
    </div>
  );
};
