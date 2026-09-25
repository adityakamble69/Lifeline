"use client";

import * as React from "react";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { MeProfile } from "@/lib/api";

interface Props {
  profile: MeProfile;
}

export function DocumentsPanel({ profile }: Props) {
  const donor = profile.donor;
  const hasId = Boolean(donor?.id_document_url);
  const hasMedical = Boolean(donor?.medical_certificate_url);

  const uploadedAt = donor?.documents_uploaded_at
    ? new Date(donor.documents_uploaded_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Header card */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Shield className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-navy">
              Identity & Documents
            </h2>
            <p className="text-xs text-text-secondary">
              Upload your ID proof and medical certificates. These are securely
              stored and only visible to our verification team.
            </p>
          </div>
        </div>

        {uploadedAt && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-light bg-green-light/40 p-3 text-xs text-green">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            Documents uploaded on {uploadedAt}
          </div>
        )}
      </div>

      {/* Upload cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <UploadCard
          title="ID Proof"
          description="Aadhaar, PAN, Driving License, or Passport"
          uploaded={hasId}
          required
        />
        <UploadCard
          title="Medical Certificate"
          description="Recent health certificate (optional)"
          uploaded={hasMedical}
        />
      </div>

      {/* Info */}
      <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
        <div className="text-xs leading-relaxed text-navy">
          <p className="font-semibold">Why upload documents?</p>
          <ul className="mt-2 space-y-1">
            <li>• Speeds up donor approval process</li>
            <li>• Builds trust with requesters</li>
            <li>• Required for verified donor badge</li>
          </ul>
        </div>
      </div>

      {/* Feature coming soon */}
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Upload className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="text-base font-semibold text-navy">
          Secure Upload Coming Soon
        </h3>
        <p className="max-w-sm text-sm text-text-secondary">
          Document upload with encryption is being finalized. We&apos;ll notify
          you when it&apos;s available.
        </p>
        <Badge tone="info">
          <Clock className="h-3 w-3" aria-hidden />
          Phase 4 — Coming Soon
        </Badge>
      </div>
    </div>
  );
}

function UploadCard({
  title,
  description,
  uploaded,
  required,
}: {
  title: string;
  description: string;
  uploaded: boolean;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy">
              {title}
              {required && <span className="text-primary"> *</span>}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">
              {description}
            </p>
          </div>
        </div>
        {uploaded ? (
          <Badge tone="success">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Uploaded
          </Badge>
        ) : (
          <Badge tone="warning">
            <Clock className="h-3 w-3" aria-hidden />
            Pending
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
        <div>
          <Upload className="mx-auto h-5 w-5 text-text-secondary" aria-hidden />
          <p className="mt-2 text-xs text-text-secondary">
            {uploaded ? "Replace file" : "Upload file"}
          </p>
          <p className="mt-0.5 text-[10px] text-text-secondary">
            PDF, JPG, PNG · Max 5 MB
          </p>
        </div>
      </div>

      <Button variant="secondary" size="sm" className="w-full" disabled>
        <Upload className="h-3.5 w-3.5" aria-hidden />
        {uploaded ? "Replace" : "Upload"}
      </Button>
    </div>
  );
}