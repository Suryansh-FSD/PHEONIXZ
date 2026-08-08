"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <div
    className={`bg-zinc-900/90 border border-zinc-800 rounded-sm overflow-hidden shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <div className={`bg-zinc-950/80 px-4 py-3 border-b border-zinc-800 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <h3 className={`text-sm font-bold font-mono text-zinc-100 uppercase tracking-wide ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <div className={`bg-zinc-950/60 px-4 py-2.5 border-t border-zinc-800 ${className}`} {...props}>
    {children}
  </div>
);
