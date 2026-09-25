"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Send,
  Ban,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { CampFormModal } from "@/components/camps/CampFormModal";
import {
  getAdminCamps,
  changeCampStatus,
  formatCampDateParts,
  formatCampTimeRange,
  type AdminCampItem,
  type AdminCampsResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminCampsResponse;
}

type StatusFilter =
  | "all"
  | "draft"
  | "published"
  | "upcoming"
  | "registration_open"
  | "completed"
  | "cancelled";

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Camps" },
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
  { id: "upcoming", label: "Upcoming" },
  { id: "registration_open", label: "Open" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const statusTone: Record<string, BadgeTone> = {
  draft: "neutral",
  published: "info",
  upcoming: "success",
  registration_open: "info",
  completed: "neutral",
  cancelled: "error",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  upcoming: "Upcoming",
  registration_open: "Open",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function AdminCampsClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [page, setPage] = React.useState(1);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingCamp, setEditingCamp] = React.useState<AdminCampItem | null>(
    null,
  );

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = React.useCallback(
    async (opts?: { page?: number; status?: StatusFilter }) => {
      setLoading(true);
      setError(null);
      const res = await getAdminCamps(token, {
        search: debouncedSearch || undefined,
        status: opts?.status ?? statusFilter,
        page: opts?.page ?? page,
        pageSize: 20,
      });
      if (!res.success) {
        setError(res.error.message);
      } else {
        setData(res.data);
      }
      setLoading(false);
    },
    [token, debouncedSearch, statusFilter, page],
  );

  React.useEffect(() => {
    setPage(1);
    void load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter]);

  const openCreate = () => {
    setEditingCamp(null);
    setFormOpen(true);
  };

  const openEdit = (camp: AdminCampItem) => {
    setEditingCamp(camp);
    setFormOpen(true);
  };

  const handleStatusChange = async (
    camp: AdminCampItem,
    status: string,
  ) => {
    setLoading(true);
    const res = await changeCampStatus(token, camp.id, status);
    setLoading(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    void load({ page });
  };

  const counts = React.useMemo(() => {
    const c = {
      total: data.pagination.total,
      draft: 0,
      upcoming: 0,
      open: 0,
      completed: 0,
    };
    for (const camp of data.camps) {
      if (camp.status === "draft") c.draft += 1;
      else if (camp.status === "registration_open") c.open += 1;
      else if (camp.status === "completed") c.completed += 1;
      else if (
        camp.status === "upcoming" ||
        camp.status === "published"
      )
        c.upcoming += 1;
    }
    return c;
  }, [data.camps, data.pagination.total]);

  const { pagination } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Camp Management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Manage <span className="text-primary">Blood Donation Camps</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Create, manage, and monitor blood donation camps. Bring
              communities together and save lives.
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
            <Button
              variant="primary"
              size="sm"
              onClick={openCreate}
              className="gap-2"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Create New Camp
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          value={counts.total}
          label="Total Camps"
          accent="primary"
        />
        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          value={counts.upcoming}
          label="Upcoming"
          accent="green"
        />
        <KpiCard
          icon={<Clock className="h-5 w-5" aria-hidden />}
          value={counts.open}
          label="Registration Open"
          accent="blue"
        />
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={counts.completed}
          label="Completed"
          accent="orange"
        />
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Search Camps
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
                placeholder="Search by camp title..."
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s.id;
            return (
              <button
                key={s.id}
                suppressHydrationWarning
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-navy hover:border-primary hover:text-primary",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <ErrorState
          title="Couldn't load camps"
          description={error}
          onRetry={() => void load({ page })}
        />
      )}

      {/* Empty */}
      {!error && data.camps.length === 0 && !loading && (
        <EmptyState
          icon={<Calendar className="h-6 w-6" aria-hidden />}
          title="No camps found"
          description="Create your first camp to get started."
          action={{ label: "Create Camp", onClick: openCreate }}
        />
      )}

      {/* Camps list */}
      {!error && data.camps.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {data.camps.map((camp) => (
              <CampRow
                key={camp.id}
                camp={camp}
                onEdit={() => openEdit(camp)}
                onStatusChange={(s) => handleStatusChange(camp, s)}
              />
            ))}
          </div>

          {/* Pagination */}
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
              camps
            </p>

            <div className="flex items-center gap-2">
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
                Page {pagination.page} of {pagination.total_pages}
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

      {/* Create/Edit modal */}
      <CampFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCamp(null);
        }}
        onSaved={() => void load({ page })}
        token={token}
        camp={editingCamp}
      />
    </div>
  );
}

// ─── Camp row ───────────────────────────────────────────────────────────────
function CampRow({
  camp,
  onEdit,
  onStatusChange,
}: {
  camp: AdminCampItem;
  onEdit: () => void;
  onStatusChange: (status: string) => void;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { day, month, dateLabel } = formatCampDateParts(camp.start_at);
  const time = formatCampTimeRange(camp.start_at, camp.end_at);

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {/* Date badge */}
        <span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
          <span className="text-2xl font-bold leading-none">{day}</span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide">
            {month}
          </span>
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-navy">
                {camp.title}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                <Building2 className="h-3.5 w-3.5 text-primary" aria-hidden />
                {camp.organization_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={statusTone[camp.status] ?? "neutral"}>
                {statusLabel[camp.status] ?? camp.status}
              </Badge>
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-text-secondary sm:grid-cols-2">
            <p className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">
                {camp.venue}, {camp.city}
              </span>
            </p>
            <p className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {dateLabel} · {time}
            </p>
            <p className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {camp.registered} / {camp.capacity} registered
            </p>
          </div>

          {/* Capacity bar */}
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  camp.capacity_percent >= 90
                    ? "bg-error"
                    : camp.capacity_percent >= 70
                      ? "bg-orange"
                      : "bg-primary",
                )}
                style={{ width: `${camp.capacity_percent}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden />
              Edit
            </Button>

            {camp.status === "draft" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusChange("published")}
                className="gap-1.5"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
                Publish
              </Button>
            )}

            {(camp.status === "upcoming" || camp.status === "published") && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusChange("registration_open")}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Open Registration
              </Button>
            )}

            {camp.status !== "cancelled" && camp.status !== "completed" && (
              <div className="relative ml-auto">
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="rounded-lg p-2 text-text-secondary hover:bg-background hover:text-primary"
                  aria-label="More actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onStatusChange("completed");
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-navy hover:bg-background"
                    >
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-green"
                        aria-hidden
                      />
                      Mark as Completed
                    </button>
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onStatusChange("cancelled");
                      }}
                      className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-xs font-medium text-primary hover:bg-primary-light/40"
                    >
                      <Ban className="h-3.5 w-3.5" aria-hidden />
                      Cancel Camp
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}