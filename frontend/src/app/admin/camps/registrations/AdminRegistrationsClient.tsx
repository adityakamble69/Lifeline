"use client";

import * as React from "react";
import Link from "next/link";
import {
  ClipboardList,
  Search,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import {
  getAdminRegistrations,
  changeRegistrationStatus,
  formatCampDateParts,
  formatCampTimeRange,
  formatRelativeTime,
  type AdminRegistrationItem,
  type AdminRegistrationsResponse,
  type AdminRegistrationsCounts,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminRegistrationsResponse;
}

type StatusTab = "all" | "registered" | "confirmed" | "pending" | "cancelled";

const STATUS_TABS: {
  id: StatusTab;
  label: string;
  countKey: keyof AdminRegistrationsCounts;
}[] = [
  { id: "all", label: "All", countKey: "total" },
  { id: "confirmed", label: "Confirmed", countKey: "confirmed" },
  { id: "registered", label: "Registered", countKey: "total" },
  { id: "pending", label: "Pending", countKey: "pending" },
  { id: "cancelled", label: "Cancelled", countKey: "cancelled" },
];

const statusTone: Record<string, BadgeTone> = {
  registered: "info",
  confirmed: "success",
  pending: "warning",
  cancelled: "error",
  waitlist: "neutral",
  attended: "success",
  no_show: "error",
};

const statusLabel: Record<string, string> = {
  registered: "Registered",
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  waitlist: "Waitlist",
  attended: "Attended",
  no_show: "No Show",
};

export function AdminRegistrationsClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusTab>("all");
  const [campFilter, setCampFilter] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Detail modal
  const [detailTarget, setDetailTarget] = React.useState<AdminRegistrationItem | null>(
    null,
  );

  const load = React.useCallback(
    async (opts?: { page?: number; status?: StatusTab }) => {
      setLoading(true);
      setError(null);
      const status = opts?.status ?? statusFilter;
      const res = await getAdminRegistrations(token, {
        status,
        campId: campFilter || undefined,
        search: debouncedSearch || undefined,
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
    [token, statusFilter, campFilter, debouncedSearch, page],
  );

  React.useEffect(() => {
    setPage(1);
    void load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, campFilter, debouncedSearch]);

  const handleStatusChange = async (
    reg: AdminRegistrationItem,
    status: string,
  ) => {
    setLoading(true);
    const res = await changeRegistrationStatus(token, reg.id, { status });
    setLoading(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setDetailTarget(null);
    void load({ page });
  };

  const handleAttendanceChange = async (
    reg: AdminRegistrationItem,
    attendanceStatus: string,
  ) => {
    setLoading(true);
    const res = await changeRegistrationStatus(token, reg.id, {
      attendance_status: attendanceStatus,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setDetailTarget(null);
    void load({ page });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCampFilter("");
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
              Camp Registrations
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Camp <span className="text-primary">Registrations</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              View and manage donor registrations for your blood donation
              camps.
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
            <Button variant="primary" size="sm" className="gap-2" disabled>
              <Download className="h-3.5 w-3.5" aria-hidden />
              Export CSV
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<ClipboardList className="h-5 w-5" aria-hidden />}
          value={counts.total}
          label="Total Registrations"
          accent="primary"
        />
        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          value={counts.confirmed}
          label="Confirmed"
          accent="green"
        />
        <KpiCard
          icon={<Clock className="h-5 w-5" aria-hidden />}
          value={counts.pending}
          label="Pending"
          accent="orange"
        />
        <KpiCard
          icon={<XCircle className="h-5 w-5" aria-hidden />}
          value={counts.cancelled}
          label="Cancelled"
          accent="blue"
        />
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Search */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Search Donors
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
                placeholder="Search by name, email, or phone..."
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>

          {/* Camp filter */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Filter by Camp
            </span>
            <select
              suppressHydrationWarning
              value={campFilter}
              onChange={(e) => setCampFilter(e.target.value)}
              className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface px-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Camps</option>
              {data.camp_options.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.title} — {camp.city}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Status tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {STATUS_TABS.map((t) => {
            const active = statusFilter === t.id;
            const count = counts[t.countKey] ?? 0;
            return (
              <button
                key={t.id}
                suppressHydrationWarning
                type="button"
                onClick={() => setStatusFilter(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-navy hover:border-primary hover:text-primary",
                )}
              >
                {t.label}
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
          title="Couldn't load registrations"
          description={error}
          onRetry={() => void load({ page })}
        />
      )}

      {/* Empty */}
      {!error && data.registrations.length === 0 && !loading && (
        <EmptyState
          icon={<ClipboardList className="h-6 w-6" aria-hidden />}
          title="No registrations found"
          description="Try adjusting filters or check back later."
          action={{ label: "Reset Filters", onClick: resetFilters }}
        />
      )}

      {/* Table */}
      {!error && data.registrations.length > 0 && (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead className="bg-background">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Donor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Camp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Registered
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.registrations.map((reg, i) => {
                    const globalIndex =
                      (pagination.page - 1) * pagination.page_size + i + 1;
                    const { dateLabel } = reg.camp
                      ? formatCampDateParts(reg.camp.start_at)
                      : { dateLabel: "" };
                    return (
                      <tr
                        key={reg.id}
                        className="transition-colors hover:bg-background/60"
                      >
                        <td className="px-4 py-3 text-xs text-text-secondary">
                          {globalIndex}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                              {(reg.user?.name ?? "?")
                                .split(" ")
                                .slice(0, 2)
                                .map((s) => s.charAt(0).toUpperCase())
                                .join("")}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-navy">
                                {reg.user?.name ?? "Unknown"}
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                                {reg.user?.email && (
                                  <span className="inline-flex items-center gap-1">
                                    <Mail className="h-3 w-3" aria-hidden />
                                    <span className="truncate max-w-[160px]">
                                      {reg.user.email}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-[240px]">
                            <p className="truncate text-sm font-medium text-navy">
                              {reg.camp?.title ?? "—"}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-text-secondary">
                              {reg.camp?.city ?? ""} · {dateLabel}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-text-secondary">
                          {formatRelativeTime(reg.registered_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <Badge tone={statusTone[reg.status] ?? "neutral"}>
                              {statusLabel[reg.status] ?? reg.status}
                            </Badge>
                            {reg.attendance_status === "attended" && (
                              <Badge tone="success">Attended</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              suppressHydrationWarning
                              type="button"
                              onClick={() => setDetailTarget(reg)}
                              className="rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-primary"
                              aria-label="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
              registrations
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

      {/* Detail modal */}
      <Modal
        open={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title="Registration Details"
        description={
          detailTarget?.user
            ? `${detailTarget.user.name} — ${detailTarget.camp?.title ?? ""}`
            : undefined
        }
        className="!max-w-2xl"
      >
        {detailTarget && (
          <RegistrationDetail
            registration={detailTarget}
            onStatusChange={(status) =>
              handleStatusChange(detailTarget, status)
            }
            onAttendanceChange={(a) =>
              handleAttendanceChange(detailTarget, a)
            }
          />
        )}
      </Modal>
    </div>
  );
}

// ─── Detail view ────────────────────────────────────────────────────────────
function RegistrationDetail({
  registration,
  onStatusChange,
  onAttendanceChange,
}: {
  registration: AdminRegistrationItem;
  onStatusChange: (status: string) => void;
  onAttendanceChange: (status: string) => void;
}) {
  const { dateLabel } = registration.camp
    ? formatCampDateParts(registration.camp.start_at)
    : { dateLabel: "" };
  const time = registration.camp
    ? formatCampTimeRange(
        registration.camp.start_at,
        registration.camp.end_at,
      )
    : "";

  return (
    <div className="space-y-4">
      {/* Donor info */}
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Donor
        </p>
        <div className="space-y-1.5 text-sm">
          <p className="inline-flex items-center gap-2 font-semibold text-navy">
            <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
            {registration.user?.name ?? "Unknown"}
          </p>
          {registration.user?.email && (
            <p className="inline-flex items-center gap-2 text-text-secondary">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              {registration.user.email}
            </p>
          )}
          {registration.user?.phone && (
            <p className="inline-flex items-center gap-2 text-text-secondary">
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {registration.user.phone}
            </p>
          )}
        </div>
      </div>

      {/* Camp info */}
      {registration.camp && (
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Camp
          </p>
          <div className="space-y-1.5 text-sm">
            <p className="inline-flex items-center gap-2 font-semibold text-navy">
              <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden />
              {registration.camp.title}
            </p>
            <p className="inline-flex items-center gap-2 text-text-secondary">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {registration.camp.venue}, {registration.camp.city}
            </p>
            <p className="inline-flex items-center gap-2 text-text-secondary">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {dateLabel} · {time}
            </p>
          </div>
        </div>
      )}

      {/* Status actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Registration Status
          </p>
          <div className="flex flex-wrap gap-2">
            {["confirmed", "pending", "cancelled"].map((s) => (
              <button
                key={s}
                suppressHydrationWarning
                type="button"
                onClick={() => onStatusChange(s)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  registration.status === s
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-navy hover:border-primary hover:text-primary",
                )}
              >
                {statusLabel[s] ?? s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Attendance
          </p>
          <div className="flex flex-wrap gap-2">
            {["attended", "no_show", "pending"].map((a) => (
              <button
                key={a}
                suppressHydrationWarning
                type="button"
                onClick={() => onAttendanceChange(a)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  registration.attendance_status === a
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-navy hover:border-primary hover:text-primary",
                )}
              >
                {statusLabel[a] ?? a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              Registered At
            </p>
            <p className="mt-0.5 text-xs font-medium text-navy">
              {new Date(registration.registered_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          {registration.attended_at && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                Attended At
              </p>
              <p className="mt-0.5 text-xs font-medium text-navy">
                {new Date(registration.attended_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}