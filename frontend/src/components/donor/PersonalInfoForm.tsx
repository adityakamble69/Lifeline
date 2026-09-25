"use client";

import * as React from "react";
import { Pencil, Save, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Input";
import { updateMyUser, updateMyDonor, type MeProfile } from "@/lib/api";

interface Props {
  profile: MeProfile;
  onSaved: (next: MeProfile) => void;
}

export function PersonalInfoForm({ profile, onSaved }: Props) {
  const { getToken } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [values, setValues] = React.useState({
    name: profile.user.name,
    phone: profile.user.phone ?? "",
    date_of_birth: profile.donor?.date_of_birth ?? "",
    gender: profile.donor?.gender ?? "",
    blood_group: profile.donor?.blood_group ?? "",
    city: profile.donor?.city ?? "",
    state: profile.donor?.state ?? "",
    address: profile.donor?.address ?? "",
  });

  const update = (key: keyof typeof values, value: string) =>
    setValues((p) => ({ ...p, [key]: value }));

  const startEdit = () => {
    setError(null);
    setSuccess(false);
    setEditing(true);
  };

  const cancel = () => {
    setValues({
      name: profile.user.name,
      phone: profile.user.phone ?? "",
      date_of_birth: profile.donor?.date_of_birth ?? "",
      gender: profile.donor?.gender ?? "",
      blood_group: profile.donor?.blood_group ?? "",
      city: profile.donor?.city ?? "",
      state: profile.donor?.state ?? "",
      address: profile.donor?.address ?? "",
    });
    setEditing(false);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not signed in.");

      const userRes = await updateMyUser(token, {
        name: values.name,
        phone: values.phone || null,
      });
      if (!userRes.success) throw new Error(userRes.error.message);

      if (profile.donor) {
        const donorRes = await updateMyDonor(token, {
          blood_group: values.blood_group,
          date_of_birth: values.date_of_birth,
          gender: values.gender,
          city: values.city,
          state: values.state,
          address: values.address,
        });
        if (!donorRes.success) throw new Error(donorRes.error.message);
        onSaved(donorRes.data);
      } else {
        onSaved(userRes.data);
      }

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
        <h2 className="text-lg font-semibold text-navy">
          Personal Information
        </h2>
        {!editing ? (
          <button
            suppressHydrationWarning
            type="button"
            onClick={startEdit}
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
              onClick={cancel}
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
          Profile updated successfully.
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" htmlFor="pi-name">
          <Input
            id="pi-name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            disabled={!editing}
          />
        </FormField>

        <FormField label="Phone Number" htmlFor="pi-phone">
          <Input
            id="pi-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            disabled={!editing}
          />
        </FormField>

        <FormField label="Email Address" htmlFor="pi-email">
          <Input id="pi-email" value={profile.user.email} disabled />
        </FormField>

        <FormField label="Date of Birth" htmlFor="pi-dob">
          <Input
            id="pi-dob"
            type="date"
            value={values.date_of_birth}
            onChange={(e) => update("date_of_birth", e.target.value)}
            disabled={!editing}
          />
        </FormField>

        <FormField label="Gender" htmlFor="pi-gender">
          <Input
            id="pi-gender"
            value={values.gender}
            onChange={(e) => update("gender", e.target.value)}
            disabled={!editing}
          />
        </FormField>

        <FormField label="Blood Group" htmlFor="pi-blood">
          <Input
            id="pi-blood"
            value={values.blood_group}
            onChange={(e) => update("blood_group", e.target.value)}
            disabled={!editing}
          />
        </FormField>

        <FormField label="City" htmlFor="pi-city">
          <Input
            id="pi-city"
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            disabled={!editing}
          />
        </FormField>

        <FormField label="State" htmlFor="pi-state">
          <Input
            id="pi-state"
            value={values.state}
            onChange={(e) => update("state", e.target.value)}
            disabled={!editing}
          />
        </FormField>

        <FormField
          label="Address"
          htmlFor="pi-address"
          className="sm:col-span-2"
        >
          <Input
            id="pi-address"
            value={values.address}
            onChange={(e) => update("address", e.target.value)}
            disabled={!editing}
          />
        </FormField>
      </div>
    </div>
  );
}