"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Lock,
  Shield,
  Eye,
  Trash2,
  Save,
  Camera,
  CheckCircle2,
  AlertCircle,
  Globe,
  Navigation,
  Droplet,
  Smartphone,
  Mail,
  FileText,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormField, Input, Select } from "@/components/ui/Input";
import {
  updateMyUser,
  updateMyDonor,
  type MeProfile,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const SECTIONS = [
  { id: "account", label: "Account", icon: User },
  { id: "preferences", label: "Preferences", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

interface Props {
  profile: MeProfile;
}

export function SettingsClient({ profile: initialProfile }: Props) {
  const { getToken } = useAuth();
  const { openUserProfile } = useClerk();
  const [profile, setProfile] = React.useState(initialProfile);
  const [activeSection, setActiveSection] =
    React.useState<SectionId>("account");

  // ── Account form state ────────────────────────────────────────────────
  const [account, setAccount] = React.useState({
    name: profile.user.name,
    email: profile.user.email,
    phone: profile.user.phone ?? "",
    date_of_birth: profile.donor?.date_of_birth ?? "",
    gender: profile.donor?.gender ?? "",
    blood_group: profile.donor?.blood_group ?? "",
    address: profile.donor?.address ?? "",
  });

  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  // ── Preferences state ────────────────────────────────────────────────
  const [prefs, setPrefs] = React.useState({
    language: "English",
    radius: "25 km",
    bloodGroupHelp: "All Blood Groups",
  });

  // ── Notification toggles ─────────────────────────────────────────────
  const [notifs, setNotifs] = React.useState({
    emergency: true,
    camp: true,
    messages: true,
    system: false,
    email: true,
    donationReminders: true,
  });

  const saveAccount = async () => {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not signed in.");

      const userRes = await updateMyUser(token, {
        name: account.name,
        phone: account.phone || null,
      });
      if (!userRes.success) throw new Error(userRes.error.message);

      if (profile.donor) {
        const donorRes = await updateMyDonor(token, {
          blood_group: account.blood_group,
          date_of_birth: account.date_of_birth,
          gender: account.gender,
          address: account.address,
        });
        if (!donorRes.success) throw new Error(donorRes.error.message);
        setProfile(donorRes.data);
      } else {
        setProfile(userRes.data);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
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
              Settings
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Manage Your{" "}
              <span className="text-primary">Preferences</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Customize your experience, keep your information secure, and
              stay connected for a healthier tomorrow.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;Same People,
              <br />
              Bigger Impact&rdquo;
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
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
                      <span className="flex-1">{s.label}</span>
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
          {activeSection === "account" && (
            <>
              {/* Account settings */}
              <Card>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <User
                      className="h-4 w-4 text-text-secondary"
                      aria-hidden
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-navy">
                        Account Settings
                      </h2>
                      <p className="text-xs text-text-secondary">
                        Manage your personal information and account details.
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
                  <FormField label="Full Name" htmlFor="st-name">
                    <Input
                      id="st-name"
                      value={account.name}
                      onChange={(e) =>
                        setAccount({ ...account, name: e.target.value })
                      }
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    htmlFor="st-email"
                    help="Managed by Clerk — click avatar to update"
                  >
                    <Input
                      id="st-email"
                      value={account.email}
                      disabled
                    />
                  </FormField>

                  <FormField label="Phone Number" htmlFor="st-phone">
                    <Input
                      id="st-phone"
                      type="tel"
                      value={account.phone}
                      onChange={(e) =>
                        setAccount({ ...account, phone: e.target.value })
                      }
                    />
                  </FormField>

                  <FormField label="Date of Birth" htmlFor="st-dob">
                    <Input
                      id="st-dob"
                      type="date"
                      value={account.date_of_birth}
                      onChange={(e) =>
                        setAccount({
                          ...account,
                          date_of_birth: e.target.value,
                        })
                      }
                    />
                  </FormField>

                  <FormField label="Gender" htmlFor="st-gender">
                    <Select
                      id="st-gender"
                      value={account.gender}
                      onChange={(e) =>
                        setAccount({ ...account, gender: e.target.value })
                      }
                    >
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </Select>
                  </FormField>

                  <FormField label="Blood Group" htmlFor="st-blood">
                    <Select
                      id="st-blood"
                      value={account.blood_group}
                      onChange={(e) =>
                        setAccount({ ...account, blood_group: e.target.value })
                      }
                    >
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField
                    label="Address"
                    htmlFor="st-address"
                    className="sm:col-span-2"
                  >
                    <Input
                      id="st-address"
                      value={account.address}
                      onChange={(e) =>
                        setAccount({ ...account, address: e.target.value })
                      }
                    />
                  </FormField>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    loading={saving}
                    onClick={saveAccount}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" aria-hidden />
                    Save Changes
                  </Button>
                </div>
              </Card>

              {/* Profile picture + Security */}
              <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                <Card>
                  <div className="mb-4 flex items-center gap-2">
                    <Camera
                      className="h-4 w-4 text-text-secondary"
                      aria-hidden
                    />
                    <h2 className="text-lg font-semibold text-navy">
                      Profile Picture
                    </h2>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary-light text-2xl font-bold text-primary">
                      {profile.user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openUserProfile()}
                        className="gap-1.5"
                      >
                        <Camera className="h-3.5 w-3.5" aria-hidden />
                        Change Photo
                      </Button>
                    </div>
                    <p className="text-center text-[11px] text-text-secondary">
                      Avatars are managed by Clerk. Click to open your account
                      menu.
                    </p>
                  </div>
                </Card>

                <Card>
                  <div className="mb-4 flex items-center gap-2">
                    <Shield
                      className="h-4 w-4 text-text-secondary"
                      aria-hidden
                    />
                    <h2 className="text-lg font-semibold text-navy">
                      Account Security
                    </h2>
                  </div>
                  <ul className="flex flex-col gap-1">
                    <SecurityRow
                      icon={<Lock className="h-4 w-4" aria-hidden />}
                      label="Change Password"
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
                      icon={<Smartphone className="h-4 w-4" aria-hidden />}
                      label="Active Sessions"
                      description="Manage your active sessions"
                      onClick={() => openUserProfile()}
                    />
                  </ul>
                </Card>
              </div>
            </>
          )}

          {activeSection === "preferences" && (
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-text-secondary" aria-hidden />
                <div>
                  <h2 className="text-lg font-semibold text-navy">
                    Preferences
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Set your preferences for a better experience.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField label="Preferred Language" htmlFor="pf-lang">
                  <Select
                    id="pf-lang"
                    value={prefs.language}
                    onChange={(e) =>
                      setPrefs({ ...prefs, language: e.target.value })
                    }
                  >
                    <option>English</option>
                    <option>हिन्दी</option>
                    <option>मराठी</option>
                  </Select>
                </FormField>

                <FormField label="Default Search Radius" htmlFor="pf-radius">
                  <Select
                    id="pf-radius"
                    value={prefs.radius}
                    onChange={(e) =>
                      setPrefs({ ...prefs, radius: e.target.value })
                    }
                  >
                    <option>10 km</option>
                    <option>25 km</option>
                    <option>50 km</option>
                    <option>100 km</option>
                  </Select>
                </FormField>

                <FormField
                  label="Preferred Blood Groups to Help"
                  htmlFor="pf-groups"
                >
                  <Select
                    id="pf-groups"
                    value={prefs.bloodGroupHelp}
                    onChange={(e) =>
                      setPrefs({ ...prefs, bloodGroupHelp: e.target.value })
                    }
                  >
                    <option>All Blood Groups</option>
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-blue-light bg-blue-light/40 p-3">
                <Navigation
                  className="h-4 w-4 shrink-0 text-blue"
                  aria-hidden
                />
                <p className="text-[11px] leading-relaxed text-navy">
                  These preferences help us notify you about relevant requests
                  and camps near you.
                </p>
              </div>
            </Card>
          )}

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

              <ul className="flex flex-col gap-1">
                <NotifRow
                  icon={<AlertCircle className="h-4 w-4" aria-hidden />}
                  accent="bg-primary-light text-primary"
                  label="Emergency Blood Requests"
                  description="Get notified about urgent blood requests near you."
                  checked={notifs.emergency}
                  onChange={(v) => setNotifs({ ...notifs, emergency: v })}
                />
                <NotifRow
                  icon={<Heart className="h-4 w-4" aria-hidden />}
                  accent="bg-green-light text-green"
                  label="Donation Reminders"
                  description="Get reminded when you are eligible to donate again."
                  checked={notifs.donationReminders}
                  onChange={(v) =>
                    setNotifs({ ...notifs, donationReminders: v })
                  }
                />
                <NotifRow
                  icon={<Bell className="h-4 w-4" aria-hidden />}
                  accent="bg-blue-light text-blue"
                  label="Camp Updates"
                  description="Receive updates about upcoming blood donation camps."
                  checked={notifs.camp}
                  onChange={(v) => setNotifs({ ...notifs, camp: v })}
                />
                <NotifRow
                  icon={<Smartphone className="h-4 w-4" aria-hidden />}
                  accent="bg-orange-light text-orange"
                  label="System Updates"
                  description="Important updates and announcements."
                  checked={notifs.system}
                  onChange={(v) => setNotifs({ ...notifs, system: v })}
                />
                <NotifRow
                  icon={<Bell className="h-4 w-4" aria-hidden />}
                  accent="bg-purple-light text-purple"
                  label="Messages"
                  description="Get notified when you receive new messages."
                  checked={notifs.messages}
                  onChange={(v) => setNotifs({ ...notifs, messages: v })}
                />
                <NotifRow
                  icon={<Mail className="h-4 w-4" aria-hidden />}
                  accent="bg-background text-text-secondary"
                  label="Email Notifications"
                  description="Receive important notifications via email."
                  checked={notifs.email}
                  onChange={(v) => setNotifs({ ...notifs, email: v })}
                />
              </ul>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 text-text-secondary" aria-hidden />
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
                  label="Change Password"
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
                  icon={<Smartphone className="h-4 w-4" aria-hidden />}
                  label="Active Sessions"
                  description="Manage and revoke active sessions"
                  onClick={() => openUserProfile()}
                />
              </ul>
            </Card>
          )}

          {activeSection === "privacy" && (
            <>
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-text-secondary" aria-hidden />
                  <div>
                    <h2 className="text-lg font-semibold text-navy">
                      Privacy & Data
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Control your data and privacy settings.
                    </p>
                  </div>
                </div>

                <ul className="flex flex-col gap-2">
                  <PrivacyRow
                    icon={<FileText className="h-4 w-4" aria-hidden />}
                    label="Data Usage"
                    description="Manage how your data is used"
                    href="/privacy"
                  />
                  <PrivacyRow
                    icon={<Shield className="h-4 w-4" aria-hidden />}
                    label="Privacy Policy"
                    description="Read our privacy policy"
                    href="/privacy"
                  />
                  <PrivacyRow
                    icon={<FileText className="h-4 w-4" aria-hidden />}
                    label="Terms of Service"
                    description="Read our terms"
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
                  This action cannot be undone.
                </p>
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openUserProfile()}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Delete Account
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Bottom save bar */}
          {activeSection === "account" && (
            <div className="sticky bottom-4 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                loading={saving}
                onClick={saveAccount}
                className="gap-2 shadow-[var(--shadow-elevated)]"
              >
                <Save className="h-4 w-4" aria-hidden />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ───────────────────────────────────────────────
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

function PrivacyRow({
  icon,
  label,
  description,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href?: string;
}) {
  return (
    <li>
      <Link
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
        <ChevronRight className="h-4 w-4 text-text-secondary" aria-hidden />
      </Link>
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