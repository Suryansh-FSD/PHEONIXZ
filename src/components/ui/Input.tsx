"use client";

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, id, className = "", ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1 font-mono">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-zinc-950 border text-zinc-100 placeholder-zinc-500 text-xs px-3 py-1.5 rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
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

Input.displayName = "Input";
