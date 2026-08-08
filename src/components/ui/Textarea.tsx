"use client";

import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id, className = "", rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1 font-mono">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full bg-zinc-950 border text-zinc-100 placeholder-zinc-500 text-xs p-3 rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
            error ? "border-rose-500" : "border-zinc-800 focus:border-zinc-600"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-rose-400">{error}</p>
        ) : (
          helperText && <p className="text-[11px] text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
