import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "indigo" | "violet" | "cyan" | "emerald" | "amber" | "rose";
  size?: "sm" | "md";
  className?: string;
}

const variantClasses = {
  default: "bg-white/8 text-slate-300 border-white/10 hover:bg-white/15 hover:text-white",
  indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30 hover:bg-violet-500/25",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-3 py-1 text-sm rounded-lg",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border transition-all duration-200 font-mono",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
