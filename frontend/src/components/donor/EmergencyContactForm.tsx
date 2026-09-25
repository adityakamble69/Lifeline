"use client";

import * as React from "react";
import { Pencil, Save, X, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Input";
import { updateMyDonor, type MeProfile } from "@/lib/api";

const RELATIONSHIPS = [
  "Parent",
  "Spouse",
  "Sibling",
  "Child",
  "Friend",
  "Relative",
  "Other",
];

interface Props {
  profile: MeProfile;
  onSaved: (next: MeProfile) => void;
}

export function EmergencyContactForm({ profile, onSaved }: Props) {
  const { getToken } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const donor = profile.donor;

  const [values, setValues] = React.useState({
    emergency_contact_name: donor?.emergency_contact_name ?? "",
    emergency_contact_phone: donor?.emergency_contact_phone ?? "",
    emergency_contact_relationship: donor?.emergency_contact_relationship ?? "Parent",
  });

  const reset = () => {
    setValues({
      emergency_contact_name: donor?.emergency_contact_name ?? "",
      emergency_contact_phone: donor?.emergency_contact_phone ?? "",
      emergency_contact_relationship:
        donor?.emergency_contact_relationship ?? "Parent",
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not signed in.");

      if (values.emergency_contact_phone) {
        if (!/^[+\d][\d\s-]{7,}$/.test(values.emergency_contact_phone)) {
          throw new Error("Enter a valid phone number.");
        }
      }

      const res = await updateMyDonor(token, {
        emergency_contact_name: values.emergency_contact_name,
        emergency_contact_phone: values.emergency_contact_phone,
        emergency_contact_relationship:
          values.emergency_contact_relationship,
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
          <Phone className="h-4 w-4 text-text-secondary" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold text-navy">
              Emergency Contact
            </h2>
            <p className="text-xs text-text-secondary">
              Person we&apos;ll contact in case of any emergency during
              donation.
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
          Emergency contact updated.
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Contact Name"
          htmlFor="ec-name"
          className="sm:col-span-2"
        >
          <Input
            id="ec-name"
            value={values.emergency_contact_name}
            onChange={(e) =>
              setValues({ ...values, emergency_contact_name: e.target.value })
            }
            placeholder="Full name of emergency contact"
            disabled={!editing}
          />
        </FormField>

        <FormField label="Phone Number" htmlFor="ec-phone">
          <Input
            id="ec-phone"
            type="tel"
            value={values.emergency_contact_phone}
            onChange={(e) =>
              setValues({ ...values, emergency_contact_phone: e.target.value })
            }
            placeholder="+91 98765 43210"
            disabled={!editing}
          />
        </FormField>

        <FormField label="Relationship" htmlFor="ec-rel">
          <Select
            id="ec-rel"
            value={values.emergency_contact_relationship}
            onChange={(e) =>
              setValues({
                ...values,
                emergency_contact_relationship: e.target.value,
              })
            }
            disabled={!editing}
          >
            {RELATIONSHIPS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border border-orange-light bg-orange-light/40 p-3">
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-orange"
          aria-hidden
        />
        <p className="text-[11px] leading-relaxed text-navy">
          Please inform your emergency contact that they may be contacted by
          Lifeline in case of any medical situation during donation.
        </p>
      </div>
    </div>
  );
}