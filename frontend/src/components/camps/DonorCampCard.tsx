import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface DonorCampCardData {
  id: string;
  title: string;
  organizer: string;
  date: string;
  day: string;
  month: string;
  venue: string;
  time: string;
  description: string;
  capacity: string;
  tags: string[];
  status: "upcoming" | "registration_open" | "completed" | "cancelled";
  image: string;
  isRegistered: boolean;
}

const statusMap: Record<
  DonorCampCardData["status"],
  { label: string; tone: BadgeTone }
> = {
  upcoming: { label: "Upcoming", tone: "success" },
  registration_open: { label: "Registration Open", tone: "info" },
  completed: { label: "Completed", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "error" },
};

export function DonorCampCard({ camp }: { camp: DonorCampCardData }) {
  const status = statusMap[camp.status];

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex flex-col sm:flex-row">
        {/* Image + date badge */}
        <div className="relative aspect-[16/9] w-full shrink-0 bg-background sm:aspect-auto sm:h-auto sm:w-[220px]">
          <Image
            src={camp.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 220px"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 rounded-xl bg-primary px-3 py-1.5 text-center text-white shadow-md">
            <span className="block text-lg font-bold leading-none">
              {camp.day}
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wide">
              {camp.month}
            </span>
          </span>
          {camp.isRegistered && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-light px-2.5 py-1 text-[10px] font-bold text-green">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              Registered
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-navy">
                {camp.title}
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Organized by {camp.organizer}
              </p>
            </div>
            <button
              suppressHydrationWarning
              type="button"
              aria-label="Save camp"
              className="shrink-0 rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-primary"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-text-secondary sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{camp.venue}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {camp.time}
            </p>
            <p className="flex items-center gap-2 sm:col-span-2">
              <Users className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {camp.capacity}
            </p>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-text-secondary">
            {camp.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {camp.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Badge tone={status.tone}>{status.label}</Badge>
            {camp.isRegistered ? (
              <Link href={`/dashboard/camps/${camp.id}`}>
                <Button variant="secondary" size="sm" className="gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green" aria-hidden />
                  View Registration
                </Button>
              </Link>
            ) : (
              <Link href={`/dashboard/camps/${camp.id}`}>
                <Button variant="primary" size="sm" className="gap-2">
                  Register
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}