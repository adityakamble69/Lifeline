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
  Bell,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { CampRegistrationForm } from "./CampRegistrationForm";
import {
  getCampById,
  formatCampDateParts,
  formatCampTimeRange,
  type CampDetailResponse,
} from "@/lib/api";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1600&q=80",
];

function pickImage(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) | 0;
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

const statusMap: Record<
  string,
  { label: string; tone: BadgeTone; card: "upcoming" | "registration_open" | "completed" | "cancelled" }
> = {
  upcoming: { label: "Upcoming", tone: "success", card: "upcoming" },
  published: { label: "Upcoming", tone: "success", card: "upcoming" },
  open: { label: "Registration Open", tone: "info", card: "registration_open" },
  registration_open: { label: "Registration Open", tone: "info", card: "registration_open" },
  completed: { label: "Completed", tone: "neutral", card: "completed" },
  cancelled: { label: "Cancelled", tone: "error", card: "cancelled" },
};

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-5 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl sm:col-span-2" />
          </div>
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function CampDetail({ campId }: { campId: string }) {
  const [camp, setCamp] = React.useState<CampDetailResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notFound, setNotFound] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    const res = await getCampById(campId);

    if (!res.success) {
      if (res.error.code === "NOT_FOUND") {
        setNotFound(true);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
      return;
    }

    setCamp(res.data.camp);
    setLoading(false);
  }, [campId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <DetailSkeleton />;

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center shadow-[var(--shadow-card)]">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
            <AlertCircle className="h-8 w-8" aria-hidden />
          </span>
          <h1 className="text-2xl font-bold text-navy">Camp not found</h1>
          <p className="text-sm text-text-secondary">
            The camp you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
          <Link href="/camps" className="mt-3">
            <Button variant="primary" size="md" className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to all camps
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Couldn't load camp"
          description={error ?? "Unknown error"}
          onRetry={() => void load()}
        />
      </div>
    );
  }

  const status = statusMap[camp.status] ?? statusMap.upcoming;
  const capacityPercent = camp.capacity
    ? Math.min(100, Math.round((camp.registered / camp.capacity) * 100))
    : 0;
  const { day, month, dateLabel } = formatCampDateParts(camp.start_at);
  const timeLabel = formatCampTimeRange(camp.start_at, camp.end_at);
  const image = pickImage(camp.id);
  const canRegister =
    status.card !== "completed" && status.card !== "cancelled";

  return (
    <>
      {/* Back link */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/camps"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to all camps
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-br from-primary-light/60 via-background to-background">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={status.tone}>{status.label}</Badge>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary shadow-[var(--shadow-card)]">
                  All Blood Groups
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                {camp.title}
              </h1>

              <p className="mt-2 text-sm text-text-secondary">
                Organized by{" "}
                <span className="font-semibold text-navy">{camp.organizer}</span>
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Calendar className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Date
                    </p>
                    <p className="text-sm font-semibold text-navy">
                      {dateLabel}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Clock className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Time
                    </p>
                    <p className="text-sm font-semibold text-navy">
                      {timeLabel}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] sm:col-span-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Venue
                    </p>
                    <p className="text-sm font-semibold text-navy">
                      {camp.venue}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {camp.city}, {camp.state}
                    </p>
                  </div>
                </div>
              </div>

              {camp.description && (
                <div className="mt-6">
                  <h2 className="text-base font-semibold text-navy">
                    About this camp
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                    {camp.description}
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
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

            <div className="flex flex-col gap-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)]">
                <Image
                  src={image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-2xl bg-primary px-4 py-2 text-center text-white shadow-md">
                  <span className="block text-2xl font-bold leading-none">
                    {day}
                  </span>
                  <span className="block text-xs font-medium uppercase tracking-wide">
                    {month}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-surface p-4 text-center shadow-[var(--shadow-card)]">
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Droplet className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="mt-2 text-xs text-text-secondary">
                    Capacity
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {camp.capacity}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-4 text-center shadow-[var(--shadow-card)]">
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Building2 className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="mt-2 text-xs text-text-secondary">
                    Organized by
                  </p>
                  <p className="truncate text-sm font-semibold text-navy">
                    {camp.organizer}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary-light bg-primary-light/40 p-5">
                <h3 className="text-base font-semibold text-navy">
                  Why register?
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {[
                    "Helps in better organization",
                    "Reduced waiting time",
                    "You'll receive confirmation & reminders",
                    "Be a part of a noble cause",
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

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-background"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                Share this camp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          {canRegister ? (
            <CampRegistrationForm
              camp={{
                id: camp.id,
                title: camp.title,
                venue: `${camp.venue}, ${camp.city}`,
                date: dateLabel,
                time: timeLabel,
              }}
            />
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-light text-orange">
                <AlertCircle className="h-7 w-7" aria-hidden />
              </span>
              <h2 className="text-lg font-semibold text-navy">
                Registration closed
              </h2>
              <p className="text-sm text-text-secondary">
                This camp is no longer accepting registrations. Explore other
                upcoming camps near you.
              </p>
              <Link href="/camps" className="mt-3">
                <Button variant="primary" size="sm">
                  View other camps
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}