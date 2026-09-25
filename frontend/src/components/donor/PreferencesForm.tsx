"use client";

import * as React from "react";
import { Pencil, Save, X, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Input";
import { updateMyDonor, type MeProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const LANGUAGES = ["English", "हिन्दी", "मराठी"];
const RADII = [5, 10, 25, 50, 100];

interface Props {
  profile: MeProfile;
  onSaved: (next: MeProfile) => void;
}

export function PreferencesForm({ profile, onSaved }: Props) {
  const { getToken } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const donor = profile.donor;

  const [values, setValues] = React.useState({
    preferred_language: donor?.preferred_language ?? "English",
    default_search_radius_km: donor?.default_search_radius_km ?? 25,
    preferred_blood_groups: donor?.preferred_blood_groups ?? [],
    availability_status: donor?.availability_status ?? "available",
    consent_to_contact: donor?.consent_to_contact ?? false,
  });

  const reset = () => {
    setValues({
      preferred_language: donor?.preferred_language ?? "English",
      default_search_radius_km: donor?.default_search_radius_km ?? 25,
      preferred_blood_groups: donor?.preferred_blood_groups ?? [],
      availability_status: donor?.availability_status ?? "available",
      consent_to_contact: donor?.consent_to_contact ?? false,
    });
  };

  const toggleGroup = (g: string) => {
    setValues((v) => ({
      ...v,
      preferred_blood_groups: v.preferred_blood_groups.includes(g)
        ? v.preferred_blood_groups.filter((x) => x !== g)
        : [...v.preferred_blood_groups, g],
    }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not signed in.");

      const res = await updateMyDonor(token, {
        preferred_language: values.preferred_language,
        default_search_radius_km: Number(values.default_search_radius_km),
        preferred_blood_groups: values.preferred_blood_groups,
        availability_status: values.availability_status,
        consent_to_contact: values.consent_to_contact,
      });

      if (!res.success) throw new Error(res.error.message);
      onSaved(res.data);
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
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-text-secondary" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold text-navy">Preferences</h2>
            <p className="text-xs text-text-secondary">
              Set your preferences for a better experience.
            </p>
          </div>
        </div>
        {!editing ? (
          <button
            suppressHydrationWarning
            type="button"
            onClick={() => {
              reset();
              setEditing(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => {
                reset();
                setEditing(false);
                setError(null);
              }}
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-navy"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Cancel
            </button>
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={save}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" aria-hidden />
              Save
            </Button>
          </div>
        )}
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-light bg-green-light/40 p-3 text-xs text-green">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          Preferences updated.
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Preferred Language" htmlFor="pr-lang">
          <Select
            id="pr-lang"
            value={values.preferred_language}
            onChange={(e) =>
              setValues({ ...values, preferred_language: e.target.value })
            }
            disabled={!editing}
          >
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Default Search Radius" htmlFor="pr-radius">
          <Select
            id="pr-radius"
            value={String(values.default_search_radius_km)}
            onChange={(e) =>
              setValues({
                ...values,
                default_search_radius_km: Number(e.target.value),
              })
            }
            disabled={!editing}
          >
            {RADII.map((r) => (
              <option key={r} value={r}>
                {r} km
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Availability Status"
          htmlFor="pr-availability"
          className="sm:col-span-2"
        >
          <Select
            id="pr-availability"
            value={values.availability_status}
            onChange={(e) =>
              setValues({ ...values, availability_status: e.target.value })
            }
            disabled={!editing}
          >
            <option value="available">Available to donate</option>
            <option value="unavailable">Not available right now</option>
          </Select>
        </FormField>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-navy">
            Preferred Blood Groups to Help
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((g) => {
              const active = values.preferred_blood_groups.includes(g);
              return (
                <button
                  key={g}
                  suppressHydrationWarning
                  type="button"
                  disabled={!editing}
                  onClick={() => toggleGroup(g)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-navy hover:border-primary hover:text-primary",
                  )}
                >
                  {g}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            Leave all unselected to receive requests for any blood group.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 sm:col-span-2">
          <div>
            <p className="text-sm font-medium text-navy">
              Allow Donors to Contact Me
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">
              When enabled, verified requesters can reach you for genuine blood
              requests.
            </p>
          </div>
          <button
            suppressHydrationWarning
            type="button"
            role="switch"
            aria-checked={values.consent_to_contact}
            disabled={!editing}
            onClick={() =>
              setValues((v) => ({
                ...v,
                consent_to_contact: !v.consent_to_contact,
              }))
            }
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
              values.consent_to_contact ? "bg-primary" : "bg-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                values.consent_to_contact
                  ? "translate-x-5"
                  : "translate-x-0.5",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}