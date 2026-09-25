"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Calendar,
  Siren,
  Droplet,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  UserPlus,
  PlusCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, KpiCard } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import {
  formatCampDateParts,
  formatCampTimeRange,
  formatRelativeTime,
  type DashboardStats,
  type DashboardActivity,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  stats: DashboardStats;
  activity: DashboardActivity;
}

export function AdminDashboardClient({ stats, activity }: Props) {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Welcome Back, <span className="text-primary">Organizer!</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
              Here&apos;s what&apos;s happening across your organization today.
              Keep the network active and lives being saved.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
                aria-hidden
              />
              Refresh
            </Button>
            <Link href="/admin/camps">
              <Button variant="primary" size="sm" className="gap-2">
                <PlusCircle className="h-3.5 w-3.5" aria-hidden />
                New Camp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI cards row 1 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={stats.donors.total}
          label="Total Donors"
          accent="primary"
        />
        <KpiCard
          icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
          value={stats.donors.pending}
          label="Pending Approvals"
          accent="orange"
        />
        <KpiCard
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          value={stats.camps.upcoming}
          label="Upcoming Camps"
          accent="blue"
        />
        <KpiCard
          icon={<Siren className="h-5 w-5" aria-hidden />}
          value={stats.requests.critical}
          label="Critical Requests"
          accent="green"
        />
      </section>

      {/* KPI cards row 2 (smaller) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          icon={<CheckCircle2 className="h-4 w-4" aria-hidden />}
          accent="green"
          value={stats.donors.approved}
          label="Approved Donors"
        />
        <MiniStat
          icon={<Calendar className="h-4 w-4" aria-hidden />}
          accent="blue"
          value={stats.camps.total}
          label="Total Camps"
        />
        <MiniStat
          icon={<Droplet className="h-4 w-4" aria-hidden />}
          accent="primary"
          value={stats.requests.verified + stats.requests.pending}
          label="Active Requests"
        />
        <MiniStat
          icon={<Activity className="h-4 w-4" aria-hidden />}
          accent="orange"
          value={stats.registrations.total}
          label="Total Registrations"
        />
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
          title="Approvals"
          description={`${stats.donors.pending} pending`}
          href="/admin/donor-approvals"
          accent="orange"
        />
        <QuickAction
          icon={<Users className="h-5 w-5" aria-hidden />}
          title="Manage Donors"
          description={`${stats.donors.total} total`}
          href="/admin/donors"
          accent="primary"
        />
        <QuickAction
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          title="Manage Camps"
          description={`${stats.camps.upcoming} upcoming`}
          href="/admin/camps"
          accent="blue"
        />
        <QuickAction
          icon={<BarChart3 className="h-5 w-5" aria-hidden />}
          title="Analytics"
          description="View reports"
          href="/admin/analytics"
          accent="green"
        />
      </section>

      {/* Main grid */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Pending approvals */}
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-light text-orange">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-navy">
                    Pending Donor Approvals
                  </h2>
                  <p className="text-xs text-text-secondary">
                    {stats.donors.pending} awaiting review
                  </p>
                </div>
              </div>
              <Link
                href="/admin/donor-approvals"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View All
                <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>

            {activity.pending_approvals.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="h-6 w-6" aria-hidden />}
                title="No pending approvals"
                description="All donors are reviewed. Great job!"
              />
            ) : (
              <ul className="divide-y divide-border">
                {activity.pending_approvals.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                      {item.name
                        .split(" ")
                        .slice(0, 2)
                        .map((s) => s.charAt(0).toUpperCase())
                        .join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy">
                        {item.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {item.city}, {item.state}
                        {item.blood_group && ` · ${item.blood_group}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="warning">Pending</Badge>
                      <Link
                        href="/admin/donor-approvals"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Review
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Recent blood requests */}
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Siren className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-navy">
                    Recent Blood Requests
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Latest from the network
                  </p>
                </div>
              </div>
              <Link
                href="/admin/requests"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View All
                <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>

            {activity.recent_requests.length === 0 ? (
              <EmptyState
                icon={<Droplet className="h-6 w-6" aria-hidden />}
                title="No requests yet"
                description="Blood requests will appear here."
              />
            ) : (
              <ul className="divide-y divide-border">
                {activity.recent_requests.map((req) => (
                  <li
                    key={req.id}
                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        req.urgency === "critical"
                          ? "bg-primary-light text-primary"
                          : req.urgency === "high"
                            ? "bg-orange-light text-orange"
                            : "bg-blue-light text-blue",
                      )}
                    >
                      <Droplet className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy">
                        {req.patient_name} — {req.blood_group}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {req.hospital_name}, {req.city} · {req.units_required}{" "}
                        unit{req.units_required === 1 ? "" : "s"}
                      </p>
                      <p className="mt-1 text-[11px] text-text-secondary">
                        {formatRelativeTime(req.created_at)}
                      </p>
                    </div>
                    <Badge
                      tone={
                        (req.urgency === "critical"
                          ? "error"
                          : req.urgency === "high"
                            ? "warning"
                            : "info") as BadgeTone
                      }
                    >
                      {req.urgency}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Upcoming camps */}
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-light text-blue">
                  <Calendar className="h-4 w-4" aria-hidden />
                </span>
                <h2 className="text-lg font-semibold text-navy">
                  Upcoming Camps
                </h2>
              </div>
              <Link
                href="/admin/camps"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All →
              </Link>
            </div>

            {activity.upcoming_camps.length === 0 ? (
              <EmptyState
                icon={<Calendar className="h-6 w-6" aria-hidden />}
                title="No upcoming camps"
                description="Create a new camp to get started."
                action={{
                  label: "Create Camp",
                  onClick: () => {
                    window.location.href = "/admin/camps";
                  },
                }}
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {activity.upcoming_camps.map((camp) => {
                  const { day, month } = formatCampDateParts(camp.start_at);
                  const time = formatCampTimeRange(camp.start_at, camp.end_at);
                  return (
                    <li
                      key={camp.id}
                      className="flex gap-3 rounded-2xl border border-border bg-surface p-3"
                    >
                      <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
                        <span className="text-base font-bold leading-none">
                          {day}
                        </span>
                        <span className="text-[9px] font-medium uppercase">
                          {month}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy">
                          {camp.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-text-secondary">
                          {camp.venue}, {camp.city}
                        </p>
                        <p className="mt-0.5 text-[11px] text-text-secondary">
                          {time}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Recent registrations */}
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-light text-green">
                <UserPlus className="h-4 w-4" aria-hidden />
              </span>
              <h2 className="text-lg font-semibold text-navy">
                Recent Registrations
              </h2>
            </div>

            {activity.recent_registrations.length === 0 ? (
              <EmptyState
                icon={<UserPlus className="h-6 w-6" aria-hidden />}
                title="No registrations yet"
                description="Camp registrations will appear here."
              />
            ) : (
              <ul className="divide-y divide-border">
                {activity.recent_registrations.map((reg) => (
                  <li
                    key={reg.id}
                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                      {reg.user_name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-navy">
                        {reg.user_name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {reg.camp_title}
                      </p>
                      <p className="mt-1 text-[11px] text-text-secondary">
                        {formatRelativeTime(reg.registered_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

// ─── Helper components ───────────────────────────────────────────────

function MiniStat({
  icon,
  accent,
  value,
  label,
}: {
  icon: React.ReactNode;
  accent: "primary" | "green" | "blue" | "orange";
  value: number;
  label: string;
}) {
  const accents: Record<typeof accent, string> = {
    primary: "bg-primary-light text-primary",
    green: "bg-green-light text-green",
    blue: "bg-blue-light text-blue",
    orange: "bg-orange-light text-orange",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-base font-bold text-navy">{value}</p>
        <p className="truncate text-xs text-text-secondary">{label}</p>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  href,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  accent: "primary" | "green" | "blue" | "orange";
}) {
  const accents: Record<typeof accent, string> = {
    primary: "bg-primary-light text-primary",
    green: "bg-green-light text-green",
    blue: "bg-blue-light text-blue",
    orange: "bg-orange-light text-orange",
  };
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-elevated)]"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">{title}</p>
        <p className="truncate text-[11px] text-text-secondary">
          {description}
        </p>
      </div>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-text-secondary transition-colors group-hover:text-primary"
        aria-hidden
      />
    </Link>
  );
}