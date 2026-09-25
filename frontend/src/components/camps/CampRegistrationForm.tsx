"use client";

import * as React from "react";
import {
  User,
  Heart,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Send,
  ShieldCheck,
  Bell,
  Calendar,
  Clock,
} from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const genders = ["Male", "Female", "Other", "Prefer not to say"];

interface Step {
  id: 1 | 2 | 3;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  { id: 1, label: "Personal Details", icon: User },
  { id: 2, label: "Health Information", icon: Heart },
  { id: 3, label: "Review & Confirm", icon: ClipboardCheck },
];

interface FormValues {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  weight: string;
  hasCondition: string;
  onMedication: string;
  lastDonation: string;
  notes: string;
}

const initialValues: FormValues = {
  fullName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  gender: "Male",
  bloodGroup: "O+",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  weight: "",
  hasCondition: "no",
  onMedication: "no",
  lastDonation: "",
  notes: "",
};

interface CampInfo {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
}

export function CampRegistrationForm({
  camp,
  onSuccess,
}: {
  camp: CampInfo;
  onSuccess?: () => void;
}) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const update = (key: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!values.fullName.trim()) e.fullName = "Full name is required.";
    if (!values.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[+\d][\d\s-]{7,}$/.test(values.phone))
      e.phone = "Enter a valid phone number.";
    if (!values.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
      e.email = "Enter a valid email.";
    if (!values.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!values.address.trim()) e.address = "Address is required.";
    if (!values.emergencyContactName.trim())
      e.emergencyContactName = "Emergency contact name is required.";
    if (!values.emergencyContactPhone.trim())
      e.emergencyContactPhone = "Emergency contact phone is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    const weight = Number(values.weight);
    if (!values.weight.trim()) e.weight = "Weight is required.";
    else if (!Number.isFinite(weight) || weight < 45)
      e.weight = "Minimum weight for donation is 45 kg.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)));
  };

  const back = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)));

  const handleSubmit = async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/camps/${camp.id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: values.fullName,
          phone: values.phone,
          email: values.email,
          date_of_birth: values.dateOfBirth,
          gender: values.gender,
          blood_group: values.bloodGroup,
          address: values.address,
          emergency_contact_name: values.emergencyContactName,
          emergency_contact_phone: values.emergencyContactPhone,
          weight_kg: Number(values.weight),
          has_condition: values.hasCondition === "yes",
          on_medication: values.onMedication === "yes",
          last_donation: values.lastDonation || null,
          notes: values.notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Registration failed.");
      }

      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setErrors({
        _form: err instanceof Error ? err.message : "Something went wrong.",
      });
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // Not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
            <AlertCircle className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="text-xl font-semibold text-navy">
            Sign in to register
          </h2>
          <p className="max-w-md text-sm text-text-secondary">
            Create a free account (or sign in) to register for this camp. It
            helps us keep your donation record safe and send you reminders.
          </p>
          <SignInButton mode="modal">
            <Button variant="primary" size="md" className="mt-2">
              Sign in to register
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-light text-green">
            <CheckCircle2 className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="text-xl font-semibold text-navy">
            Registration confirmed!
          </h2>
          <p className="max-w-md text-sm text-text-secondary">
            You&apos;re registered for{" "}
            <span className="font-semibold text-navy">{camp.title}</span> on{" "}
            {camp.date}. We&apos;ll send you reminders before the camp.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSubmitted(false);
                setValues(initialValues);
                setStep(1);
                onSuccess?.();
              }}
            >
              Register Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Form */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
        {/* Stepper */}
        <div className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      done && "bg-primary text-white",
                      active && !done && "bg-primary text-white",
                      !active && !done && "bg-background text-text-secondary",
                    )}
                    aria-hidden
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "hidden text-sm font-semibold sm:inline",
                      active ? "text-navy" : "text-text-secondary",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      step > s.id ? "bg-primary" : "bg-border",
                    )}
                    aria-hidden
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {errors._form && (
          <div className="mb-4 flex gap-3 rounded-xl border border-primary-light bg-primary-light/40 p-3">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden
            />
            <p className="text-xs text-primary">{errors._form}</p>
          </div>
        )}

        {/* Step 1: Personal */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-navy">
              Personal Details
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Please provide your information to register for this camp.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField
                label="Full Name"
                htmlFor="cf-fullName"
                required
                error={errors.fullName}
                className="sm:col-span-2"
              >
                <Input
                  id="cf-fullName"
                  value={values.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Your full name"
                  invalid={!!errors.fullName}
                  autoComplete="name"
                />
              </FormField>

              <FormField
                label="Phone Number"
                htmlFor="cf-phone"
                required
                error={errors.phone}
              >
                <Input
                  id="cf-phone"
                  type="tel"
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  invalid={!!errors.phone}
                  autoComplete="tel"
                />
              </FormField>

              <FormField
                label="Email"
                htmlFor="cf-email"
                required
                error={errors.email}
              >
                <Input
                  id="cf-email"
                  type="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  invalid={!!errors.email}
                  autoComplete="email"
                />
              </FormField>

              <FormField
                label="Date of Birth"
                htmlFor="cf-dob"
                required
                error={errors.dateOfBirth}
              >
                <Input
                  id="cf-dob"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  invalid={!!errors.dateOfBirth}
                />
              </FormField>

              <FormField label="Gender" htmlFor="cf-gender" required>
                <Select
                  id="cf-gender"
                  value={values.gender}
                  onChange={(e) => update("gender", e.target.value)}
                >
                  {genders.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Blood Group"
                htmlFor="cf-group"
                required
                className="sm:col-span-2"
              >
                <Select
                  id="cf-group"
                  value={values.bloodGroup}
                  onChange={(e) => update("bloodGroup", e.target.value)}
                >
                  {bloodGroups.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Address"
                htmlFor="cf-address"
                required
                error={errors.address}
                className="sm:col-span-2"
              >
                <Textarea
                  id="cf-address"
                  value={values.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Your full address with PIN code"
                  invalid={!!errors.address}
                  rows={3}
                />
              </FormField>

              <FormField
                label="Emergency Contact Name"
                htmlFor="cf-ecn"
                required
                error={errors.emergencyContactName}
              >
                <Input
                  id="cf-ecn"
                  value={values.emergencyContactName}
                  onChange={(e) => update("emergencyContactName", e.target.value)}
                  invalid={!!errors.emergencyContactName}
                />
              </FormField>

              <FormField
                label="Emergency Contact Phone"
                htmlFor="cf-ecp"
                required
                error={errors.emergencyContactPhone}
              >
                <Input
                  id="cf-ecp"
                  type="tel"
                  value={values.emergencyContactPhone}
                  onChange={(e) =>
                    update("emergencyContactPhone", e.target.value)
                  }
                  invalid={!!errors.emergencyContactPhone}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Step 2: Health */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-navy">
              Health Information
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              These questions help us ensure your safety during donation.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField
                label="Weight (kg)"
                htmlFor="cf-weight"
                required
                error={errors.weight}
              >
                <Input
                  id="cf-weight"
                  type="number"
                  min={45}
                  max={200}
                  value={values.weight}
                  onChange={(e) => update("weight", e.target.value)}
                  placeholder="e.g. 65"
                  invalid={!!errors.weight}
                />
              </FormField>

              <FormField
                label="Last Donation Date"
                htmlFor="cf-last-donation"
                help="Leave blank if this is your first time."
              >
                <Input
                  id="cf-last-donation"
                  type="date"
                  value={values.lastDonation}
                  onChange={(e) => update("lastDonation", e.target.value)}
                />
              </FormField>

              <FormField
                label="Do you have any current medical condition?"
                htmlFor="cf-condition"
              >
                <Select
                  id="cf-condition"
                  value={values.hasCondition}
                  onChange={(e) => update("hasCondition", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </FormField>

              <FormField
                label="Are you currently on any medication?"
                htmlFor="cf-medication"
              >
                <Select
                  id="cf-medication"
                  value={values.onMedication}
                  onChange={(e) => update("onMedication", e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </FormField>

              <FormField
                label="Additional Notes"
                htmlFor="cf-notes"
                help="Optional — anything the medical team should know."
                className="sm:col-span-2"
              >
                <Textarea
                  id="cf-notes"
                  value={values.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-navy">
              Review & Confirm
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Please review your details before submitting.
            </p>

            <div className="mt-5 space-y-3">
              <ReviewRow label="Camp" value={camp.title} />
              <ReviewRow label="Venue" value={camp.venue} />
              <ReviewRow label="Date & Time" value={`${camp.date} · ${camp.time}`} />
              <ReviewRow label="Full Name" value={values.fullName} />
              <ReviewRow label="Phone" value={values.phone} />
              <ReviewRow label="Email" value={values.email} />
              <ReviewRow label="Blood Group" value={values.bloodGroup} />
              <ReviewRow label="Weight" value={`${values.weight} kg`} />
              {values.lastDonation && (
                <ReviewRow label="Last Donation" value={values.lastDonation} />
              )}
              <ReviewRow
                label="Emergency Contact"
                value={`${values.emergencyContactName} (${values.emergencyContactPhone})`}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={back}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={next}
              className="gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSubmit}
              loading={loading}
              className="gap-2"
            >
              <Send className="h-4 w-4" aria-hidden />
              Confirm Registration
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
          <div className="relative aspect-[16/10] bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-xl bg-primary px-3 py-1.5 text-center text-white shadow-md">
              <span className="block text-sm font-bold leading-none">CAMP</span>
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-base font-semibold text-navy">{camp.title}</h3>
            <p className="mt-1 text-xs text-text-secondary">
              {camp.venue}
            </p>
            <div className="mt-4 space-y-2 text-sm text-text-secondary">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" aria-hidden />
                {camp.date}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" aria-hidden />
                {camp.time}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            Your data is safe
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            Your information is only shared with the camp organizer and the
            medical team for coordination.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-light bg-blue-light/40 p-4">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-navy">
            <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue" aria-hidden />
            You&apos;ll receive a reminder notification a day before the camp.
          </p>
        </div>
      </aside>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2.5 text-sm last:border-0 last:pb-0">
      <span className="text-text-secondary">{label}</span>
      <span className="max-w-[60%] truncate text-right font-semibold text-navy">
        {value || "—"}
      </span>
    </div>
  );
}