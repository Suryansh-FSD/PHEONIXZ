"use client";

import React from "react";
import { FolderOpen, LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
}) => {
  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 p-8 sm:p-12 rounded-sm text-center font-mono space-y-3">
      <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">{title}</h4>
        {description && <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
