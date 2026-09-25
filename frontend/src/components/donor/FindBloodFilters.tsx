"use client";

import * as React from "react";
import { Search, MapPin, Navigation, Droplet, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const bloodGroups = ["Any", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export interface FindBloodFiltersState {
  bloodGroup: string;
  city: string;
  radius: string;
  availability: string;
}

interface Props {
  onSearch: (filters: FindBloodFiltersState) => void;
}

export function FindBloodFilters({ onSearch }: Props) {
  const [filters, setFilters] = React.useState<FindBloodFiltersState>({
    bloodGroup: "O+",
    city: "Nagpur",
    radius: "25 km",
    availability: "Available Now",
  });

  const update = (key: keyof FindBloodFiltersState, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const reset = () =>
    setFilters({
      bloodGroup: "Any",
      city: "Nagpur",
      radius: "25 km",
      availability: "Available Now",
    });

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      {/* Filter row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood Group */}
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
              onChange={(e) => update("bloodGroup", e.target.value)}
              className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {bloodGroups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </label>

        {/* Location */}
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
              onChange={(e) => update("city", e.target.value)}
              placeholder="City or area"
              className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </label>

        {/* Radius */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Radius
          </span>
          <div className="relative">
            <Navigation
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
              aria-hidden
            />
            <select
              suppressHydrationWarning
              value={filters.radius}
              onChange={(e) => update("radius", e.target.value)}
              className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>5 km</option>
              <option>10 km</option>
              <option>25 km</option>
              <option>50 km</option>
              <option>100 km</option>
            </select>
          </div>
        </label>

        {/* Availability */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Availability
          </span>
          <select
            suppressHydrationWarning
            value={filters.availability}
            onChange={(e) => update("availability", e.target.value)}
            className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface px-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option>Available Now</option>
            <option>Available in 2 days</option>
            <option>Any</option>
          </select>
        </label>
      </div>

      {/* Blood group pills + actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
        {bloodGroups.map((g) => {
          const active = filters.bloodGroup === g;
          return (
            <button
              key={g}
              suppressHydrationWarning
              type="button"
              onClick={() => update("bloodGroup", g)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-navy hover:border-primary hover:text-primary",
              )}
            >
              {g}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          <button
            suppressHydrationWarning
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </button>
          <Button
            variant="primary"
            size="sm"
            className="gap-2"
            onClick={() => onSearch(filters)}
          >
            <Search className="h-4 w-4" aria-hidden />
            Search Donors
          </Button>
        </div>
      </div>
    </div>
  );
}