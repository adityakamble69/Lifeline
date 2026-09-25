"use client";

import * as React from "react";
import { Pencil, Save, X, CheckCircle2, AlertCircle, Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Textarea, Select } from "@/components/ui/Input";
import { updateMyDonor, type MeProfile } from "@/lib/api";

interface Props {
  profile: MeProfile;
  onSaved: (next: MeProfile) => void;
}

export function HealthInfoForm({ profile, onSaved }: Props) {
  const { getToken } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const donor = profile.donor;

  const [values, setValues] = React.useState({
    weight_kg: donor?.weight_kg ? String(donor.weight_kg) : "",
    medical_conditions: donor?.medical_conditions ?? "",
    on_medication: donor?.on_medication ?? false,
    allergies: donor?.allergies ?? "",
    last_donation_date: donor?.last_donation_date ?? "",
  });

  const reset = () => {
    setValues({
      weight_kg: donor?.weight_kg ? String(donor.weight_kg) : "",
      medical_conditions: donor?.medical_conditions ?? "",
      on_medication: donor?.on_medication ?? false,
      allergies: donor?.allergies ?? "",
      last_donation_date: donor?.last_donation_date ?? "",
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not signed in.");

      const weight = values.weight_kg ? Number(values.weight_kg) : undefined;
      if (weight !== undefined && (weight < 45 || weight > 200)) {
        throw new Error("Weight must be between 45 and 200 kg.");
      }

      const res = await updateMyDonor(token, {
        weight_kg: weight,
        medical_conditions: values.medical_conditions,
        on_medication: values.on_medication,
        allergies: values.allergies,
        last_donation_date: values.last_donation_date,
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
          <Heart className="h-4 w-4 text-text-secondary" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold text-navy">
              Health Information
            </h2>
            <p className="text-xs text-text-secondary">
              These details help us ensure your safety during donation.
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
          Health information updated.
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
          label="Weight (kg)"
          htmlFor="hi-weight"
          help="Minimum 45 kg required for donation"
        >
          <Input
            id="hi-weight"
            type="number"
            min={45}
            max={200}
            value={values.weight_kg}
            onChange={(e) =>
              setValues({ ...values, weight_kg: e.target.value })
            }
            placeholder="e.g. 65"
            disabled={!editing}
          />
        </FormField>

        <FormField
          label="Last Donation Date"
          htmlFor="hi-last-donation"
          help="Leave blank if never donated"
        >
          <Input
            id="hi-last-donation"
            type="date"
            value={values.last_donation_date}
            onChange={(e) =>
              setValues({ ...values, last_donation_date: e.target.value })
            }
            disabled={!editing}
          />
        </FormField>

        <FormField
          label="Currently on Medication?"
          htmlFor="hi-medication"
        >
          <Select
            id="hi-medication"
            value={values.on_medication ? "yes" : "no"}
            onChange={(e) =>
              setValues({ ...values, on_medication: e.target.value === "yes" })
            }
            disabled={!editing}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </Select>
        </FormField>

        <FormField
          label="Allergies"
          htmlFor="hi-allergies"
          help="Optional — any known allergies"
        >
          <Input
            id="hi-allergies"
            value={values.allergies}
            onChange={(e) =>
              setValues({ ...values, allergies: e.target.value })
            }
            placeholder="e.g. Penicillin, Dust"
            disabled={!editing}
          />
        </FormField>

        <FormField
          label="Current Medical Conditions"
          htmlFor="hi-conditions"
          help="Optional — conditions we should be aware of"
          className="sm:col-span-2"
        >
          <Textarea
            id="hi-conditions"
            value={values.medical_conditions}
            onChange={(e) =>
              setValues({ ...values, medical_conditions: e.target.value })
            }
            placeholder="e.g. Hypertension, Diabetes"
            rows={3}
            disabled={!editing}
          />
        </FormField>
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border border-blue-light bg-blue-light/40 p-3">
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-blue"
          aria-hidden
        />
        <p className="text-[11px] leading-relaxed text-navy">
          This information is confidential and only used by medical staff to
          ensure your safety. It is never shared publicly.
        </p>
      </div>
    </div>
  );
}