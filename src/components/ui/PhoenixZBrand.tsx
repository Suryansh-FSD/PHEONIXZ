"use client";

import React from "react";
import Image from "next/image";

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
      <div className="flex items-center space-x-3">
        {/* Official PhoenixZ Logo Image */}
        <div className={`${compact ? "w-8 h-8" : "w-10 h-10"} relative flex-shrink-0 flex items-center justify-center`}>
          <Image
            src="/phoenixz-logo.png"
            alt="PhoenixZ Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
            priority
          />
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
