"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Globe,
  Database,
  Users,
  Plug,
  ChevronRight,
  Lock,
  Mail,
  Smartphone,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Building2,
  User,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FormField, Input, Select } from "@/components/ui/Input";
import { updateMyUser, type MeProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

type SectionId =
  | "general"
  | "security"
  | "notifications"
  | "privacy"
  | "team"
  | "integrations";

const LANGUAGES = [
  { id: "en", label: "English (India)" },
  { id: "hi", label: "हिन्दी" },
  { id: "mr", label: "मराठी" },
];

interface Props {
  token: string;
  profile: MeProfile;
}

export function AdminSettingsClient({ profile }: Props) {
  const { getToken } = useAuth();
  const { openUserProfile } = useClerk();

  const [activeSection, setActiveSection] =
    React.useState<SectionId>("general");

  const SECTIONS: {
    id: SectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Data & Privacy", icon: Database },
    { id: "team", label: "Team & Permissions", icon: Users },
    { id: "integrations", label: "Integrations", icon: Plug },
  ];

  // ── General settings ────────────────────────────────────────────────
  const [general, setGeneral] = React.useState({
    name: profile.user.name,
    phone: profile.user.phone ?? "",
  });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const saveGeneral = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error("Not signed in.");
      const res = await updateMyUser(clerkToken, {
        name: general.name,
        phone: general.phone || null,
      });
      if (!res.success) throw new Error(res.error.message);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  // ── Notification toggles ────────────────────────────────────────────
  const [notifs, setNotifs] = React.useState({
    donor_approvals: true,
    new_requests: true,
    camp_updates: true,
    team_activity: true,
    system_updates: false,
    email: true,
    sms: false,
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("lifeline.admin.notifs");
      if (stored) setNotifs(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const updateNotif = (key: keyof typeof notifs, value: boolean) => {
    const next = { ...notifs, [key]: value };
    setNotifs(next);
    try {
      localStorage.setItem("lifeline.admin.notifs", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // ── Language (local only) ──────────────────────────────────────────
  const [language, setLanguage] = React.useState("en");

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("lifeline.admin.language");
      if (stored) setLanguage(stored);
    } catch {
      // ignore
    }
  }, []);

  const updateLanguage = (l: string) => {
    setLanguage(l);
    try {
      localStorage.setItem("lifeline.admin.language", l);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Manage Your{" "}
              <span className="text-primary">Preferences</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Customize your organization settings, security preferences,
              notifications and more.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;Together
              <br />
              We Can
              <br />
              Save Lives&rdquo;
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Left nav */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="!p-2">
            <ul className="flex flex-col gap-1">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const active = activeSection === s.id;
                return (
                  <li key={s.id}>
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => setActiveSection(s.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-light text-primary"
                          : "text-navy hover:bg-background",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="flex-1 truncate">{s.label}</span>
                      {active && (
                        <ChevronRight
                          className="h-3.5 w-3.5 text-primary"
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </aside>

        {/* Content */}
        <div className="flex flex-col gap-6">
          {/* GENERAL */}
          {activeSection === "general" && (
            <>
              <Card>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <User
                      className="h-4 w-4 text-text-secondary"
                      aria-hidden
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-navy">
                        Account Information
                      </h2>
                      <p className="text-xs text-text-secondary">
                        Update your personal account details.
                      </p>
                    </div>
                  </div>
                  {saved && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Saved
                    </span>
                  )}
                </div>

                {saveError && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                    {saveError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Full Name" htmlFor="s-name">
                    <Input
                      id="s-name"
                      value={general.name}
                      onChange={(e) =>
                        setGeneral({ ...general, name: e.target.value })
                      }
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    htmlFor="s-email"
                    help="Managed by Clerk — click avatar to change"
                  >
                    <Input
                      id="s-email"
                      value={profile.user.email}
                      disabled
                    />
                  </FormField>

                  <FormField label="Phone Number" htmlFor="s-phone">
                    <Input
                      id="s-phone"
                      type="tel"
                      value={general.phone}
                      onChange={(e) =>
                        setGeneral({ ...general, phone: e.target.value })
                      }
                    />
                  </FormField>

                  <FormField label="Role" htmlFor="s-role">
                    <Input
                      id="s-role"
                      value="Organizer / Admin"
                      disabled
                    />
                  </FormField>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    loading={saving}
                    onClick={saveGeneral}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" aria-hidden />
                    Save Changes
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-text-secondary" aria-hidden />
                  <div>
                    <h2 className="text-lg font-semibold text-navy">
                      Language
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Choose your preferred language.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {LANGUAGES.map((l) => {
                    const active = language === l.id;
                    return (
                      <button
                        key={l.id}
                        suppressHydrationWarning
                        type="button"
                        onClick={() => updateLanguage(l.id)}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                          active
                            ? "border-primary bg-primary-light/30"
                            : "border-border bg-surface hover:border-primary/40",
                        )}
                      >
                        <span className="text-sm font-semibold text-navy">
                          {l.label}
                        </span>
                        {active && (
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-5 text-[11px] text-text-secondary">
                  Language preference is saved locally. Full site
                  translation coming soon.
                </p>
              </Card>

              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Building2
                    className="h-4 w-4 text-text-secondary"
                    aria-hidden
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-navy">
                      Organization Settings
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Manage organization name, tagline, and public profile.
                    </p>
                  </div>
                </div>
                <Link href="/admin/organization">
                  <Button variant="secondary" size="md" className="gap-2">
                    <Building2 className="h-4 w-4" aria-hidden />
                    Go to Organization Profile
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </Link>
              </Card>
            </>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-text-secondary" aria-hidden />
                <div>
                  <h2 className="text-lg font-semibold text-navy">
                    Security Settings
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Keep your account safe and secure.
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2">
                <SecurityRow
                  icon={<Lock className="h-4 w-4" aria-hidden />}
                  label="Password"
                  description="Managed securely by Clerk"
                  badge="Active"
                  badgeTone="success"
                  onClick={() => openUserProfile()}
                />
                <SecurityRow
                  icon={<Shield className="h-4 w-4" aria-hidden />}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security"
                  badge="Not Enabled"
                  badgeTone="warning"
                  onClick={() => openUserProfile()}
                />
                <SecurityRow
                  icon={<Bell className="h-4 w-4" aria-hidden />}
                  label="Login Notifications"
                  description="Get notified on new sign-ins"
                  badge="Enabled"
                  badgeTone="success"
                  onClick={() => openUserProfile()}
                />
                <SecurityRow
                  icon={<Smartphone className="h-4 w-4" aria-hidden />}
                  label="Active Sessions"
                  description="Manage and revoke active sessions"
                  onClick={() => openUserProfile()}
                />
              </ul>
            </Card>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 text-text-secondary" aria-hidden />
                <div>
                  <h2 className="text-lg font-semibold text-navy">
                    Notification Settings
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Choose what notifications you want to receive.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  In-App Notifications
                </p>
                <ul className="flex flex-col gap-1">
                  <NotifRow
                    icon={<Shield className="h-4 w-4" aria-hidden />}
                    accent="bg-orange-light text-orange"
                    label="Donor Approvals"
                    description="Get notified when new donors submit applications."
                    checked={notifs.donor_approvals}
                    onChange={(v) => updateNotif("donor_approvals", v)}
                  />
                  <NotifRow
                    icon={<AlertCircle className="h-4 w-4" aria-hidden />}
                    accent="bg-primary-light text-primary"
                    label="New Blood Requests"
                    description="Get notified about new emergency requests."
                    checked={notifs.new_requests}
                    onChange={(v) => updateNotif("new_requests", v)}
                  />
                  <NotifRow
                    icon={<Bell className="h-4 w-4" aria-hidden />}
                    accent="bg-blue-light text-blue"
                    label="Camp Updates"
                    description="Updates about upcoming camps and events."
                    checked={notifs.camp_updates}
                    onChange={(v) => updateNotif("camp_updates", v)}
                  />
                  <NotifRow
                    icon={<Users className="h-4 w-4" aria-hidden />}
                    accent="bg-purple-light text-purple"
                    label="Team Activity"
                    description="New team members, role changes, etc."
                    checked={notifs.team_activity}
                    onChange={(v) => updateNotif("team_activity", v)}
                  />
                  <NotifRow
                    icon={<SettingsIcon className="h-4 w-4" aria-hidden />}
                    accent="bg-background text-text-secondary"
                    label="System Announcements"
                    description="Important platform updates and news."
                    checked={notifs.system_updates}
                    onChange={(v) => updateNotif("system_updates", v)}
                  />
                </ul>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  External Channels
                </p>
                <ul className="flex flex-col gap-1">
                  <NotifRow
                    icon={<Mail className="h-4 w-4" aria-hidden />}
                    accent="bg-blue-light text-blue"
                    label="Email Notifications"
                    description="Receive notifications via email."
                    checked={notifs.email}
                    onChange={(v) => updateNotif("email", v)}
                  />
                  <NotifRow
                    icon={<Smartphone className="h-4 w-4" aria-hidden />}
                    accent="bg-green-light text-green"
                    label="SMS Notifications"
                    description="Receive important alerts via SMS."
                    checked={notifs.sms}
                    onChange={(v) => updateNotif("sms", v)}
                  />
                </ul>
              </div>

              <p className="mt-5 text-[11px] text-text-secondary">
                Changes are saved automatically.
              </p>
            </Card>
          )}

          {/* DATA & PRIVACY */}
          {activeSection === "privacy" && (
            <>
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Database
                    className="h-4 w-4 text-text-secondary"
                    aria-hidden
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-navy">
                      Data & Privacy
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Control your data and privacy settings.
                    </p>
                  </div>
                </div>

                <ul className="flex flex-col gap-2">
                  <PrivacyRow
                    icon={<FileText className="h-4 w-4" aria-hidden />}
                    label="Export Your Data"
                    description="Download a copy of your data in CSV or JSON."
                    badge="Available"
                    badgeTone="success"
                    href="/admin/export"
                  />
                  <PrivacyRow
                    icon={<Shield className="h-4 w-4" aria-hidden />}
                    label="Privacy Policy"
                    description="Read how we handle your data."
                    href="/privacy"
                  />
                  <PrivacyRow
                    icon={<FileText className="h-4 w-4" aria-hidden />}
                    label="Terms of Service"
                    description="Read our terms and conditions."
                    href="/terms"
                  />
                </ul>
              </Card>

              <Card className="!border-primary-light">
                <div className="mb-4 flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-primary" aria-hidden />
                  <h2 className="text-lg font-semibold text-primary">
                    Danger Zone
                  </h2>
                </div>
                <p className="text-sm text-text-secondary">
                  Permanently delete your account and all associated data.
                  This action cannot be undone. For organization-wide
                  deletion, please contact support.
                </p>
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openUserProfile()}
                    className="gap-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Delete Account
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* TEAM & PERMISSIONS */}
          {activeSection === "team" && (
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-text-secondary" aria-hidden />
                <div>
                  <h2 className="text-lg font-semibold text-navy">
                    Team & Permissions
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Manage roles and access for your organization.
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                <RoleInfoRow
                  role="Owner"
                  description="Full access including billing and ownership transfer."
                  tone="error"
                />
                <RoleInfoRow
                  role="Admin"
                  description="Full access to camps, donors, requests, and settings."
                  tone="primary"
                />
                <RoleInfoRow
                  role="Core Team"
                  description="Can manage day-to-day operations but limited settings access."
                  tone="info"
                />
                <RoleInfoRow
                  role="Volunteer"
                  description="Assigned to specific camps, limited dashboard access."
                  tone="purple"
                />
              </ul>

              <div className="mt-5 border-t border-border pt-5">
                <Link href="/admin/team">
                  <Button variant="primary" size="md" className="gap-2">
                    <Users className="h-4 w-4" aria-hidden />
                    Manage Team Members
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* INTEGRATIONS */}
          {activeSection === "integrations" && (
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Plug className="h-4 w-4 text-text-secondary" aria-hidden />
                <div>
                  <h2 className="text-lg font-semibold text-navy">
                    Integrations
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Connected services and APIs.
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                <IntegrationRow
                  icon={<Shield className="h-4 w-4" aria-hidden />}
                  accent="bg-primary-light text-primary"
                  name="Clerk"
                  description="Authentication & user management"
                  status="Connected"
                  tone="success"
                />
                <IntegrationRow
                  icon={<Database className="h-4 w-4" aria-hidden />}
                  accent="bg-green-light text-green"
                  name="Supabase"
                  description="PostgreSQL database & storage"
                  status="Connected"
                  tone="success"
                />
                <IntegrationRow
                  icon={<Mail className="h-4 w-4" aria-hidden />}
                  accent="bg-blue-light text-blue"
                  name="Email Provider"
                  description="Transactional emails"
                  status="Not configured"
                  tone="warning"
                />
                <IntegrationRow
                  icon={<Smartphone className="h-4 w-4" aria-hidden />}
                  accent="bg-orange-light text-orange"
                  name="SMS Provider"
                  description="OTP and emergency alerts"
                  status="Not configured"
                  tone="warning"
                />
              </ul>

              <p className="mt-5 text-[11px] text-text-secondary">
                More integrations coming soon. Contact support if you need a
                specific service.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ──────────────────────────────────────────────────────
function SecurityRow({
  icon,
  label,
  description,
  badge,
  badgeTone,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: string;
  badgeTone?: "success" | "warning" | "error" | "info" | "neutral";
  onClick?: () => void;
}) {
  return (
    <li>
      <button
        suppressHydrationWarning
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-background"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-text-secondary">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-navy">{label}</p>
          <p className="text-[11px] text-text-secondary">{description}</p>
        </div>
        {badge && badgeTone ? (
          <Badge tone={badgeTone}>{badge}</Badge>
        ) : (
          <ChevronRight className="h-4 w-4 text-text-secondary" aria-hidden />
        )}
      </button>
    </li>
  );
}

function NotifRow({
  icon,
  accent,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  accent: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl px-3 py-3">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          accent,
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-navy">{label}</p>
        <p className="text-[11px] text-text-secondary">{description}</p>
      </div>
      <button
        suppressHydrationWarning
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </li>
  );
}

function PrivacyRow({
  icon,
  label,
  description,
  badge,
  badgeTone,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  badge?: string;
  badgeTone?: "success" | "warning" | "error" | "info" | "neutral";
  href?: string;
}) {
  const Wrapper: React.ElementType = href ? Link : "div";
  return (
    <li>
      <Wrapper
        href={href ?? "#"}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-background"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-text-secondary">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-navy">{label}</p>
          <p className="text-[11px] text-text-secondary">{description}</p>
        </div>
        {badge && badgeTone ? (
          <Badge tone={badgeTone}>{badge}</Badge>
        ) : (
          <ChevronRight className="h-4 w-4 text-text-secondary" aria-hidden />
        )}
      </Wrapper>
    </li>
  );
}

function RoleInfoRow({
  role,
  description,
  tone,
}: {
  role: string;
  description: string;
  tone: "error" | "primary" | "info" | "purple";
}) {
  const tones: Record<typeof tone, string> = {
    error: "bg-primary-light text-primary",
    primary: "bg-blue-light text-blue",
    info: "bg-green-light text-green",
    purple: "bg-purple-light text-purple",
  };
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          tones[tone],
        )}
        aria-hidden
      >
        <Shield className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-semibold text-navy">{role}</p>
        <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
      </div>
    </li>
  );
}

function IntegrationRow({
  icon,
  accent,
  name,
  description,
  status,
  tone,
}: {
  icon: React.ReactNode;
  accent: string;
  name: string;
  description: string;
  status: string;
  tone: "success" | "warning";
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent,
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy">{name}</p>
        <p className="text-[11px] text-text-secondary">{description}</p>
      </div>
      <Badge tone={tone}>{status}</Badge>
    </li>
  );
}