"use client";

import * as React from "react";
import { Send, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/Input";

const subjects = [
  "General enquiry",
  "Blood request support",
  "Become a donor",
  "Partner with us",
  "Report an issue",
  "Other",
];

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const update = (key: keyof typeof values, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Please enter your name.";
    if (!values.email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
      e.email = "Please enter a valid email.";
    if (!values.message.trim()) e.message = "Please enter your message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // TODO(Phase 8): POST /api/v1/contact once backend endpoint exists.
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-light text-green">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold text-navy">
          Message sent successfully
        </h2>
        <p className="max-w-sm text-sm text-text-secondary">
          Thanks for reaching out! Our team will get back to you within 24
          hours.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={() => {
            setSubmitted(false);
            setValues({
              name: "",
              email: "",
              phone: "",
              subject: subjects[0],
              message: "",
            });
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7"
    >
      <h2 className="text-lg font-semibold text-navy">Send Message</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Fill in the form and we&apos;ll get back to you as soon as we can.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FormField
          label="Full Name"
          htmlFor="cf-name"
          required
          error={errors.name}
        >
          <Input
            id="cf-name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            invalid={!!errors.name}
            autoComplete="name"
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

        <FormField label="Phone" htmlFor="cf-phone" help="Optional">
          <Input
            id="cf-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            autoComplete="tel"
          />
        </FormField>

        <FormField label="Subject" htmlFor="cf-subject">
          <Select
            id="cf-subject"
            value={values.subject}
            onChange={(e) => update("subject", e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Message"
          htmlFor="cf-message"
          required
          error={errors.message}
          className="sm:col-span-2"
        >
          <Textarea
            id="cf-message"
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="How can we help?"
            invalid={!!errors.message}
            rows={5}
          />
        </FormField>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p className="inline-flex items-center gap-2 text-xs text-text-secondary">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Your information is safe and secure with us.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="gap-2"
        >
          <Send className="h-4 w-4" aria-hidden />
          Send Message
        </Button>
      </div>
    </form>
  );
}