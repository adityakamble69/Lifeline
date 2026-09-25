"use client";

import * as React from "react";
import Link from "next/link";
import {
  Droplet,
  Heart,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Lock,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  BloodDonorCard,
  PersonalInfoForm,
  ProfileTabs,
  HealthInfoForm,
  PreferencesForm,
  EmergencyContactForm,
  DocumentsPanel,
} from "@/components/donor";
import { formatDonationDate, type MeProfile } from "@/lib/api";

const tabs = [
  { id: "personal", label: "Personal Information" },
  { id: "health", label: "Health Information" },
  { id: "preferences", label: "Preferences" },
  { id: "emergency", label: "Emergency Contact" },
  { id: "documents", label: "Documents" },
];

export function ProfileClient({
  initialProfile,
}: {
  initialProfile: MeProfile;
}) {
  const [profile, setProfile] = React.useState(initialProfile);
  const [activeTab, setActiveTab] = React.useState("personal");

  const donor = profile.donor;
  const memberSince = new Date(profile.user.created_at).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" },
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-light/50 via-background to-background p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary-light ring-4 ring-surface">
            <span className="flex h-full w-full items-center justify-center text-primary">
              <User className="h-10 w-10" aria-hidden />
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-navy">
                {profile.user.name}
              </h1>
              {donor && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-light px-2.5 py-1 text-xs font-semibold text-green">
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  Verified Donor
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              Blood Donor · Member since {memberSince}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
              {donor?.age && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {donor.age} years
                </span>
              )}
              {donor?.gender && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" aria-hidden />
                  {donor.gender}
                </span>
              )}
              {profile.user.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {profile.user.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {profile.user.email}
              </span>
              {donor?.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {donor.city}, {donor.state}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock
          icon={<Droplet className="h-5 w-5" aria-hidden />}
          label="Blood Group"
          value={donor?.blood_group ?? "—"}
          accent="primary"
        />
        <StatBlock
          icon={<Heart className="h-5 w-5" aria-hidden />}
          label="Total Donations"
          value={String(0)}
          accent="green"
        />
        <StatBlock
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          label="Last Donation"
          value={
            donor?.last_donation_date
              ? formatDonationDate(donor.last_donation_date)
              : "Not yet donated"
          }
          accent="blue"
        />
        <StatBlock
          icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
          label="Eligible to Donate"
          value={donor?.next_eligible_date ? "In 3 months" : "Available"}
          accent="orange"
        />
      </div>

      {/* Tabs */}
      <ProfileTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {activeTab === "personal" && (
            <PersonalInfoForm
              profile={profile}
              onSaved={(next) => setProfile(next)}
            />
          )}

          {activeTab === "health" && (
            <HealthInfoForm
              profile={profile}
              onSaved={(next) => setProfile(next)}
            />
          )}

          {activeTab === "preferences" && (
            <PreferencesForm
              profile={profile}
              onSaved={(next) => setProfile(next)}
            />
          )}

          {activeTab === "emergency" && (
            <EmergencyContactForm
              profile={profile}
              onSaved={(next) => setProfile(next)}
            />
          )}

          {activeTab === "documents" && <DocumentsPanel profile={profile} />}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {donor && (
            <BloodDonorCard
              name={profile.user.name}
              bloodGroup={donor.blood_group}
              donorId={profile.user.id}
              memberSince={memberSince}
            />
          )}

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-navy">
              Account Security
            </h3>
            <ul className="mt-3 flex flex-col gap-3">
              <li className="flex items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-text-secondary">
                    <Lock className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">Password</p>
                    <p className="text-[11px] text-text-secondary">
                      Managed securely by Clerk
                    </p>
                  </div>
                </div>
                <Badge tone="success">Active</Badge>
              </li>
              <li className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-text-secondary">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy">
                      Two-Factor Auth
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Badge tone="warning">Not Enabled</Badge>
              </li>
            </ul>
          </div>

          <Link href="/dashboard/profile" className="hidden" />
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "primary" | "green" | "blue" | "orange";
}) {
  const accents: Record<typeof accent, string> = {
    primary: "bg-primary-light text-primary",
    green: "bg-green-light text-green",
    blue: "bg-blue-light text-blue",
    orange: "bg-orange-light text-orange",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="truncate text-sm font-semibold text-navy">{value}</p>
      </div>
    </div>
  );
}