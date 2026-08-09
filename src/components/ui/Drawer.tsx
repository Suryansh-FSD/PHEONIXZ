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
    position === "right" ? "right-0 border-l border-gray-200" : "left-0 border-r border-gray-200";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 animate-fadeIn font-mono">
      <div
        className={`fixed top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col ${positionClasses}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
      >
        <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && (
            <h3 id="drawer-title" className="text-xs font-mono font-bold text-gray-900 uppercase tracking-tight">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 text-gray-400 hover:text-gray-900 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 p-5 text-xs text-gray-700 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
