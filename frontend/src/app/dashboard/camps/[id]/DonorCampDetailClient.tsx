"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Building2,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Droplet,
  Heart,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CampRegistrationForm } from "@/components/camps/CampRegistrationForm";
import { cn } from "@/lib/utils";

export interface DonorCampDetailData {
  id: string;
  title: string;
  organizer: string;
  date: string;
  day: string;
  month: string;
  venue: string;
  address: string;
  time: string;
  description: string;
  capacity: number;
  registered: number;
  status: string;
  image: string;
}

const statusMap: Record<
  string,
  { label: string; tone: BadgeTone; card: string }
> = {
  upcoming: { label: "Upcoming", tone: "success", card: "upcoming" },
  published: { label: "Upcoming", tone: "success", card: "upcoming" },
  open: { label: "Registration Open", tone: "info", card: "registration_open" },
  registration_open: {
    label: "Registration Open",
    tone: "info",
    card: "registration_open",
  },
  completed: { label: "Completed", tone: "neutral", card: "completed" },
  cancelled: { label: "Cancelled", tone: "error", card: "cancelled" },
};

interface Props {
  camp: DonorCampDetailData;
  isRegistered: boolean;
}

export function DonorCampDetailClient({ camp, isRegistered }: Props) {
  const status = statusMap[camp.status] ?? statusMap.upcoming;
  const capacityPercent = camp.capacity
    ? Math.min(100, Math.round((camp.registered / camp.capacity) * 100))
    : 0;

  const canRegister =
    !isRegistered &&
    status.card !== "completed" &&
    status.card !== "cancelled";

  return (
    <>
      {/* Back link */}
      <div className="mb-4">
        <Link
          href="/dashboard/camps"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all camps
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={status.tone}>{status.label}</Badge>
            {isRegistered && (
              <Badge tone="success">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                You&apos;re Registered
              </Badge>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-navy sm:text-4xl">
            {camp.title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Organized by{" "}
            <span className="font-semibold text-navy">{camp.organizer}</span>
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailRow
              icon={<Calendar className="h-4 w-4" aria-hidden />}
              label="Date"
              value={camp.date}
            />
            <DetailRow
              icon={<Clock className="h-4 w-4" aria-hidden />}
              label="Time"
              value={camp.time}
            />
            <DetailRow
              icon={<MapPin className="h-4 w-4" aria-hidden />}
              label="Venue"
              value={`${camp.venue}, ${camp.address}`}
              className="sm:col-span-2"
            />
          </div>

          {camp.description && (
            <div className="mt-5">
              <h2 className="text-base font-semibold text-navy">
                About this camp
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {camp.description}
              </p>
            </div>
          )}

          {/* Capacity */}
          <div className="mt-5 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Users className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {camp.registered} / {camp.capacity} registered
                  </p>
                  <p className="text-xs text-text-secondary">
                    {capacityPercent}% of capacity filled
                  </p>
                </div>
              </div>
              <Badge
                tone={
                  capacityPercent >= 90
                    ? "error"
                    : capacityPercent >= 70
                      ? "warning"
                      : "success"
                }
              >
                {capacityPercent >= 90
                  ? "Almost Full"
                  : capacityPercent >= 70
                    ? "Filling Fast"
                    : "Open"}
              </Badge>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right column: image + stats */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)]">
            <Image
              src={camp.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-2xl bg-primary px-4 py-2 text-center text-white shadow-md">
              <span className="block text-2xl font-bold leading-none">
                {camp.day}
              </span>
              <span className="block text-xs font-medium uppercase tracking-wide">
                {camp.month}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              icon={<Droplet className="h-4 w-4" aria-hidden />}
              label="Capacity"
              value={String(camp.capacity)}
            />
            <MiniStat
              icon={<Building2 className="h-4 w-4" aria-hidden />}
              label="Organizer"
              value={camp.organizer}
            />
          </div>
        </div>
      </div>

      {/* Registration section */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-light/40 via-background to-background p-6 sm:p-8">
        {isRegistered ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-light text-green">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold text-navy">
              You&apos;re all set for this camp!
            </h2>
            <p className="max-w-md text-sm text-text-secondary">
              Your registration is confirmed for{" "}
              <span className="font-semibold text-navy">{camp.title}</span> on{" "}
              {camp.date}. We&apos;ll send you a reminder before the camp.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/camps">
                <Button variant="secondary" size="sm">
                  Browse Other Camps
                </Button>
              </Link>
              <Link href="/dashboard/donations">
                <Button variant="primary" size="sm" className="gap-2">
                  <Heart className="h-3.5 w-3.5" aria-hidden />
                  View My Donations
                </Button>
              </Link>
            </div>
          </div>
        ) : canRegister ? (
          <CampRegistrationForm
            camp={{
              id: camp.id,
              title: camp.title,
              venue: `${camp.venue}, ${camp.address}`,
              date: camp.date,
              time: camp.time,
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-light text-orange">
              <AlertCircle className="h-7 w-7" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold text-navy">
              Registration closed
            </h2>
            <p className="max-w-md text-sm text-text-secondary">
              This camp is no longer accepting registrations. Explore other
              upcoming camps near you.
            </p>
            <Link href="/dashboard/camps" className="mt-3">
              <Button variant="primary" size="sm">
                View Other Camps
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Share */}
      <div className="mt-6 flex justify-center">
        <button
          suppressHydrationWarning
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-[10px] border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-navy",
            "transition-colors hover:bg-background",
          )}
        >
          <Share2 className="h-4 w-4" aria-hidden />
          Share this camp
        </button>
      </div>
    </>
  );
}

function DetailRow({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </p>
        <p className="text-sm font-semibold text-navy">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-center shadow-[var(--shadow-card)]">
      <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </span>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-navy">
        {value}
      </p>
    </div>
  );
}