import { MapPin, Clock, Phone, Droplet } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface EmergencyRequestData {
  id: string;
  patientName: string;
  patientInitials: string;
  age?: number;
  gender?: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  city: string;
  urgency: "critical" | "high" | "moderate" | "normal";
  hoursLeft: number | null;
  requestedAgo: string;
  description: string;
}

const urgencyMeta: Record<
  EmergencyRequestData["urgency"],
  { label: string; tone: BadgeTone; accent: string }
> = {
  critical: {
    label: "Critical",
    tone: "error",
    accent: "bg-primary-light text-primary",
  },
  high: {
    label: "High",
    tone: "warning",
    accent: "bg-orange-light text-orange",
  },
  moderate: {
    label: "Moderate",
    tone: "info",
    accent: "bg-blue-light text-blue",
  },
  normal: {
    label: "Normal",
    tone: "neutral",
    accent: "bg-background text-text-secondary",
  },
};

export function EmergencyRequestCard({
  request,
}: {
  request: EmergencyRequestData;
}) {
  const meta = urgencyMeta[request.urgency];

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {/* Avatar with initials */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
          <span
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold",
              meta.accent,
            )}
            aria-hidden
          >
            {request.patientInitials}
          </span>
          <Badge tone={meta.tone}>{meta.label}</Badge>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-navy">
                {request.patientName}
                {request.age && request.gender && (
                  <span className="ml-2 text-sm font-normal text-text-secondary">
                    {request.age} years · {request.gender}
                  </span>
                )}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold">
                    {request.bloodGroup}
                  </span>
                  {request.bloodGroup} · {request.unitsRequired} Unit
                  {request.unitsRequired === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {request.hoursLeft !== null
                  ? `Needed in ${request.hoursLeft}h`
                  : request.requestedAgo}
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-text-secondary sm:grid-cols-2">
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{request.hospitalName}</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <Droplet className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {request.city}
            </p>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-text-secondary">
            {request.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" aria-hidden />
              I Can Help
            </Button>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
            <span className="ml-auto text-[11px] text-text-secondary">
              {request.requestedAgo}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}