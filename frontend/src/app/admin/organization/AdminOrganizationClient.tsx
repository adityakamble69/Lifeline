"use client";

import * as React from "react";
import {
  Building2,
  Pencil,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  ClipboardList,
  Camera,
  ImageIcon,
  FileText,
} from "lucide-react";
import { Card, KpiCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormField, Input, Select, Textarea } from "@/components/ui/Input";
import {
  updateAdminOrganization,
  type AdminOrganizationResponse,
  type AdminOrganizationStats,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const ORG_TYPES = [
  "NGO",
  "Hospital",
  "Government",
  "Blood Bank",
  "Foundation",
  "Community Group",
  "Other",
];

const DEFAULT_STATS: AdminOrganizationStats = {
  total_camps: 0,
  total_registrations: 0,
  total_members: 0,
};

interface Props {
  token: string;
  initial: AdminOrganizationResponse;
}

export function AdminOrganizationClient({ token, initial }: Props) {
  const [data, setData] = React.useState<{
    organization: AdminOrganizationResponse["organization"];
    stats: AdminOrganizationStats;
  }>({
    organization: initial.organization,
    stats: initial.stats ?? DEFAULT_STATS,
  });

  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const org = data.organization;
  const stats = data.stats ?? DEFAULT_STATS;

  const [values, setValues] = React.useState({
    name: org.name,
    type: org.type,
    description: org.description ?? "",
    tagline: org.tagline ?? "",
    website: org.website ?? "",
    email: org.email,
    phone: org.phone ?? "",
    city: org.city,
    state: org.state,
    address: org.address ?? "",
    logo_url: org.logo_url ?? "",
    banner_url: org.banner_url ?? "",
  });

  const update = (key: keyof typeof values, value: string) =>
    setValues((p) => ({ ...p, [key]: value }));

  const reset = () => {
    setValues({
      name: org.name,
      type: org.type,
      description: org.description ?? "",
      tagline: org.tagline ?? "",
      website: org.website ?? "",
      email: org.email,
      phone: org.phone ?? "",
      city: org.city,
      state: org.state,
      address: org.address ?? "",
      logo_url: org.logo_url ?? "",
      banner_url: org.banner_url ?? "",
    });
    setEditing(false);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await updateAdminOrganization(token, values);
      if (!res.success) throw new Error(res.error.message);
      setData({
        organization: res.data.organization,
        stats: res.data.stats ?? DEFAULT_STATS,
      });
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Organization Profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              {editing ? (
                <>
                  Edit <span className="text-primary">Organization</span>
                </>
              ) : (
                <>
                  Your <span className="text-primary">Organization</span>
                </>
              )}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              {editing
                ? "Update your organization's public profile information."
                : "This is how your organization appears on the Lifeline platform."}
            </p>
          </div>
          {!editing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-2"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={reset}
                disabled={saving}
                className="gap-2"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={saving}
                onClick={save}
                className="gap-2"
              >
                <Save className="h-3.5 w-3.5" aria-hidden />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-light bg-green-light/40 p-3 text-xs text-green">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          Organization profile updated successfully.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          value={stats.total_camps ?? 0}
          label="Total Camps"
          accent="primary"
        />
        <KpiCard
          icon={<ClipboardList className="h-5 w-5" aria-hidden />}
          value={stats.total_registrations ?? 0}
          label="Total Registrations"
          accent="green"
        />
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={stats.total_members ?? 0}
          label="Team Members"
          accent="blue"
        />
      </section>

      {/* View mode */}
      {!editing && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main info */}
          <div className="flex flex-col gap-6">
            {/* Banner + Logo */}
            <Card className="!p-0 overflow-hidden">
              <div className="relative aspect-[16/5] bg-gradient-to-br from-primary-light to-primary-light/40">
                {org.banner_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={org.banner_url}
                    alt="Banner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon
                      className="h-12 w-12 text-primary/30"
                      aria-hidden
                    />
                  </div>
                )}
              </div>
              <div className="relative px-6 pb-6">
                <div className="-mt-12 flex items-end gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface ring-4 ring-surface shadow-[var(--shadow-card)]">
                    {org.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={org.logo_url}
                        alt="Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-light text-primary">
                        <Building2 className="h-10 w-10" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="mb-2 min-w-0 flex-1">
                    <h2 className="truncate text-xl font-bold text-navy">
                      {org.name}
                    </h2>
                    {org.tagline && (
                      <p className="mt-0.5 text-sm text-text-secondary">
                        {org.tagline}
                      </p>
                    )}
                  </div>
                  <Badge tone="success" className="mb-3">
                    {org.type}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* About */}
            {org.description && (
              <Card>
                <div className="mb-3 flex items-center gap-2">
                  <FileText
                    className="h-4 w-4 text-text-secondary"
                    aria-hidden
                  />
                  <h3 className="text-base font-semibold text-navy">About</h3>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {org.description}
                </p>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-text-secondary" aria-hidden />
                <h3 className="text-base font-semibold text-navy">
                  Contact Information
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={<Mail className="h-4 w-4" aria-hidden />}
                  label="Email"
                  value={org.email}
                />
                {org.phone && (
                  <InfoRow
                    icon={<Phone className="h-4 w-4" aria-hidden />}
                    label="Phone"
                    value={org.phone}
                  />
                )}
                {org.website && (
                  <InfoRow
                    icon={<Globe className="h-4 w-4" aria-hidden />}
                    label="Website"
                    value={org.website}
                    href={org.website}
                  />
                )}
                <InfoRow
                  icon={<MapPin className="h-4 w-4" aria-hidden />}
                  label="Location"
                  value={`${org.city}, ${org.state}`}
                />
                {org.address && (
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" aria-hidden />}
                    label="Address"
                    value={org.address}
                    className="sm:col-span-2"
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <Card>
              <h3 className="mb-3 text-base font-semibold text-navy">
                Organization Details
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                <DetailRow label="Type" value={org.type} />
                <DetailRow
                  label="Member Since"
                  value={new Date(org.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                />
                <DetailRow
                  label="Last Updated"
                  value={new Date(org.updated_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                />
              </ul>
            </Card>

            <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
              <Building2
                className="mt-0.5 h-4 w-4 shrink-0 text-blue"
                aria-hidden
              />
              <p className="text-[11px] leading-relaxed text-navy">
                This information is shown to donors on public camp pages and
                the organization directory.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Info */}
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Building2
                className="h-4 w-4 text-text-secondary"
                aria-hidden
              />
              <h3 className="text-base font-semibold text-navy">
                Basic Information
              </h3>
            </div>
            <div className="grid gap-4">
              <FormField label="Organization Name" htmlFor="o-name" required>
                <Input
                  id="o-name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Lifeline Blood Donor Network"
                />
              </FormField>

              <FormField label="Type" htmlFor="o-type" required>
                <Select
                  id="o-type"
                  value={values.type}
                  onChange={(e) => update("type", e.target.value)}
                >
                  {ORG_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Tagline"
                htmlFor="o-tagline"
                help="Short slogan or mission statement"
              >
                <Input
                  id="o-tagline"
                  value={values.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  placeholder="e.g. People • Communities • A Healthier Tomorrow"
                />
              </FormField>

              <FormField label="Description" htmlFor="o-desc">
                <Textarea
                  id="o-desc"
                  value={values.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Tell people about your organization's mission..."
                  rows={5}
                />
              </FormField>
            </div>
          </Card>

          {/* Contact & Location */}
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-text-secondary" aria-hidden />
              <h3 className="text-base font-semibold text-navy">
                Contact & Location
              </h3>
            </div>
            <div className="grid gap-4">
              <FormField label="Email" htmlFor="o-email" required>
                <Input
                  id="o-email"
                  type="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="contact@org.org"
                />
              </FormField>

              <FormField label="Phone" htmlFor="o-phone">
                <Input
                  id="o-phone"
                  type="tel"
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </FormField>

              <FormField
                label="Website"
                htmlFor="o-website"
                help="Full URL including https://"
              >
                <Input
                  id="o-website"
                  type="url"
                  value={values.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://yourorg.org"
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="City" htmlFor="o-city" required>
                  <Input
                    id="o-city"
                    value={values.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </FormField>

                <FormField label="State" htmlFor="o-state" required>
                  <Input
                    id="o-state"
                    value={values.state}
                    onChange={(e) => update("state", e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Full Address" htmlFor="o-address">
                <Textarea
                  id="o-address"
                  value={values.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Street address with PIN code"
                  rows={3}
                />
              </FormField>
            </div>
          </Card>

          {/* Media */}
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-text-secondary" aria-hidden />
              <h3 className="text-base font-semibold text-navy">
                Logo & Banner
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Logo URL"
                htmlFor="o-logo"
                help="Square image, minimum 200×200px"
              >
                <Input
                  id="o-logo"
                  type="url"
                  value={values.logo_url}
                  onChange={(e) => update("logo_url", e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </FormField>

              <FormField
                label="Banner URL"
                htmlFor="o-banner"
                help="Wide image, minimum 1200×400px"
              >
                <Input
                  id="o-banner"
                  type="url"
                  value={values.banner_url}
                  onChange={(e) => update("banner_url", e.target.value)}
                  placeholder="https://example.com/banner.png"
                />
              </FormField>
            </div>

            {/* Preview */}
            {(values.logo_url || values.banner_url) && (
              <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Live Preview
                </p>
                <div className="overflow-hidden rounded-xl">
                  <div className="relative aspect-[16/5] bg-gradient-to-br from-primary-light to-primary-light/40">
                    {values.banner_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={values.banner_url}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="bg-surface px-4 py-3">
                    <div className="-mt-8 flex items-end gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface ring-4 ring-surface">
                        {values.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={values.logo_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary-light text-primary">
                            <Building2 className="h-6 w-6" aria-hidden />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 pb-1">
                        <p className="truncate text-sm font-semibold text-navy">
                          {values.name || "Organization Name"}
                        </p>
                        {values.tagline && (
                          <p className="truncate text-xs text-text-secondary">
                            {values.tagline}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  href,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3", className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 block truncate text-sm font-medium text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 text-sm font-medium text-navy">{value}</p>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-text-secondary">{label}</span>
      <span className="text-right text-sm font-semibold text-navy">
        {value}
      </span>
    </li>
  );
}