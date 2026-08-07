"use client";

import React from "react";

export interface LoadingSkeletonProps {
  lines?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  lines = 3,
  height = "h-4",
  className = "",
}) => {
  return (
    <div className="w-full space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-zinc-800/60 rounded-xs border border-zinc-800 ${height} ${
            idx === lines - 1 && lines > 1 ? "w-2/3" : "w-full"
          } ${className}`}
        />
      ))}
    </div>
  );
};
