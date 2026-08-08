"use client";

import React from "react";

export interface NavbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  statusBadge?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  actions,
  statusBadge,
}) => {
  return (
    <header className="w-full bg-zinc-950 border-b border-zinc-800 py-3.5 px-4 sm:px-6 font-mono text-xs text-zinc-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold uppercase tracking-tight text-zinc-100">{title}</h1>
              {statusBadge}
            </div>
            {subtitle && <p className="text-[11px] text-zinc-400">{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </header>
  );
};
