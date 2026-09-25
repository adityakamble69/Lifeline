"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  RefreshCw,
  CheckCheck,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Siren,
  Calendar,
  Users,
  Info,
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification,
  clearAllReadNotifications,
  formatRelativeTime,
  type AdminNotificationItem,
  type AdminNotificationsResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminNotificationsResponse;
}

const TYPE_META: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    tone: BadgeTone;
  }
> = {
  donor_approval: {
    label: "Donor",
    icon: ShieldCheck,
    accent: "bg-orange-light text-orange",
    tone: "warning",
  },
  request_verification: {
    label: "Request",
    icon: Siren,
    accent: "bg-primary-light text-primary",
    tone: "error",
  },
  camp_published: {
    label: "Camp",
    icon: Calendar,
    accent: "bg-blue-light text-blue",
    tone: "info",
  },
  team_activity: {
    label: "Team",
    icon: Users,
    accent: "bg-purple-light text-purple",
    tone: "purple",
  },
  alert: {
    label: "Alert",
    icon: AlertCircle,
    accent: "bg-orange-light text-orange",
    tone: "warning",
  },
  system: {
    label: "System",
    icon: Settings,
    accent: "bg-background text-text-secondary",
    tone: "neutral",
  },
};

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
] as const;

const TYPE_FILTERS = [
  { id: "all", label: "All Types" },
  { id: "donor_approval", label: "Donor Approval" },
  { id: "request_verification", label: "Requests" },
  { id: "camp_published", label: "Camps" },
  { id: "team_activity", label: "Team" },
  { id: "alert", label: "Alerts" },
  { id: "system", label: "System" },
];

function getMeta(type: string) {
  return TYPE_META[type] ?? TYPE_META.system;
}

export function AdminNotificationsClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [statusFilter, setStatusFilter] = React.useState<
    (typeof STATUS_TABS)[number]["id"]
  >("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const [deleteTarget, setDeleteTarget] =
    React.useState<AdminNotificationItem | null>(null);
  const [clearReadOpen, setClearReadOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(
    async (opts?: { page?: number }) => {
      setLoading(true);
      setError(null);
      const res = await getAdminNotifications(token, {
        type: typeFilter,
        status: statusFilter,
        search: debouncedSearch || undefined,
        page: opts?.page ?? page,
        pageSize: 30,
      });
      if (!res.success) {
        setError(res.error.message);
      } else {
        setData(res.data);
      }
      setLoading(false);
    },
    [token, typeFilter, statusFilter, debouncedSearch, page],
  );

  React.useEffect(() => {
    setPage(1);
    void load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter, debouncedSearch]);

  const handleMarkOne = async (n: AdminNotificationItem) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((x) =>
        x.id === n.id ? { ...x, is_read: true } : x,
      ),
      counts: {
        ...prev.counts,
        unread: Math.max(0, prev.counts.unread - 1),
      },
    }));
    const res = await markAdminNotificationRead(token, n.id);
    if (!res.success) void load({ page });
  };

  const handleMarkAll = async () => {
    setSaving(true);
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((x) => ({
        ...x,
        is_read: true,
      })),
      counts: { ...prev.counts, unread: 0 },
    }));
    const res = await markAllAdminNotificationsRead(token);
    setSaving(false);
    if (!res.success) void load({ page });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const res = await deleteAdminNotification(token, deleteTarget.id);
    setSaving(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setDeleteTarget(null);
    void load({ page });
  };

  const handleClearRead = async () => {
    setSaving(true);
    const res = await clearAllReadNotifications(token);
    setSaving(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setClearReadOpen(false);
    void load({ page });
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearch("");
    setPage(1);
  };

  const counts = data.counts;
  const { pagination } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Notifications
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Stay Updated.{" "}
              <span className="text-primary">Stay Ahead.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Get real-time updates about donor approvals, camp publications,
              requests, and team activity.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void load({ page })}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                aria-hidden
              />
              Refresh
            </Button>
            {counts.unread > 0 && (
              <Button
                variant="primary"
                size="sm"
                loading={saving}
                onClick={handleMarkAll}
                className="gap-2"
              >
                <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Bell className="h-5 w-5" aria-hidden />}
          value={counts.total}
          label="Total Notifications"
          accent="primary"
        />
        <KpiCard
          icon={<AlertCircle className="h-5 w-5" aria-hidden />}
          value={counts.unread}
          label="Unread"
          accent="orange"
        />
        <KpiCard
          icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
          value={counts.by_type["donor_approval"] ?? 0}
          label="Donor Approvals"
          accent="green"
        />
        <KpiCard
          icon={<Siren className="h-5 w-5" aria-hidden />}
          value={counts.by_type["request_verification"] ?? 0}
          label="Request Verifications"
          accent="blue"
        />
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Search
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                aria-hidden
              />
              <input
                suppressHydrationWarning
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Type
            </span>
            <div className="relative">
              <Filter
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <select
                suppressHydrationWarning
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {TYPE_FILTERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {STATUS_TABS.map((s) => {
            const active = statusFilter === s.id;
            const count =
              s.id === "all"
                ? counts.total
                : s.id === "unread"
                  ? counts.unread
                  : counts.total - counts.unread;
            return (
              <button
                key={s.id}
                suppressHydrationWarning
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-navy hover:border-primary hover:text-primary",
                )}
              >
                {s.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active
                      ? "bg-white/25 text-white"
                      : "bg-background text-text-secondary",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <button
            suppressHydrationWarning
            type="button"
            onClick={resetFilters}
            className="ml-auto text-xs font-semibold text-text-secondary hover:text-primary"
          >
            Reset filters
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <ErrorState
          title="Couldn't load notifications"
          description={error}
          onRetry={() => void load({ page })}
        />
      )}

      {/* Empty */}
      {!error && data.notifications.length === 0 && !loading && (
        <EmptyState
          icon={<Bell className="h-6 w-6" aria-hidden />}
          title="No notifications"
          description="You're all caught up!"
          action={{ label: "Reset Filters", onClick: resetFilters }}
        />
      )}

      {/* List */}
      {!error && data.notifications.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {data.notifications.map((n) => {
              const meta = getMeta(n.type);
              const Icon = meta.icon;
              return (
                <article
                  key={n.id}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border bg-surface p-4 shadow-[var(--shadow-card)] transition-colors sm:p-5",
                    !n.is_read
                      ? "border-primary-light bg-primary-light/20"
                      : "border-border",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      meta.accent,
                    )}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-navy">
                        {n.title}
                      </h3>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      {!n.is_read && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">
                      {n.message}
                    </p>
                    <p className="mt-2 text-[11px] text-text-secondary">
                      {formatRelativeTime(n.created_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {!n.is_read && (
                      <button
                        suppressHydrationWarning
                        type="button"
                        onClick={() => handleMarkOne(n)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        Mark read
                      </button>
                    )}
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => setDeleteTarget(n)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary opacity-0 transition-opacity hover:bg-background hover:text-primary group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination + clear read */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-text-secondary">
              Showing{" "}
              <span className="font-semibold text-navy">
                {(pagination.page - 1) * pagination.page_size + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-navy">
                {Math.min(
                  pagination.page * pagination.page_size,
                  pagination.total,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-navy">
                {pagination.total}
              </span>{" "}
              notifications
            </p>

            <div className="flex items-center gap-2">
              {counts.total - counts.unread > 0 && (
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setClearReadOpen(true)}
                  className="mr-2 text-xs font-semibold text-text-secondary hover:text-primary"
                >
                  Clear read
                </button>
              )}
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  setPage(next);
                  void load({ page: next });
                }}
                disabled={pagination.page <= 1 || loading}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-navy transition-colors hover:bg-background disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-navy">
                {pagination.page} / {pagination.total_pages}
              </span>
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => {
                  const next = Math.min(pagination.total_pages, page + 1);
                  setPage(next);
                  void load({ page: next });
                }}
                disabled={pagination.page >= pagination.total_pages || loading}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-navy transition-colors hover:bg-background disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Notification"
        description={
          deleteTarget ? `Delete "${deleteTarget.title}"?` : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setDeleteTarget(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              loading={saving}
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          This notification will be permanently removed.
        </p>
      </Modal>

      {/* Clear read modal */}
      <Modal
        open={clearReadOpen}
        onClose={() => setClearReadOpen(false)}
        title="Clear Read Notifications"
        description={`Delete all ${counts.total - counts.unread} read notifications?`}
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setClearReadOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              loading={saving}
              onClick={handleClearRead}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Clear All Read
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Read notifications will be permanently deleted. Unread ones will
          remain.
        </p>
      </Modal>
    </div>
  );
}