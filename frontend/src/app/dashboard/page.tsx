import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Droplet,
  Heart,
  Calendar,
  Users,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Siren,
} from "lucide-react";
import { Card, KpiCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getMyProfile,
  getMyStats,
  getMyUpcomingCamps,
  formatCampDateParts,
  formatCampTimeRange,
  formatRelativeTime,
} from "@/lib/api";

export const metadata: Metadata = {
  title: "Dashboard — Lifeline",
};

// Helper to grab a fresh Clerk token server-side.
async function getServerToken() {
  const { getToken } = await auth();
  return getToken();
}

export default async function DonorDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getServerToken();
  if (!token) redirect("/sign-in");

  const [profileRes, statsRes, campsRes] = await Promise.all([
    getMyProfile(token),
    getMyStats(token),
    getMyUpcomingCamps(token),
  ]);

  const profile = profileRes.success ? profileRes.data : null;
  const stats = statsRes.success ? statsRes.data.stats : null;
  const camps = campsRes.success ? campsRes.data.camps : [];

  const firstName = profile?.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm text-text-secondary">Good Morning,</p>
            <h1 className="mt-1 text-3xl font-bold text-navy sm:text-4xl">
              {firstName}! 👋
            </h1>
            <p className="mt-3 max-w-lg text-sm text-text-secondary sm:text-base">
              Thank you for being a part of Lifeline. Your small act of
              kindness makes a big difference.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/dashboard/find-blood">
                <Button variant="primary" size="md" className="gap-2">
                  Find Blood
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/dashboard/camps">
                <Button variant="secondary" size="md">
                  Nearby Camps
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-2xl bg-surface/60 p-6 backdrop-blur">
              <p className="font-['Brush_Script_MT',_cursive] text-2xl leading-snug text-primary">
                &ldquo;Heroes aren&apos;t born,
                <br />
                they donate blood.&rdquo;
              </p>
              <div className="mt-4 h-0.5 w-12 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Droplet className="h-5 w-5" aria-hidden />}
          value={profile?.donor?.blood_group ?? "—"}
          label="Your Blood Group"
          accent="primary"
        />
        <KpiCard
          icon={<Heart className="h-5 w-5" aria-hidden />}
          value={stats?.total_donations ?? 0}
          label="Total Donations"
          accent="green"
        />
        <KpiCard
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          value={stats?.upcoming_camps ?? 0}
          label="Upcoming Camps"
          accent="blue"
        />
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={stats?.lives_saved ?? 0}
          label="Lives Potentially Saved"
          accent="orange"
        />
      </section>

      {/* Two-column grid */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Upcoming camps */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">
                Upcoming Camps
              </h2>
              <Link
                href="/dashboard/camps"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All →
              </Link>
            </div>

            {camps.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center">
                <Calendar
                  className="h-8 w-8 text-text-secondary"
                  aria-hidden
                />
                <p className="text-sm font-medium text-navy">
                  No upcoming camps
                </p>
                <p className="text-xs text-text-secondary">
                  Register for a camp to see it here.
                </p>
                <Link href="/dashboard/camps" className="mt-3">
                  <Button variant="secondary" size="sm">
                    Browse Camps
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {camps.map((reg) => {
                  const camp = reg.camps;
                  if (!camp) return null;
                  const { day, month, dateLabel } = formatCampDateParts(
                    camp.start_at,
                  );
                  const time = formatCampTimeRange(
                    camp.start_at,
                    camp.end_at,
                  );
                  return (
                    <li
                      key={reg.id}
                      className="flex gap-4 rounded-2xl border border-border bg-surface p-4"
                    >
                      <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
                        <span className="text-lg font-bold leading-none">
                          {day}
                        </span>
                        <span className="text-[10px] font-medium uppercase">
                          {month}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy">
                          {camp.title}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                          {camp.venue}, {camp.city}
                        </p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {dateLabel} · {time}
                        </p>
                      </div>
                      <Badge tone="success">Registered</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Recent blood requests */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">
                Emergency Requests
              </h2>
              <Link
                href="/dashboard/emergency-requests"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center">
              <Siren className="h-8 w-8 text-primary" aria-hidden />
              <p className="text-sm font-medium text-navy">
                No open requests right now
              </p>
              <p className="text-xs text-text-secondary">
                We&apos;ll notify you when someone nearby needs your blood group.
              </p>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Profile completion */}
          <Card>
            <h2 className="mb-3 text-lg font-semibold text-navy">
              Profile Completion
            </h2>
            <div className="flex items-center gap-4">
              <ProfileRing percent={stats?.profile_completion ?? 0} />
              <div>
                <p className="text-sm font-semibold text-navy">
                  {stats?.profile_completion ?? 0}% complete
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Complete your profile to help us serve you better.
                </p>
              </div>
            </div>
            <Link href="/dashboard/profile" className="mt-4 block">
              <Button variant="primary" size="sm" className="w-full gap-2">
                Complete Profile
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </Link>
          </Card>

          {/* Next eligibility */}
          {profile?.donor?.next_eligible_date && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-navy">
                Next Eligible Donation
              </h2>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Calendar className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-base font-bold text-navy">
                    {formatRelativeTime(profile.donor.next_eligible_date)}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    You can donate blood once every 3 months.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Recent notifications */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">
                Notifications
              </h2>
              <Link
                href="/dashboard/notifications"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All →
              </Link>
            </div>

            {!stats?.recent_notifications.length ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center">
                <CheckCircle2
                  className="h-7 w-7 text-text-secondary"
                  aria-hidden
                />
                <p className="text-xs text-text-secondary">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {stats.recent_notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span
                      className={
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                        (n.is_read
                          ? "bg-background text-text-secondary"
                          : "bg-primary-light text-primary")
                      }
                    >
                      <AlertCircle className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy">
                        {n.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[10px] text-text-secondary">
                        {formatRelativeTime(n.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Quick actions */}
          <Card>
            <h2 className="mb-3 text-lg font-semibold text-navy">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Find Blood", href: "/dashboard/find-blood" },
                { label: "Nearby Camps", href: "/dashboard/camps" },
                { label: "My Donations", href: "/dashboard/donations" },
                { label: "My Profile", href: "/dashboard/profile" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="rounded-xl border border-border bg-surface px-3 py-3 text-center text-xs font-semibold text-navy transition-colors hover:border-primary hover:text-primary"
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Simple SVG progress ring
function ProfileRing({ percent }: { percent: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="var(--color-primary-red)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-navy">{percent}%</span>
      </div>
    </div>
  );
}