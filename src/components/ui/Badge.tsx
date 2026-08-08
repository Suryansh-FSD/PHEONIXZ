"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "subtle" | "accent";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-mono uppercase tracking-wider rounded-xs font-semibold";

  const variants = {
    default: "bg-zinc-800 text-zinc-200 border border-zinc-700",
    outline: "bg-transparent text-zinc-400 border border-zinc-800",
    subtle: "bg-zinc-900 text-zinc-300 border border-zinc-800/80",
    accent: "bg-orange-950/60 text-orange-400 border border-orange-800",
  };

  const sizes = {
    sm: "px-1.5 py-0.2 text-[10px]",
    md: "px-2 py-0.5 text-xs",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};
