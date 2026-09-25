import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "success" | "warning" | "error" | "info" | "neutral" | "purple";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-green-light text-green",
  warning: "bg-orange-light text-orange",
  error: "bg-primary-light text-primary",
  info: "bg-blue-light text-blue",
  purple: "bg-purple-light text-purple",
  neutral: "bg-background text-text-secondary",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Maps common Lifeline status strings to a sensible badge tone (design.md §13). */
export function statusTone(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (["active", "verified", "approved", "fulfilled", "success"].includes(s)) return "success";
  if (["pending", "in review", "waiting"].includes(s)) return "warning";
  if (["urgent", "critical", "rejected", "expired"].includes(s)) return "error";
  if (["in progress", "information"].includes(s)) return "info";
  if (["volunteer", "volunteers"].includes(s)) return "purple";
  return "neutral";
}
