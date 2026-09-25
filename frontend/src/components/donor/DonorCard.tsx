import Image from "next/image";
import { MapPin, Calendar, CheckCircle2, Phone, User } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface DonorCardData {
  id: string;
  name: string;
  age: number | null;
  bloodGroup: string;
  city: string;
  distance?: string; // optional — not available from real API yet
  lastDonation: string;
  availability: "available" | "busy" | "cooldown";
  verified?: boolean;
  image?: string;
}

const availabilityMap: Record<
  DonorCardData["availability"],
  { label: string; tone: BadgeTone }
> = {
  available: { label: "Available Now", tone: "success" },
  busy: { label: "Busy", tone: "warning" },
  cooldown: { label: "On Cooldown", tone: "neutral" },
};

export function DonorCard({ donor }: { donor: DonorCardData }) {
  const status = availabilityMap[donor.availability];

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)] sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      {/* Avatar */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary-light">
        {donor.image ? (
          <Image
            src={donor.image}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-primary">
            <User className="h-6 w-6" aria-hidden />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-navy">{donor.name}</h3>
          {donor.verified && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold text-green"
              title="Verified donor"
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Verified
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold">
              {donor.bloodGroup}
            </span>
            {donor.bloodGroup}
          </span>
          {donor.age != null && (
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" aria-hidden />
              {donor.age} years
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {donor.city}
            {donor.distance && ` · ${donor.distance}`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Last donated {donor.lastDonation}
          </span>
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
        <Badge tone={status.tone}>{status.label}</Badge>
        <Button variant="primary" size="sm" className="gap-1.5">
          <Phone className="h-3.5 w-3.5" aria-hidden />
          Contact
        </Button>
      </div>
    </article>
  );
}