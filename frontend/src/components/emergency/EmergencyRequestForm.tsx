"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Phone,
  Info,
  Send,
} from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/Input";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const urgencies = [
  { value: "critical", label: "Critical — Within hours" },
  { value: "high", label: "High — Within 24 hours" },
  { value: "moderate", label: "Moderate — Within 3 days" },
];

interface FormValues {
  patientName: string;
  bloodGroup: string;
  unitsRequired: string;
  hospitalName: string;
  city: string;
  state: string;
  urgency: string;
  requiredAt: string;
  contactPhone: string;
  description: string;
}

const initialValues: FormValues = {
  patientName: "",
  bloodGroup: "O+",
  unitsRequired: "1",
  hospitalName: "",
  city: "Nagpur",
  state: "Maharashtra",
  urgency: "critical",
  requiredAt: "",
  contactPhone: "",
  description: "",
};

export function EmergencyRequestForm() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<{ id: string } | null>(null);

  const update = (key: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.patientName.trim()) e.patientName = "Patient name is required.";
    if (!values.hospitalName.trim()) e.hospitalName = "Hospital name is required.";
    if (!values.city.trim()) e.city = "City is required.";
    if (!values.state.trim()) e.state = "State is required.";
    if (!values.contactPhone.trim()) e.contactPhone = "Contact phone is required.";
    else if (!/^[+\d][\d\s-]{7,}$/.test(values.contactPhone))
      e.contactPhone = "Enter a valid phone number.";
    const units = Number(values.unitsRequired);
    if (!Number.isFinite(units) || units < 1)
      e.unitsRequired = "Units must be at least 1.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (!isSignedIn) return;

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_name: values.patientName,
          blood_group: values.bloodGroup,
          units_required: Number(values.unitsRequired),
          hospital_name: values.hospitalName,
          city: values.city,
          state: values.state,
          urgency: values.urgency,
          required_at: values.requiredAt || null,
          contact_phone: values.contactPhone,
          description: values.description || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Failed to submit request.");
      }

      setSubmitted({ id: data.data.request.id });
    } catch (err) {
      setErrors({
        _form: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-light text-green">
            <CheckCircle2 className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="text-xl font-semibold text-navy">Request submitted</h2>
          <p className="max-w-md text-sm text-text-secondary">
            Your emergency blood request has been received. Our team will
            verify it and notify nearby donors immediately.
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Reference ID:{" "}
            <span className="font-mono">{submitted.id.slice(0, 8)}</span>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/find-blood">
              <Button variant="primary" size="sm">
                Find Donors
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSubmitted(null);
                setValues(initialValues);
              }}
            >
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
            <AlertCircle className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="text-xl font-semibold text-navy">
            Sign in to submit a request
          </h2>
          <p className="max-w-md text-sm text-text-secondary">
            To keep our network safe, emergency blood requests are only
            available to signed-in users. It takes less than a minute.
          </p>
          <SignInButton mode="modal">
            <Button variant="primary" size="md" className="mt-2">
              Sign in to continue
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7"
      >
        <h2 className="text-lg font-semibold text-navy">
          Patient & Request Details
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Please provide accurate information so we can coordinate quickly.
        </p>

        {errors._form && (
          <div className="mt-4 flex gap-3 rounded-xl border border-primary-light bg-primary-light/40 p-3">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden
            />
            <p className="text-xs text-primary">{errors._form}</p>
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField
            label="Patient Name"
            htmlFor="er-patient"
            required
            error={errors.patientName}
            className="sm:col-span-2"
          >
            <Input
              id="er-patient"
              value={values.patientName}
              onChange={(e) => update("patientName", e.target.value)}
              placeholder="Full name of the patient"
              invalid={!!errors.patientName}
              autoComplete="name"
            />
          </FormField>

          <FormField label="Blood Group Required" htmlFor="er-group" required>
            <Select
              id="er-group"
              value={values.bloodGroup}
              onChange={(e) => update("bloodGroup", e.target.value)}
            >
              {bloodGroups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Units Required"
            htmlFor="er-units"
            required
            error={errors.unitsRequired}
          >
            <Input
              id="er-units"
              type="number"
              min={1}
              max={20}
              value={values.unitsRequired}
              onChange={(e) => update("unitsRequired", e.target.value)}
              invalid={!!errors.unitsRequired}
            />
          </FormField>

          <FormField
            label="Hospital Name"
            htmlFor="er-hospital"
            required
            error={errors.hospitalName}
            className="sm:col-span-2"
          >
            <Input
              id="er-hospital"
              value={values.hospitalName}
              onChange={(e) => update("hospitalName", e.target.value)}
              placeholder="Where is the patient admitted?"
              invalid={!!errors.hospitalName}
            />
          </FormField>

          <FormField
            label="City"
            htmlFor="er-city"
            required
            error={errors.city}
          >
            <Input
              id="er-city"
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              invalid={!!errors.city}
            />
          </FormField>

          <FormField
            label="State"
            htmlFor="er-state"
            required
            error={errors.state}
          >
            <Input
              id="er-state"
              value={values.state}
              onChange={(e) => update("state", e.target.value)}
              invalid={!!errors.state}
            />
          </FormField>

          <FormField label="Urgency Level" htmlFor="er-urgency" required>
            <Select
              id="er-urgency"
              value={values.urgency}
              onChange={(e) => update("urgency", e.target.value)}
            >
              {urgencies.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Required By"
            htmlFor="er-required"
            help="Optional — when is the blood needed?"
          >
            <Input
              id="er-required"
              type="datetime-local"
              value={values.requiredAt}
              onChange={(e) => update("requiredAt", e.target.value)}
            />
          </FormField>

          <FormField
            label="Contact Phone"
            htmlFor="er-phone"
            required
            error={errors.contactPhone}
            className="sm:col-span-2"
          >
            <Input
              id="er-phone"
              type="tel"
              value={values.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              placeholder="+91 98765 43210"
              invalid={!!errors.contactPhone}
              autoComplete="tel"
            />
          </FormField>

          <FormField
            label="Additional Details"
            htmlFor="er-description"
            help="Optional — medical condition, instructions, etc."
            className="sm:col-span-2"
          >
            <Textarea
              id="er-description"
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Any other relevant information"
              rows={4}
            />
          </FormField>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="text-xs text-text-secondary">
            Fields marked <span className="text-primary">*</span> are required.
          </p>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="gap-2"
          >
            <Send className="h-4 w-4" aria-hidden />
            Submit Emergency Request
          </Button>
        </div>
      </form>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-primary-light bg-primary-light/40 p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <AlertCircle className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="text-base font-semibold text-navy">
              In an emergency?
            </h3>
          </div>
          <p className="text-sm text-text-secondary">
            If the situation is life-threatening, please call our 24/7
            helpline in addition to submitting this request.
          </p>
          <a
            href="tel:+919876543210"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <Phone className="h-4 w-4" aria-hidden />
            +91 98765 43210
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-navy">
            What happens next?
          </h3>
          <ol className="mt-3 space-y-3 text-sm text-text-secondary">
            {[
              "Our team verifies your request within minutes.",
              "Nearby donors matching the blood group are notified.",
              "You'll receive contact details of available donors.",
              "Coordinate directly and update the request status.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
          <p className="text-xs leading-relaxed text-navy">
            All requests are verified by our team. Please provide accurate
            information — misuse may result in account suspension.
          </p>
        </div>
      </aside>
    </div>
  );
}