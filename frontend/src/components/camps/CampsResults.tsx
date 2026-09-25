"use client";

import * as React from "react";
import Link from "next/link";
import { Headphones, CalendarPlus, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, SkeletonCard } from "@/components/ui/States";
import { CampCard, type CampCardData } from "./CampCard";
import { CampFilters, type CampFiltersState } from "./CampFilters";
import {
  getCamps,
  formatCampDateParts,
  formatCampTimeRange,
  type CampListItem,
} from "@/lib/api";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=800&q=80",
];

function pickImage(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) | 0;
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

function statusForCard(s: string): CampCardData["status"] {
  if (s === "registration_open" || s === "open") return "registration_open";
  if (s === "completed") return "completed";
  if (s === "cancelled") return "cancelled";
  return "upcoming";
}

function toCardData(camp: CampListItem): CampCardData {
  const { day, month, dateLabel } = formatCampDateParts(camp.start_at);
  return {
    id: camp.id,
    title: camp.title,
    organizer: camp.organizer,
    date: dateLabel,
    day,
    month,
    venue: `${camp.venue}, ${camp.city}`,
    time: formatCampTimeRange(camp.start_at, camp.end_at),
    description: camp.description ?? "",
    capacity: `${camp.registered} / ${camp.capacity} registered`,
    tags: ["All Blood Groups", "Free Health Checkup"],
    status: statusForCard(camp.status),
    image: pickImage(camp.id),
  };
}

export function CampsResults() {
  const [filters, setFilters] = React.useState<CampFiltersState | null>(null);
  const [camps, setCamps] = React.useState<CampCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (f?: CampFiltersState | null) => {
    setLoading(true);
    setError(null);

    const city =
      f?.location && f.location !== "Nagpur, Maharashtra"
        ? f.location.split(",")[0].trim()
        : undefined;

    const res = await getCamps(city ? { city } : undefined);

    if (!res.success) {
      setError(res.error.message);
      setCamps([]);
      setLoading(false);
      return;
    }

    setCamps(res.data.camps.map(toCardData));
    setLoading(false);
  }, []);

  React.useEffect(() => {
    void load(null);
  }, [load]);

  const handleSearch = (next: CampFiltersState) => {
    setFilters(next);
    void load(next);
  };

  return (
    <div className="flex flex-col gap-6">
      <CampFilters onSearch={handleSearch} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-navy">
                {loading ? "Loading camps…" : `${camps.length} Camps Found`}
              </h2>
              <p className="text-xs text-text-secondary">
                Sorted by nearest first
              </p>
            </div>
            {filters && !loading && (
              <p className="text-xs text-text-secondary">
                Filters: {filters.location} · {filters.date}
              </p>
            )}
          </div>

          {loading && (
            <div className="flex flex-col gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading && error && (
            <ErrorState
              title="Couldn't load camps"
              description={error}
              onRetry={() => void load(filters)}
            />
          )}

          {!loading && !error && camps.length === 0 && (
            <EmptyState
              icon={<AlertCircle className="h-6 w-6" aria-hidden />}
              title="No camps found"
              description="Try a different city or date — or check back later."
            />
          )}

          {!loading && !error && camps.length > 0 && (
            <div className="flex flex-col gap-4">
              {camps.map((camp) => (
                <CampCard key={camp.id} camp={camp} />
              ))}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
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

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <CalendarPlus className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-navy">
                Can&apos;t find a camp near you?
              </h3>
            </div>
            <p className="text-sm text-text-secondary">
              Suggest a camp in your area and we&apos;ll help reach more lives.
            </p>
            <Link href="/contact" className="mt-4 block">
              <Button variant="secondary" size="sm" className="w-full gap-2">
                Suggest a Camp
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>

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
        </aside>
      </div>
    </div>
  );
}