import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex items-center justify-between gap-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-navy", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text-secondary", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

type KpiTrend = "up" | "down" | "neutral";

export interface KpiCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: { direction: KpiTrend; text: string };
  accent?: "primary" | "blue" | "green" | "orange" | "purple";
  className?: string;
}

const accentClasses: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  primary: "bg-primary-light text-primary",
  blue: "bg-blue-light text-blue",
  green: "bg-green-light text-green",
  orange: "bg-orange-light text-orange",
  purple: "bg-purple-light text-purple",
};

const trendClasses: Record<KpiTrend, string> = {
  up: "text-success",
  down: "text-error",
  neutral: "text-text-secondary",
};

export function KpiCard({ icon, value, label, trend, accent = "primary", className }: KpiCardProps) {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          accentClasses[accent],
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <p className="text-[28px] font-bold leading-tight text-navy">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
      {trend && (
        <p className={cn("text-xs font-medium", trendClasses[trend.direction])}>
          {trend.text}
        </p>
      )}
    </Card>
  );
}
