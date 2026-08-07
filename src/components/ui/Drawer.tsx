"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "right" | "left";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses =
    position === "right" ? "right-0 border-l border-zinc-800" : "left-0 border-r border-zinc-800";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 animate-fadeIn font-mono">
      <div
        className={`fixed top-0 bottom-0 w-full max-w-md bg-zinc-950 shadow-2xl flex flex-col ${positionClasses}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
      >
        <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          {title && (
            <h3 id="drawer-title" className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 text-zinc-400 hover:text-white rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 p-4 text-xs text-zinc-300 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
