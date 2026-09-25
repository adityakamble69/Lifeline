"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarPlus,
  Headphones,
  ArrowRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import {
  DonorCampCard,
  type DonorCampCardData,
} from "@/components/camps/DonorCampCard";

interface Props {
  initialCamps: DonorCampCardData[];
}

type FilterTab = "all" | "registered" | "upcoming";

export function DonorCampsClient({ initialCamps }: Props) {
  const [camps] = React.useState(initialCamps);
  const [activeTab, setActiveTab] = React.useState<FilterTab>("all");

  const filtered = React.useMemo(() => {
    if (activeTab === "registered")
      return camps.filter((c) => c.isRegistered);
    if (activeTab === "upcoming")
      return camps.filter(
        (c) => c.status === "upcoming" || c.status === "registration_open",
      );
    return camps;
  }, [camps, activeTab]);

  const registeredCount = camps.filter((c) => c.isRegistered).length;

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All Camps", count: camps.length },
    { id: "registered", label: "My Registrations", count: registeredCount },
    {
      id: "upcoming",
      label: "Upcoming",
      count: camps.filter(
        (c) => c.status === "upcoming" || c.status === "registration_open",
      ).length,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Nearby Camps
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Blood Donation{" "}
              <span className="text-primary">Camps</span> Near You
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Find and join blood donation camps in your area. Be a part of
              something bigger — save lives together.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;Communities
              <br />
              Blood Donors,
              <br />
              Brighter Tomorrows&rdquo;
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: cards + tabs */}
        <div className="flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors " +
                    (active
                      ? "bg-primary text-white"
                      : "bg-surface border border-border text-navy hover:border-primary hover:text-primary")
                  }
                >
                  {t.label}
                  <span
                    className={
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold " +
                      (active
                        ? "bg-white/25 text-white"
                        : "bg-background text-text-secondary")
                    }
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Camps list */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Users className="h-6 w-6" aria-hidden />}
              title={
                activeTab === "registered"
                  ? "You haven't registered for any camp yet"
                  : "No camps available"
              }
              description={
                activeTab === "registered"
                  ? "Browse camps below and register for one to see it here."
                  : "Check back later for upcoming camps near you."
              }
              action={{
                label: "Browse All Camps",
                onClick: () => setActiveTab("all"),
              }}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((camp) => (
                <DonorCampCard key={camp.id} camp={camp} />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Map placeholder */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-light via-background to-blue-light">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <span className="h-3 w-3 rounded-full bg-white" />
                </span>
                <p className="text-sm font-semibold text-navy">
                  Camps Near You
                </p>
                <p className="text-xs text-text-secondary">
                  Map view coming soon.
                </p>
              </div>
            </div>
            <div className="border-t border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Legend
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-navy">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Camp location
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue" />
                  Your location
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-navy">
              Your Camp Activity
            </h3>
            <ul className="mt-3 flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <CalendarPlus className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-lg font-bold leading-tight text-navy">
                    {registeredCount}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Registered Camps
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-light text-green">
                  <Users className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-lg font-bold leading-tight text-navy">
                    3
                  </p>
                  <p className="text-xs text-text-secondary">
                    Lives Saved per Donation
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Suggest a camp */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <CalendarPlus className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-navy">
                Want to organize a camp?
              </h3>
            </div>
            <p className="text-sm text-text-secondary">
              Partner with us to organize a blood donation camp in your
              community.
            </p>
            <Link href="/contact" className="mt-4 block">
              <Button variant="secondary" size="sm" className="w-full gap-2">
                Request a Camp
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-light text-blue">
                <Headphones className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-navy">Need Help?</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Contact our support team for any queries.
            </p>
            <Link href="/contact" className="mt-4 block">
              <Button variant="secondary" size="sm" className="w-full gap-2">
                Contact Us
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>

          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-blue"
              aria-hidden
            />
            <p className="text-xs leading-relaxed text-navy">
              Registering helps organizers plan better. You&apos;ll receive
              reminders before the camp.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}