import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  Users,
  Handshake,
  Heart,
  ArrowRight,
} from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Lifeline",
  description:
    "Have questions, suggestions, or want to collaborate? Reach out to the Lifeline team.",
};

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    note: "Mon – Sat, 9:00 AM – 6:00 PM",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@lifeline.org",
    note: "We usually reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Office Address",
    value: "IT Park, Nagpur, Maharashtra – 440022",
    note: "Visits by appointment",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Monday – Saturday, 9:00 AM – 6:00 PM",
    note: "Sunday: Closed",
  },
];

const waysToConnect = [
  {
    icon: Users,
    title: "Support Donors & Recipients",
    description: "Need help with the platform? We're here.",
    accent: "bg-primary-light text-primary",
  },
  {
    icon: Handshake,
    title: "Partner With Us",
    description: "Hospitals, NGOs, and organizations — let's collaborate.",
    accent: "bg-blue-light text-blue",
  },
  {
    icon: Heart,
    title: "Make a Bigger Impact",
    description: "Volunteer, fundraise, or spread the word.",
    accent: "bg-green-light text-green",
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-gradient-to-br from-primary-light/60 via-background to-background">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Get in touch
            </p>
            <h1 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              We&apos;re here to{" "}
              <span className="text-primary">help.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
              Have questions, suggestions, or want to collaborate? Reach out to
              us — together we can save more lives.
            </p>
          </div>
        </section>

        {/* Ways to connect */}
        <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-5 sm:grid-cols-3 lg:gap-6">
              {waysToConnect.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.accent}`}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact info + form */}
        <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
            {/* Contact info + map */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
                <h2 className="text-lg font-semibold text-navy">
                  Contact Information
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  We&apos;d love to hear from you. Choose the best way to reach
                  us.
                </p>

                <ul className="mt-5 flex flex-col gap-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.label} className="flex gap-4">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary"
                          aria-hidden
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-navy">
                            {item.value}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {item.note}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-light via-background to-blue-light">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                      <MapPin className="h-6 w-6" aria-hidden />
                    </span>
                    <p className="text-sm font-semibold text-navy">
                      Nagpur, Maharashtra
                    </p>
                    <p className="text-xs text-text-secondary">
                      Map view coming soon.
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency card */}
              <div className="flex gap-3 rounded-2xl border border-primary-light bg-primary-light/40 p-5">
                <span className="mt-0.5 shrink-0 text-primary">
                  <AlertCircle className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">
                    Need immediate help?
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    For urgent blood requests, call our 24/7 helpline.
                  </p>
                  <Link
                    href="tel:+919876543210"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    +91 98765 43210
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <ContactForm />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}