"use client";

import React, { useState } from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const posClasses =
    position === "top"
      ? "bottom-full mb-1.5 left-1/2 -translate-x-1/2"
      : "top-full mt-1.5 left-1/2 -translate-x-1/2";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap bg-zinc-900 border border-zinc-700 text-zinc-100 text-[10px] font-mono px-2 py-1 rounded-xs shadow-md animate-fadeIn ${posClasses}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
