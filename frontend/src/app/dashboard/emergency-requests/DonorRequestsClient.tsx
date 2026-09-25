"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  Search,
  MapPin,
  Droplet,
  Navigation,
  Siren,
  Share2,
  Heart,
  Users,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import {
  EmergencyRequestCard,
  type EmergencyRequestData,
} from "@/components/emergency/EmergencyRequestCard";
import {
  getBloodRequests,
  formatRelativeTime,
  type BloodRequestListItem,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  initialRequests: BloodRequestListItem[];
}

const BLOOD_GROUPS = ["Any", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const URGENCY_TABS = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "moderate", label: "Moderate" },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("");
}

function toCardData(r: BloodRequestListItem): EmergencyRequestData {
  return {
    id: r.id,
    patientName: r.patient_name,
    patientInitials: initials(r.patient_name),
    bloodGroup: r.blood_group,
    unitsRequired: r.units_required,
    hospitalName: r.hospital_name,
    city: r.city,
    urgency: r.urgency,
    hoursLeft: r.hours_left,
    requestedAgo: formatRelativeTime(r.created_at),
    description: r.description ?? "",
  };
}

export function DonorRequestsClient({ initialRequests }: Props) {
  const [allRequests, setAllRequests] = React.useState(initialRequests);
  const [loading, setLoading] = React.useState(false);

  const [filters, setFilters] = React.useState({
    bloodGroup: "Any",
    city: "Nagpur",
    distance: "25 km",
    urgency: "all" as (typeof URGENCY_TABS)[number]["id"],
  });

  const load = React.useCallback(
    async (next = filters) => {
      setLoading(true);
      const res = await getBloodRequests({
        bloodGroup: next.bloodGroup,
        city: next.city,
        urgency: next.urgency,
      });
      if (res.success) setAllRequests(res.data.requests);
      setLoading(false);
    },
    [filters],
  );

  const handleSearch = () => {
    void load(filters);
  };

  const handleTabChange = (urgency: typeof filters.urgency) => {
    const next = { ...filters, urgency };
    setFilters(next);
    void load(next);
  };

  const displayed = React.useMemo(() => {
    return allRequests.map(toCardData);
  }, [allRequests]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Emergency Requests
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Urgent Help.{" "}
              <span className="text-primary">Real Impact.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              People in need are counting on you. Respond to emergency blood
              requests and be the reason someone gets a second chance.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;In an Emergency
              <br />
              Heroes Don&apos;t Wait
              <br />
              They Donate.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Filters row */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                value={filters.bloodGroup}
                onChange={(e) =>
                  setFilters({ ...filters, bloodGroup: e.target.value })
                }
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
              Location
            </span>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <input
                suppressHydrationWarning
                type="text"
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
                placeholder="City"
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Distance
            </span>
            <div className="relative">
              <Navigation
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <select
                suppressHydrationWarning
                value={filters.distance}
                onChange={(e) =>
                  setFilters({ ...filters, distance: e.target.value })
                }
                className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>Within 10 km</option>
                <option>Within 25 km</option>
                <option>Within 50 km</option>
                <option>Within 100 km</option>
              </select>
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Urgency
            </span>
            <select
              suppressHydrationWarning
              value={filters.urgency}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  urgency: e.target.value as typeof filters.urgency,
                })
              }
              className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface px-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
          {URGENCY_TABS.map((t) => {
            const active = filters.urgency === t.id;
            return (
              <button
                key={t.id}
                suppressHydrationWarning
                type="button"
                onClick={() => handleTabChange(t.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-navy hover:border-primary hover:text-primary",
                )}
              >
                {t.label}
              </button>
            );
          })}

          <div className="ml-auto">
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              loading={loading}
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" aria-hidden />
              Search Requests
            </Button>
          </div>
        </div>
      </div>

      {/* Results + sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-navy">
                {displayed.length} Emergency Request
                {displayed.length === 1 ? "" : "s"}
              </h2>
              <p className="text-xs text-text-secondary">
                Sorted by urgency and time
              </p>
            </div>
          </div>

          {displayed.length === 0 ? (
            <EmptyState
              icon={<Siren className="h-6 w-6" aria-hidden />}
              title="No emergency requests right now"
              description="Great news — no one needs urgent help at the moment. We'll notify you when a request matches your blood group."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {displayed.map((r) => (
                <EmergencyRequestCard key={r.id} request={r} />
              ))}
            </div>
          )}

          {/* Important note */}
          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-blue"
              aria-hidden
            />
            <p className="text-xs leading-relaxed text-navy">
              <strong className="font-semibold">Important:</strong> All
              requests are verified by our team. Please contact only through
              the platform for your safety and privacy.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Can't donate right now */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <AlertCircle className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-navy">
                Can&apos;t Donate Right Now?
              </h3>
            </div>
            <p className="text-sm text-text-secondary">
              You can still help! Here are other ways to make a difference.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-light text-blue">
                  <Share2 className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Share this request
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Help us reach more donors.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-light text-purple">
                  <Users className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Spread awareness
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Post on social media.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-light text-green">
                  <Heart className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Encourage friends
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    A small share can save a life.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Life is priceless */}
          <div className="rounded-2xl border border-primary-light bg-primary-light/40 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <Heart className="h-5 w-5" fill="currentColor" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-navy">
                Life is Priceless
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">
              In emergencies, every minute matters. Your response can save a
              life.
            </p>
            <Link href="/become-a-donor" className="mt-4 block">
              <Button variant="primary" size="sm" className="w-full gap-2">
                Become a Regular Donor
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </Link>
          </div>

          {/* Verified note */}
          <div className="flex gap-3 rounded-2xl border border-green-light bg-green-light/40 p-4">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-green"
              aria-hidden
            />
            <p className="text-[11px] leading-relaxed text-navy">
              Every request is verified. Your safety and privacy are always
              protected.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}