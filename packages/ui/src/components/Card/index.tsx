import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white/5 backdrop-blur-sm border-white/10 p-6",
        hover && "transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1",
        glow && "hover:shadow-lg hover:shadow-indigo-500/20",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}
