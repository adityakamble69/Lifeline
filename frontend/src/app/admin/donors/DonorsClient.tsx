"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Droplet,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  UserPlus,
  Download,
  MoreVertical,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import {
  getAdminDonors,
  formatDonationDate,
  formatRelativeTime,
  type AdminDonorItem,
  type AdminDonorsResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminDonorsResponse;
}

const BLOOD_GROUPS = [
  "Any",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

const STATUS_FILTERS = [
  { id: "all", label: "All Status" },
  { id: "approved", label: "Approved" },
  { id: "pending", label: "Pending" },
  { id: "rejected", label: "Rejected" },
] as const;

type ApprovalFilter = (typeof STATUS_FILTERS)[number]["id"];

const statusTone: Record<AdminDonorItem["approval_status"], BadgeTone> = {
  approved: "success",
  pending: "warning",
  rejected: "error",
};

export function DonorsClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("Any");
  const [city, setCity] = React.useState("");
  const [approvalStatus, setApprovalStatus] =
    React.useState<ApprovalFilter>("all");
  const [page, setPage] = React.useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = React.useCallback(
    async (opts?: { page?: number }) => {
      setLoading(true);
      setError(null);
      const res = await getAdminDonors(token, {
        search: debouncedSearch || undefined,
        bloodGroup,
        city: city.trim() || undefined,
        approvalStatus,
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
    [token, debouncedSearch, bloodGroup, city, approvalStatus, page],
  );

  // Reload when filters change
  React.useEffect(() => {
    setPage(1);
    void load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, bloodGroup, city, approvalStatus]);

  const resetFilters = () => {
    setSearch("");
    setBloodGroup("Any");
    setCity("");
    setApprovalStatus("all");
    setPage(1);
  };

  const counts = React.useMemo(() => {
    const c = { approved: 0, pending: 0, rejected: 0 };
    for (const d of data.donors) {
      c[d.approval_status] = (c[d.approval_status] ?? 0) + 1;
    }
    return c;
  }, [data.donors]);

  const { pagination } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Donor Management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Manage <span className="text-primary">Donors</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              View, add, and manage blood donors. Keep our donor network active
              and ready to save lives.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void load({ page })}
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                aria-hidden
              />
              Refresh
            </Button>
            <Button variant="primary" size="sm" className="gap-2">
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              Add Donor
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={pagination.total}
          label="Total Donors"
          accent="primary"
        />
        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          value={counts.approved}
          label="Approved (this page)"
          accent="green"
        />
        <KpiCard
          icon={<Clock className="h-5 w-5" aria-hidden />}
          value={counts.pending}
          label="Pending (this page)"
          accent="orange"
        />
        <KpiCard
          icon={<XCircle className="h-5 w-5" aria-hidden />}
          value={counts.rejected}
          label="Rejected (this page)"
          accent="blue"
        />
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <label className="flex flex-col gap-1.5 lg:col-span-2">
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
                placeholder="Search by name, email, phone..."
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>

          {/* Blood Group */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Blood Group
            </span>
            <div className="relative">
              <Droplet
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <select
                suppressHydrationWarning
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {BLOOD_GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </label>

          {/* City */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              City
            </span>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <input
                suppressHydrationWarning
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Nagpur"
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>
        </div>

        {/* Status pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Filter
            className="h-3.5 w-3.5 text-text-secondary"
            aria-hidden
          />
          {STATUS_FILTERS.map((s) => {
            const active = approvalStatus === s.id;
            return (
              <button
                key={s.id}
                suppressHydrationWarning
                type="button"
                onClick={() => setApprovalStatus(s.id)}
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
          title="Couldn't load donors"
          description={error}
          onRetry={() => void load({ page })}
        />
      )}

      {/* Empty */}
      {!error && data.donors.length === 0 && !loading && (
        <EmptyState
          icon={<Users className="h-6 w-6" aria-hidden />}
          title="No donors found"
          description="Try adjusting your filters or search query."
          action={{ label: "Reset Filters", onClick: resetFilters }}
        />
      )}

      {/* Table */}
      {!error && data.donors.length > 0 && (
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
                      Blood
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Last Donation
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
                  {data.donors.map((d, i) => {
                    const globalIndex =
                      (pagination.page - 1) * pagination.page_size + i + 1;
                    return (
                      <tr
                        key={d.id}
                        className="transition-colors hover:bg-background/60"
                      >
                        <td className="px-4 py-3 text-xs text-text-secondary">
                          {globalIndex}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                              {d.name
                                .split(" ")
                                .slice(0, 2)
                                .map((s) => s.charAt(0).toUpperCase())
                                .join("")}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-navy">
                                {d.name}
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                                {d.email && (
                                  <span className="inline-flex items-center gap-1">
                                    <Mail className="h-3 w-3" aria-hidden />
                                    <span className="truncate max-w-[160px]">
                                      {d.email}
                                    </span>
                                  </span>
                                )}
                                {d.phone && (
                                  <span className="inline-flex items-center gap-1">
                                    <Phone className="h-3 w-3" aria-hidden />
                                    {d.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {d.blood_group ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
                              {d.blood_group}
                            </span>
                          ) : (
                            <span className="text-xs text-text-secondary">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-navy">
                            {d.city ?? "—"}
                          </div>
                          <div className="text-[11px] text-text-secondary">
                            {d.state ?? ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-text-secondary">
                          {d.last_donation_date
                            ? formatDonationDate(d.last_donation_date)
                            : "Not yet"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={statusTone[d.approval_status]}>
                            {d.approval_status === "approved"
                              ? "Active"
                              : d.approval_status === "pending"
                                ? "Pending"
                                : "Rejected"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              suppressHydrationWarning
                              type="button"
                              className="rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-primary"
                              aria-label="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              suppressHydrationWarning
                              type="button"
                              className="rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-primary"
                              aria-label="More actions"
                            >
                              <MoreVertical className="h-4 w-4" />
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
              donors
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
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: pagination.total_pages })
                .slice(
                  Math.max(0, pagination.page - 3),
                  Math.max(0, pagination.page - 3) + 5,
                )
                .map((_, i, arr) => {
                  const startPage =
                    Math.max(0, pagination.page - 3) + 1;
                  const pageNum = startPage + i;
                  if (pageNum > pagination.total_pages) return null;
                  const active = pageNum === pagination.page;
                  return (
                    <button
                      key={pageNum}
                      suppressHydrationWarning
                      type="button"
                      onClick={() => {
                        setPage(pageNum);
                        void load({ page: pageNum });
                      }}
                      className={cn(
                        "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary text-white"
                          : "border border-border bg-surface text-navy hover:bg-background",
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}

              <button
                suppressHydrationWarning
                type="button"
                onClick={() => {
                  const next = Math.min(
                    pagination.total_pages,
                    page + 1,
                  );
                  setPage(next);
                  void load({ page: next });
                }}
                disabled={
                  pagination.page >= pagination.total_pages || loading
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-navy transition-colors hover:bg-background disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}