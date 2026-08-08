"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "warning" | "error" | "info";

export interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = "info",
  onClose,
}) => {
  const configs = {
    success: { border: "border-emerald-800", icon: CheckCircle2, iconColor: "text-emerald-400" },
    warning: { border: "border-amber-800", icon: AlertTriangle, iconColor: "text-amber-400" },
    error: { border: "border-rose-800", icon: XCircle, iconColor: "text-rose-400" },
    info: { border: "border-zinc-700", icon: Info, iconColor: "text-sky-400" },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 max-w-sm w-full bg-zinc-950 border ${config.border} p-3 rounded-sm shadow-xl flex items-start space-x-3 font-mono text-xs animate-fadeIn`}
    >
      <Icon className={`w-4 h-4 ${config.iconColor} flex-shrink-0 mt-0.5`} aria-hidden="true" />
      <div className="flex-1 space-y-0.5">
        <h4 className="font-bold text-zinc-100">{title}</h4>
        {description && <p className="text-[11px] text-zinc-400">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss toast"
          className="text-zinc-500 hover:text-zinc-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-xs"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
