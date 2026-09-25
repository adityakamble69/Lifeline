"use client";

import * as React from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  Info,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { DonorCampCard, type DonorCampCardData } from "@/components/camps/DonorCampCard";
import { cn } from "@/lib/utils";

interface Props {
  camps: DonorCampCardData[];
}

type Tab = "available" | "registered" | "all";

export function RegisterForCampClient({ camps }: Props) {
  const [tab, setTab] = React.useState<Tab>("available");

  const available = camps.filter(
    (c) =>
      !c.isRegistered &&
      c.status !== "completed" &&
      c.status !== "cancelled",
  );
  const registered = camps.filter((c) => c.isRegistered);

  const displayed =
    tab === "available" ? available : tab === "registered" ? registered : camps;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "available", label: "Available to Register", count: available.length },
    { id: "registered", label: "My Registrations", count: registered.length },
    { id: "all", label: "All Camps", count: camps.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Register for Camp
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Take the First Step to{" "}
              <span className="text-primary">Save a Life</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Pick a camp near you and reserve your slot. It only takes 2
              minutes, and your one donation can save up to 3 lives.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;Be a Hero
              <br />
              Give Blood
              <br />
              Give Hope&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              suppressHydrationWarning
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
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
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Camps list */}
        <div className="flex flex-col gap-4">
          {displayed.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-6 w-6" aria-hidden />}
              title={
                tab === "available"
                  ? "No available camps right now"
                  : tab === "registered"
                    ? "You haven't registered for any camp yet"
                    : "No camps available"
              }
              description={
                tab === "available"
                  ? "Check back later — new camps are added regularly."
                  : tab === "registered"
                    ? "Pick a camp from the 'Available' tab to get started."
                    : "New camps will appear here when published."
              }
              action={
                tab === "registered"
                  ? {
                      label: "Browse Available Camps",
                      onClick: () => setTab("available"),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              {displayed.map((camp) => (
                <DonorCampCard key={camp.id} camp={camp} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Why register */}
          <div className="rounded-2xl border border-primary-light bg-primary-light/40 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <ClipboardList className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-navy">
                Why Register?
              </h3>
            </div>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              {[
                "Helps in better organization at camp",
                "Reduced waiting time for you",
                "You'll receive confirmation & reminders",
                "Track your donation history automatically",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-navy">
              Your Registration Summary
            </h3>
            <ul className="mt-3 flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-light text-green">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-lg font-bold leading-tight text-navy">
                    {registered.length}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Confirmed Registrations
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-light text-blue">
                  <Users className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-lg font-bold leading-tight text-navy">
                    {available.length}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Available Camps
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
            <p className="text-[11px] leading-relaxed text-navy">
              Bring a valid ID proof on the camp day. Eat well and stay
              hydrated before donating.
            </p>
          </div>

          {/* Back to camps */}
          <Link href="/dashboard/camps">
            <Button variant="secondary" size="sm" className="w-full gap-2">
              Browse All Camps
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}