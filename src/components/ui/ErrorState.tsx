"use client";

import React from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "System Evaluation Error",
  message,
  onRetry,
}) => {
  return (
    <div className="w-full bg-rose-950/40 border border-rose-900/80 p-6 rounded-sm text-center font-mono space-y-3">
      <div className="w-9 h-9 bg-rose-950 border border-rose-800 rounded-full flex items-center justify-center mx-auto text-rose-400">
        <AlertOctagon className="w-4 h-4" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">{title}</h4>
        <p className="text-xs text-rose-400">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-1">
          <Button variant="danger" size="sm" onClick={onRetry}>
            Retry Evaluation
          </Button>
        </div>
      )}
    </div>
  );
};
