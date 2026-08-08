"use client";

import React from "react";

export interface ResponsiveGridProps {
  cols?: { sm?: number; md?: number; lg?: number };
  gap?: string;
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  cols = { sm: 1, md: 2, lg: 4 },
  gap = "gap-4",
  children,
  className = "",
}) => {
  const getGridCols = () => {
    return `grid-cols-${cols.sm || 1} md:grid-cols-${cols.md || 2} lg:grid-cols-${cols.lg || 4}`;
  };

  return <div className={`grid ${getGridCols()} ${gap} ${className}`}>{children}</div>;
};
