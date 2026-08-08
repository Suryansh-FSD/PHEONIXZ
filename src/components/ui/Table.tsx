"use client";

import React from "react";

export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className="w-full overflow-x-auto border border-zinc-800 rounded-sm">
    <table className={`w-full text-left text-xs font-mono border-collapse ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-zinc-800/80 bg-zinc-950 text-zinc-300">{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = ({
  children,
  onClick,
  className = "",
}) => (
  <tr
    onClick={onClick}
    className={`hover:bg-zinc-900/60 transition-colors ${
      onClick ? "cursor-pointer" : ""
    } ${className}`}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <th className={`px-4 py-3 font-bold ${className}`}>{children}</th>;

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <td className={`px-4 py-3 ${className}`}>{children}</td>;
