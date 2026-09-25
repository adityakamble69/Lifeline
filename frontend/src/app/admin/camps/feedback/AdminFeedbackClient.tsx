"use client";

import * as React from "react";
import {
  MessageSquare,
  Search,
  Star,
  RefreshCw,
  Mail,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  User,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import {
  getAdminFeedback,
  formatCampDateParts,
  formatRelativeTime,
  type AdminFeedbackItem,
  type AdminFeedbackResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminFeedbackResponse;
}

const RATING_TABS = [
  { id: "all", label: "All Ratings" },
  { id: "5", label: "5 ★" },
  { id: "4", label: "4 ★" },
  { id: "3", label: "3 ★" },
  { id: "2", label: "2 ★" },
  { id: "1", label: "1 ★" },
] as const;

type RatingTab = (typeof RATING_TABS)[number]["id"];

export function AdminFeedbackClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [campFilter, setCampFilter] = React.useState("");
  const [ratingFilter, setRatingFilter] = React.useState<RatingTab>("all");
  const [page, setPage] = React.useState(1);

  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = React.useCallback(
    async (opts?: { page?: number }) => {
      setLoading(true);
      setError(null);
      const res = await getAdminFeedback(token, {
        campId: campFilter || undefined,
        rating: ratingFilter,
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
    [token, campFilter, ratingFilter, debouncedSearch, page],
  );

  React.useEffect(() => {
    setPage(1);
    void load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campFilter, ratingFilter, debouncedSearch]);

  const resetFilters = () => {
    setSearch("");
    setCampFilter("");
    setRatingFilter("all");
    setPage(1);
  };

  const { stats, pagination } = data;
  const dist = stats.distribution;
  const distTotal = Object.values(dist).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Camp Feedback
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Volunteer & Donor{" "}
              <span className="text-primary">Feedback</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Read what donors and volunteers say about your camps. Use this
              to improve future events.
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
          icon={<MessageSquare className="h-5 w-5" aria-hidden />}
          value={stats.total}
          label="Total Feedback"
          accent="primary"
        />
        <KpiCard
          icon={<Star className="h-5 w-5" aria-hidden />}
          value={stats.average}
          label="Average Rating"
          accent="orange"
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5" aria-hidden />}
          value={dist["5"] ?? 0}
          label="5-Star Reviews"
          accent="green"
        />
        <KpiCard
          icon={<MessageCircle className="h-5 w-5" aria-hidden />}
          value={dist["1"] + dist["2"]}
          label="Low Ratings (1-2★)"
          accent="blue"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Search Comments
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
                    placeholder="Search in comments..."
                    className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </label>

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
                  {stats.camp_options.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.title} — {camp.city}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Rating tabs */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              {RATING_TABS.map((t) => {
                const active = ratingFilter === t.id;
                const count =
                  t.id === "all" ? stats.total : (dist[t.id] ?? 0);
                return (
                  <button
                    key={t.id}
                    suppressHydrationWarning
                    type="button"
                    onClick={() => setRatingFilter(t.id)}
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
              title="Couldn't load feedback"
              description={error}
              onRetry={() => void load({ page })}
            />
          )}

          {/* Empty */}
          {!error && data.feedback.length === 0 && !loading && (
            <EmptyState
              icon={<MessageSquare className="h-6 w-6" aria-hidden />}
              title="No feedback yet"
              description="Feedback from donors and volunteers will appear here."
              action={{ label: "Reset Filters", onClick: resetFilters }}
            />
          )}

          {/* Feedback cards */}
          {!error && data.feedback.length > 0 && (
            <>
              <div className="flex flex-col gap-4">
                {data.feedback.map((item) => (
                  <FeedbackCard key={item.id} feedback={item} />
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
                  reviews
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
                    disabled={
                      pagination.page >= pagination.total_pages || loading
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-navy transition-colors hover:bg-background disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Rating distribution */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-base font-semibold text-navy">
              Rating Distribution
            </h3>
            <div className="mb-4 flex items-center gap-3">
              <p className="text-3xl font-bold text-navy">{stats.average}</p>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={cn(
                        "h-4 w-4",
                        n <= Math.round(stats.average)
                          ? "fill-orange text-orange"
                          : "text-border",
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Based on {stats.total} review
                  {stats.total === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((r) => {
                const count = dist[String(r)] ?? 0;
                const pct = distTotal ? (count / distTotal) * 100 : 0;
                return (
                  <li key={r}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-navy">
                        {r}
                        <Star
                          className="h-3 w-3 fill-orange text-orange"
                          aria-hidden
                        />
                      </span>
                      <span className="text-text-secondary">
                        {count} ({Math.round(pct)}%)
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Info */}
          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <MessageSquare
              className="mt-0.5 h-4 w-4 shrink-0 text-blue"
              aria-hidden
            />
            <p className="text-[11px] leading-relaxed text-navy">
              Feedback helps improve future camps. Consider reaching out to
              donors who rated below 3 stars to understand their experience.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Feedback card ──────────────────────────────────────────────────────────
function FeedbackCard({ feedback }: { feedback: AdminFeedbackItem }) {
  const ratingTone: BadgeTone =
    feedback.rating >= 4
      ? "success"
      : feedback.rating === 3
        ? "warning"
        : "error";

  const { dateLabel } = feedback.camp
    ? formatCampDateParts(feedback.camp.start_at)
    : { dateLabel: "" };

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Avatar */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
          {(feedback.user?.name ?? "?")
            .split(" ")
            .slice(0, 2)
            .map((s) => s.charAt(0).toUpperCase())
            .join("")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy">
                {feedback.user?.name ?? "Anonymous"}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                {feedback.user?.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" aria-hidden />
                    {feedback.user.email}
                  </span>
                )}
                <span>·</span>
                <span>{formatRelativeTime(feedback.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "h-3.5 w-3.5",
                    n <= feedback.rating
                      ? "fill-orange text-orange"
                      : "text-border",
                  )}
                  aria-hidden
                />
              ))}
              <Badge tone={ratingTone}>{feedback.rating}/5</Badge>
            </div>
          </div>

          {feedback.comment && (
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {feedback.comment}
            </p>
          )}

          {feedback.camp && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-primary" aria-hidden />
                <span className="font-medium text-navy">
                  {feedback.camp.title}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary" aria-hidden />
                {feedback.camp.city}
              </span>
              <span className="text-[11px]">· {dateLabel}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}