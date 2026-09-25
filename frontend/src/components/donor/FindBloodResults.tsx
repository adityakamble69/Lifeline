"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState, ErrorState, SkeletonTableRows } from "@/components/ui/States";
import { DonorCard, type DonorCardData } from "./DonorCard";
import {
  FindBloodFilters,
  type FindBloodFiltersState,
} from "./FindBloodFilters";
import {
  searchDonors,
  formatDonationDate,
  type DonorListItem,
} from "@/lib/api";

function toCardData(donor: DonorListItem): DonorCardData {
  return {
    id: donor.id,
    name: donor.name,
    age: donor.age,
    bloodGroup: donor.blood_group,
    city: donor.city,
    lastDonation: formatDonationDate(donor.last_donation),
    availability: donor.availability,
    verified: donor.verified,
  };
}

export function FindBloodResults() {
  const [filters, setFilters] = React.useState<FindBloodFiltersState | null>(
    null,
  );
  const [donors, setDonors] = React.useState<DonorCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (f?: FindBloodFiltersState | null) => {
    setLoading(true);
    setError(null);

    const res = await searchDonors({
      bloodGroup: f?.bloodGroup,
      city: f?.city,
      availability:
        f?.availability === "Available Now"
          ? "available"
          : f?.availability === "Any"
            ? undefined
            : undefined,
    });

    if (!res.success) {
      setError(res.error.message);
      setDonors([]);
      setLoading(false);
      return;
    }

    setDonors(res.data.donors.map(toCardData));
    setLoading(false);
  }, []);

  React.useEffect(() => {
    void load(null);
  }, [load]);

  const handleSearch = (next: FindBloodFiltersState) => {
    setFilters(next);
    void load(next);
  };

  return (
    <div className="flex flex-col gap-6">
      <FindBloodFilters onSearch={handleSearch} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-navy">
                {loading ? "Searching donors…" : `${donors.length} Donors Found`}
              </h2>
              <p className="text-xs text-text-secondary">
                Sorted by most recent donation
              </p>
            </div>
            {filters && !loading && (
              <p className="text-xs text-text-secondary">
                Filters: {filters.bloodGroup} · {filters.city} · {filters.radius}
              </p>
            )}
          </div>

          {loading && (
            <div className="rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
              <SkeletonTableRows rows={5} cols={3} />
            </div>
          )}

          {!loading && error && (
            <ErrorState
              title="Couldn't load donors"
              description={error}
              onRetry={() => void load(filters)}
            />
          )}

          {!loading && !error && donors.length === 0 && (
            <EmptyState
              icon={<Users className="h-6 w-6" aria-hidden />}
              title="No donors found"
              description="Try a different blood group or city. Or create an emergency request and we'll notify nearby donors."
              action={{
                label: "Request Blood",
                onClick: () => {
                  window.location.href = "/emergency-request";
                },
              }}
            />
          )}

          {!loading && !error && donors.length > 0 && (
            <div className="flex flex-col gap-3">
              {donors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          )}

          {/* Privacy note */}
          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <span className="mt-0.5 shrink-0 text-blue">
              <AlertCircle className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-xs leading-relaxed text-navy">
              <strong className="font-semibold">Important:</strong> Please
              respect the donor&apos;s time and privacy. Contact only for
              genuine blood requests. Misuse of information may result in
              account suspension.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-light via-background to-blue-light">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <span className="h-3 w-3 rounded-full bg-white" />
                </span>
                <p className="text-sm font-semibold text-navy">
                  Map view coming soon
                </p>
                <p className="text-xs text-text-secondary">
                  See donors near you on the map.
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
                  Donor location
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
                <AlertCircle className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-navy">
                Can&apos;t find a donor?
              </h3>
            </div>
            <p className="text-sm text-text-secondary">
              Create an emergency blood request. We&apos;ll notify nearby
              donors and NGOs immediately.
            </p>
            <Link href="/emergency-request" className="mt-4 block">
              <Button variant="primary" size="sm" className="w-full gap-2">
                Request Blood
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}