"use client";

import * as React from "react";
import {
  Siren,
  Search,
  Droplet,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  ChevronLeft,
  ChevronRight,
  User,
  Hospital,
  FileText,
  Eye,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import { FormField, Textarea } from "@/components/ui/Input";
import {
  getAdminRequests,
  verifyAdminRequest,
  rejectAdminRequest,
  fulfillAdminRequest,
  setRequestInProgress,
  formatRelativeTime,
  type AdminRequestItem,
  type AdminRequestsResponse,
  type AdminRequestsCounts,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminRequestsResponse;
}

type TabId = "all" | "pending" | "verified" | "in_progress" | "fulfilled" | "rejected";

const TABS: { id: TabId; label: string; countKey: keyof AdminRequestsCounts }[] = [
  { id: "pending", label: "Pending", countKey: "pending" },
  { id: "verified", label: "Verified", countKey: "verified" },
  { id: "in_progress", label: "In Progress", countKey: "in_progress" },
  { id: "fulfilled", label: "Fulfilled", countKey: "fulfilled" },
  { id: "rejected", label: "Rejected", countKey: "rejected" },
  { id: "all", label: "All", countKey: "total" },
];

const BLOOD_GROUPS = ["Any", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const URGENCIES = [
  { id: "all", label: "All Urgency" },
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "moderate", label: "Moderate" },
];

const statusTone: Record<string, BadgeTone> = {
  pending: "warning",
  verified: "info",
  in_progress: "info",
  fulfilled: "success",
  rejected: "error",
  expired: "neutral",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  verified: "Verified",
  in_progress: "In Progress",
  fulfilled: "Fulfilled",
  rejected: "Rejected",
  expired: "Expired",
};

const urgencyTone: Record<string, BadgeTone> = {
  critical: "error",
  high: "warning",
  moderate: "info",
  normal: "neutral",
};

export function AdminRequestsClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [tab, setTab] = React.useState<TabId>("pending");
  const [search, setSearch] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("Any");
  const [urgency, setUrgency] = React.useState("all");
  const [city, setCity] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Detail modal
  const [detailTarget, setDetailTarget] = React.useState<AdminRequestItem | null>(
    null,
  );
  // Reject modal
  const [rejectTarget, setRejectTarget] = React.useState<AdminRequestItem | null>(
    null,
  );
  const [rejectReason, setRejectReason] = React.useState("");
  const [rejecting, setRejecting] = React.useState(false);
  const [rejectError, setRejectError] = React.useState<string | null>(null);

  const load = React.useCallback(
    async (opts?: { page?: number; status?: TabId }) => {
      setLoading(true);
      setError(null);
      const status = opts?.status ?? tab;
      const res = await getAdminRequests(token, {
        status,
        urgency,
        bloodGroup,
        city: city.trim() || undefined,
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
    [token, tab, urgency, bloodGroup, city, debouncedSearch, page],
  );

  React.useEffect(() => {
    setPage(1);
    void load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, urgency, bloodGroup, debouncedSearch]);

  const handleVerify = async (req: AdminRequestItem) => {
    setLoading(true);
    const res = await verifyAdminRequest(token, req.id);
    setLoading(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setDetailTarget(null);
    void load({ page });
  };

  const handleInProgress = async (req: AdminRequestItem) => {
    setLoading(true);
    const res = await setRequestInProgress(token, req.id);
    setLoading(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setDetailTarget(null);
    void load({ page });
  };

  const handleFulfill = async (req: AdminRequestItem) => {
    setLoading(true);
    const res = await fulfillAdminRequest(token, req.id);
    setLoading(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setDetailTarget(null);
    void load({ page });
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      setRejectError("Reason is required.");
      return;
    }
    setRejecting(true);
    setRejectError(null);
    const res = await rejectAdminRequest(token, rejectTarget.id, rejectReason);
    setRejecting(false);
    if (!res.success) {
      setRejectError(res.error.message);
      return;
    }
    setRejectTarget(null);
    setRejectReason("");
    setDetailTarget(null);
    void load({ page });
  };

  const resetFilters = () => {
    setSearch("");
    setBloodGroup("Any");
    setUrgency("all");
    setCity("");
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
              Request Management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Emergency{" "}
              <span className="text-primary">Blood Requests</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Verify and coordinate emergency blood requests. Every minute
              matters — be the reason someone gets a second chance.
            </p>
          </div>
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
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<FileText className="h-5 w-5" aria-hidden />}
          value={counts.total}
          label="Total Requests"
          accent="primary"
        />
        <KpiCard
          icon={<Clock className="h-5 w-5" aria-hidden />}
          value={counts.pending}
          label="Pending Verification"
          accent="orange"
        />
        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          value={counts.fulfilled}
          label="Fulfilled"
          accent="green"
        />
        <KpiCard
          icon={<AlertCircle className="h-5 w-5" aria-hidden />}
          value={counts.critical}
          label="Critical (Open)"
          accent="blue"
        />
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                placeholder="Search by patient or hospital..."
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>

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

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Urgency
            </span>
            <div className="relative">
              <AlertCircle
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <select
                suppressHydrationWarning
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {URGENCIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {TABS.map((t) => {
            const active = tab === t.id;
            const count = counts[t.countKey] ?? 0;
            return (
              <button
                key={t.id}
                suppressHydrationWarning
                type="button"
                onClick={() => setTab(t.id)}
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
          title="Couldn't load requests"
          description={error}
          onRetry={() => void load({ page })}
        />
      )}

      {/* Empty */}
      {!error && data.requests.length === 0 && !loading && (
        <EmptyState
          icon={<Siren className="h-6 w-6" aria-hidden />}
          title={
            tab === "pending"
              ? "No pending requests"
              : "No requests in this category"
          }
          description={
            tab === "pending"
              ? "All requests are handled. Great job!"
              : "Try a different filter or check back later."
          }
        />
      )}

      {/* Request cards */}
      {!error && data.requests.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {data.requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onView={() => setDetailTarget(req)}
                onVerify={() => handleVerify(req)}
                onReject={() => {
                  setRejectTarget(req);
                  setRejectReason("");
                  setRejectError(null);
                }}
                onFulfill={() => handleFulfill(req)}
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
              requests
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
        title="Request Details"
        description={
          detailTarget
            ? `${detailTarget.patient_name} — ${detailTarget.blood_group}`
            : undefined
        }
        className="!max-w-2xl"
        footer={
          detailTarget ? (
            <>
              {detailTarget.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    size="md"
                    onClick={() => {
                      setRejectTarget(detailTarget);
                      setRejectReason("");
                      setRejectError(null);
                    }}
                  >
                    <XCircle className="h-4 w-4" aria-hidden />
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleVerify(detailTarget)}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Verify Request
                  </Button>
                </>
              )}
              {detailTarget.status === "verified" && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleInProgress(detailTarget)}
                  className="gap-2"
                >
                  <Activity className="h-4 w-4" aria-hidden />
                  Mark In Progress
                </Button>
              )}
              {detailTarget.status === "in_progress" && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleFulfill(detailTarget)}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Mark Fulfilled
                </Button>
              )}
            </>
          ) : null
        }
      >
        {detailTarget && <RequestDetail request={detailTarget} />}
      </Modal>

      {/* Reject modal */}
      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => {
          setRejectTarget(null);
          setRejectReason("");
          setRejectError(null);
        }}
        title="Reject Request"
        description={
          rejectTarget
            ? `Reject the request from ${rejectTarget.patient_name}?`
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setRejectTarget(null);
                setRejectReason("");
                setRejectError(null);
              }}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              loading={rejecting}
              onClick={handleReject}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" aria-hidden />
              Reject Request
            </Button>
          </>
        }
      >
        <FormField
          label="Reason for rejection"
          htmlFor="reject-reason"
          required
          error={rejectError ?? undefined}
          help="This will be shown to the requester."
        >
          <Textarea
            id="reject-reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Duplicate request, invalid contact..."
            rows={3}
            invalid={Boolean(rejectError)}
          />
        </FormField>
      </Modal>
    </div>
  );
}

// ─── Request card ───────────────────────────────────────────────────────────
function RequestCard({
  request,
  onView,
  onVerify,
  onReject,
  onFulfill,
}: {
  request: AdminRequestItem;
  onView: () => void;
  onVerify: () => void;
  onReject: () => void;
  onFulfill: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Blood group badge */}
        <span
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold",
            request.urgency === "critical"
              ? "bg-primary text-white"
              : request.urgency === "high"
                ? "bg-orange-light text-orange"
                : "bg-blue-light text-blue",
          )}
        >
          {request.blood_group}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-navy">
              {request.patient_name}
            </h3>
            <Badge tone={urgencyTone[request.urgency] ?? "neutral"}>
              {request.urgency}
            </Badge>
            <Badge tone={statusTone[request.status] ?? "neutral"}>
              {statusLabel[request.status] ?? request.status}
            </Badge>
          </div>

          <div className="mt-2 grid gap-2 text-xs text-text-secondary sm:grid-cols-2">
            <p className="inline-flex items-center gap-1.5">
              <Hospital className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{request.hospital_name}</span>
            </p>
            <p className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {request.city}, {request.state}
            </p>
            <p className="inline-flex items-center gap-1.5">
              <Droplet className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {request.units_required} Unit
              {request.units_required === 1 ? "" : "s"}
            </p>
            <p className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {request.hours_left !== null
                ? `Needed in ${request.hours_left}h`
                : formatRelativeTime(request.created_at)}
            </p>
          </div>

          {request.description && (
            <p className="mt-2 line-clamp-2 text-xs text-text-secondary">
              {request.description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onView}
              className="gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              View
            </Button>

            {request.status === "pending" && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onVerify}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  Verify
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onReject}
                  className="gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" aria-hidden />
                  Reject
                </Button>
              </>
            )}

            {(request.status === "verified" || request.status === "in_progress") && (
              <Button
                variant="primary"
                size="sm"
                onClick={onFulfill}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Mark Fulfilled
              </Button>
            )}

            <span className="ml-auto text-[11px] text-text-secondary">
              {formatRelativeTime(request.created_at)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Request detail ─────────────────────────────────────────────────────────
function RequestDetail({ request }: { request: AdminRequestItem }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailRow label="Blood Group" value={request.blood_group} highlight />
        <DetailRow label="Units Required" value={`${request.units_required}`} />
        <DetailRow label="Hospital" value={request.hospital_name} />
        <DetailRow label="City" value={`${request.city}, ${request.state}`} />
        <DetailRow
          label="Urgency"
          value={request.urgency}
        />
        <DetailRow
          label="Required By"
          value={
            request.required_at
              ? new Date(request.required_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Not specified"
          }
        />
        <DetailRow
          label="Contact"
          value={request.contact_phone}
          icon={<Phone className="h-3 w-3" />}
        />
        <DetailRow
          label="Status"
          value={statusLabel[request.status] ?? request.status}
        />
      </div>

      {request.requester && (
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Requested By
          </p>
          <div className="space-y-1.5 text-sm">
            <p className="inline-flex items-center gap-2 text-navy">
              <User className="h-3.5 w-3.5 text-primary" aria-hidden />
              <strong className="font-semibold">{request.requester.name}</strong>
            </p>
            {request.requester.email && (
              <p className="inline-flex items-center gap-2 text-text-secondary">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {request.requester.email}
              </p>
            )}
            {request.requester.phone && (
              <p className="inline-flex items-center gap-2 text-text-secondary">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {request.requester.phone}
              </p>
            )}
          </div>
        </div>
      )}

      {request.description && (
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Additional Notes
          </p>
          <p className="whitespace-pre-wrap text-sm text-navy">
            {request.description}
          </p>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 inline-flex items-center gap-1.5 text-sm",
          highlight ? "font-bold text-primary" : "font-medium text-navy",
        )}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}