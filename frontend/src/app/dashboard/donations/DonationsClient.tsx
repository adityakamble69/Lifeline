"use client";

import * as React from "react";
import Link from "next/link";
import {
  Droplet,
  Heart,
  Calendar,
  Award,
  Download,
  FileText,
  CheckCircle2,
  Star,
  Users,
  Leaf,
  Trophy,
} from "lucide-react";
import { Card, KpiCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import {
  formatDonationDate,
  type MeProfile,
  type MeDonation,
} from "@/lib/api";

interface Props {
  profile: MeProfile;
  donations: MeDonation[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function daysUntil(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff > 0 ? diff : 0;
}

export function DonationsClient({ profile, donations }: Props) {
  const donor = profile.donor;
  const totalDonations = donations.length;
  const livesSaved = totalDonations * 3;
  const memberSince = new Date(profile.user.created_at).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" },
  );
  const nextEligible = donor?.next_eligible_date;
  const daysLeft = nextEligible ? daysUntil(nextEligible) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              My Donations
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              My Donations
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Track your blood donation history, impact, and next eligibility.
              Your donations save lives. Thank you for being a hero!
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;Every donation counts.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Droplet className="h-5 w-5" aria-hidden />}
          value={totalDonations}
          label="Total Donations"
          accent="primary"
        />
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={livesSaved}
          label="Lives Potentially Saved"
          accent="green"
        />
        <KpiCard
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          value={nextEligible ? formatDate(nextEligible) : "Available"}
          label="Next Eligible Date"
          accent="blue"
        />
        <KpiCard
          icon={<Award className="h-5 w-5" aria-hidden />}
          value="Blood Donor"
          label={`Member since ${memberSince}`}
          accent="orange"
        />
      </section>

      {/* Main grid */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: History + Certificates */}
        <div className="flex flex-col gap-6">
          {/* Donation History */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">
                Donation History
              </h2>
              {donations.length > 0 && (
                <span className="text-xs text-text-secondary">
                  {donations.length} record{donations.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {donations.length === 0 ? (
              <EmptyState
                icon={<Droplet className="h-6 w-6" aria-hidden />}
                title="No donations recorded yet"
                description="Register for a nearby camp to make your first donation."
                action={{
                  label: "Find a Camp",
                  onClick: () => {
                    window.location.href = "/dashboard/camps";
                  },
                }}
              />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto rounded-xl border border-border sm:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-background text-left">
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          #
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Date
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Location / Camp
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Blood Group
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Units
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Status
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Certificate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {donations.map((d, i) => (
                        <tr key={d.id} className="hover:bg-background/60">
                          <td className="px-4 py-3 text-xs text-text-secondary">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3 font-medium text-navy">
                            {formatDate(d.donation_date)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-[240px] truncate font-medium text-navy">
                              {d.camps?.title ?? "Direct Donation"}
                            </div>
                            {d.camps && (
                              <div className="mt-0.5 truncate text-xs text-text-secondary">
                                {d.camps.venue}, {d.camps.city}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-1 text-xs font-bold text-primary">
                              {d.blood_group}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-navy">
                            {d.units} Unit{d.units === 1 ? "" : "s"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone="success">
                              {d.status.charAt(0).toUpperCase() +
                                d.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              suppressHydrationWarning
                              type="button"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                              <Download className="h-3.5 w-3.5" aria-hidden />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="flex flex-col gap-3 sm:hidden">
                  {donations.map((d, i) => (
                    <div
                      key={d.id}
                      className="rounded-2xl border border-border bg-surface p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-text-secondary">
                              #{i + 1}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">
                              {d.blood_group}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-navy">
                            {d.camps?.title ?? "Direct Donation"}
                          </p>
                          {d.camps && (
                            <p className="mt-0.5 text-xs text-text-secondary">
                              {d.camps.venue}, {d.camps.city}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-text-secondary">
                            {formatDate(d.donation_date)} · {d.units} Unit
                          </p>
                        </div>
                        <Badge tone="success">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Certificates */}
          {donations.length > 0 && (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-navy">
                  Certificates
                </h2>
                <span className="text-xs font-semibold text-primary">
                  View All →
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {donations.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <FileText className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        Donation Certificate
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {formatDate(d.donation_date)}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {d.camps?.title ?? "Direct Donation"}
                      </p>
                    </div>
                    <button
                      suppressHydrationWarning
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6">
          {/* Next Eligible */}
          {nextEligible && (
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-navy">
                Next Eligible Donation
              </h2>
              <div className="rounded-2xl bg-primary-light/50 p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {formatDate(nextEligible)}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  You can donate again in{" "}
                  <span className="font-semibold text-navy">
                    {daysLeft} days
                  </span>
                </p>
              </div>
              <div className="mt-4 flex gap-3 rounded-xl border border-blue-light bg-blue-light/40 p-3">
                <span className="mt-0.5 shrink-0 text-blue">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                </span>
                <p className="text-xs leading-relaxed text-navy">
                  You can donate whole blood once every 3 months (90 days).
                  Regular donation keeps you healthy too!
                </p>
              </div>
            </Card>
          )}

          {/* Your Impact */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-navy">Your Impact</h2>
            <ul className="flex flex-col gap-4">
              <ImpactRow
                icon={<Users className="h-4 w-4" aria-hidden />}
                accent="primary"
                value={livesSaved}
                label="Lives Potentially Saved"
              />
              <ImpactRow
                icon={<Leaf className="h-4 w-4" aria-hidden />}
                accent="green"
                value={totalDonations}
                label="Donation Camps Attended"
              />
              <ImpactRow
                icon={<Trophy className="h-4 w-4" aria-hidden />}
                accent="orange"
                value={new Date().getFullYear() - new Date(profile.user.created_at).getFullYear() + 1}
                label="Year of Donor Journey"
              />
              <li className="flex items-center gap-3 rounded-xl bg-primary-light/40 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                  <Star className="h-4 w-4" fill="currentColor" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Keep Going!
                  </p>
                  <p className="text-xs text-text-secondary">
                    You&apos;re making a difference.
                  </p>
                </div>
              </li>
            </ul>
          </Card>

          {/* Find a camp */}
          <Link href="/dashboard/camps">
            <Button variant="primary" size="md" className="w-full gap-2">
              <Calendar className="h-4 w-4" aria-hidden />
              Find a Blood Camp
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ImpactRow({
  icon,
  accent,
  value,
  label,
}: {
  icon: React.ReactNode;
  accent: "primary" | "green" | "orange";
  value: number;
  label: string;
}) {
  const accents: Record<typeof accent, string> = {
    primary: "bg-primary-light text-primary",
    green: "bg-green-light text-green",
    orange: "bg-orange-light text-orange",
  };
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <p className="text-lg font-bold leading-tight text-navy">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
      </div>
    </li>
  );
}