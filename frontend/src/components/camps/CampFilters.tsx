"use client";

import * as React from "react";
import { MapPin, Calendar, Droplet, Building2, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CampFiltersState {
  location: string;
  date: string;
  bloodGroup: string;
  organizer: string;
}

const dateOptions = ["Any Date", "Today", "This Week", "This Month"];
const bloodGroups = ["All Blood Groups", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const organizers = ["All Organizers", "Lifeline", "Red Cross", "NMC", "Government"];

interface Props {
  onSearch: (filters: CampFiltersState) => void;
}

export function CampFilters({ onSearch }: Props) {
  const [filters, setFilters] = React.useState<CampFiltersState>({
    location: "Nagpur, Maharashtra",
    date: "Any Date",
    bloodGroup: "All Blood Groups",
    organizer: "All Organizers",
  });

  const update = (key: keyof CampFiltersState, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const reset = () =>
    setFilters({
      location: "Nagpur, Maharashtra",
      date: "Any Date",
      bloodGroup: "All Blood Groups",
      organizer: "All Organizers",
    });

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Location
          </span>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City or area"
              className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Date
          </span>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden />
            <select
              value={filters.date}
              onChange={(e) => update("date", e.target.value)}
              className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {dateOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Blood Group
          </span>
          <div className="relative">
            <Droplet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden />
            <select
              value={filters.bloodGroup}
              onChange={(e) => update("bloodGroup", e.target.value)}
              className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {bloodGroups.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Organized By
          </span>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden />
            <select
              value={filters.organizer}
              onChange={(e) => update("organizer", e.target.value)}
              className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {organizers.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset Filters
        </button>
        <Button
          variant="primary"
          size="sm"
          className="gap-2"
          onClick={() => onSearch(filters)}
        >
          <Search className="h-4 w-4" aria-hidden />
          Search Camps
        </Button>
      </div>
    </div>
  );
}