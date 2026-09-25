import * as React from "react";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-border/70", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
      <Skeleton className="mb-2 h-6 w-20" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function SkeletonTableRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3.5">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-primary", className)} aria-hidden />;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-background text-text-secondary">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden />}
      </span>
      <p className="text-base font-semibold text-navy">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" className="mt-3" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this information. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-error-light text-error">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <p className="text-base font-semibold text-navy">{title}</p>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
