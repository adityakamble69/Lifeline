import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Clock,
  Award,
  ClipboardList,
  Stethoscope,
  Droplet,
  Coffee,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { BecomeDonorCTA } from "@/components/donor/BecomeDonorCTA";

export const metadata: Metadata = {
  title: "Become a Donor — Lifeline",
  description:
    "Register as a blood donor and be the reason someone gets a second chance at life.",
};

const eligibility = [
  { label: "Age", value: "18 – 65 years" },
  { label: "Weight", value: "At least 50 kg" },
  { label: "Hemoglobin", value: "12.5 g/dL or above" },
  { label: "Last Donation", value: "3+ months ago" },
];

const disqualifiers = [
  "Cold, flu, or fever in the last 7 days",
  "Major surgery in the last 6 months",
  "Tattoo or piercing in the last 6 months",
  "Pregnancy or recent childbirth",
  "On certain medications (consult doctor)",
];

const steps = [
  {
    icon: ClipboardList,
    title: "Registration",
    description:
      "Fill a quick form with your basic details — takes less than 2 minutes.",
  },
  {
    icon: Stethoscope,
    title: "Health Check",
    description:
      "A brief medical screening checks your hemoglobin, blood pressure, and overall health.",
  },
  {
    icon: Droplet,
    title: "Donation",
    description:
      "The actual blood draw takes about 8–10 minutes. You'll be comfortable throughout.",
  },
  {
    icon: Coffee,
    title: "Rest & Refresh",
    description:
      "Enjoy a snack and rest for 10–15 minutes. Your body recovers quickly.",
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Save up to 3 Lives",
    description: "One donation can help multiple patients in need.",
  },
  {
    icon: ShieldCheck,
    title: "Free Health Checkup",
    description: "Every donation includes a basic health screening.",
  },
  {
    icon: Award,
    title: "Certificate of Appreciation",
    description: "Receive a digital certificate for your contribution.",
  },
  {
    icon: Clock,
    title: "Only Takes 30 Minutes",
    description: "From registration to rest — quick and easy.",
  },
];

export default function BecomeADonorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pt-10 pb-6 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-12">
              <div className="max-w-xl">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Real people. Real impact.
                </p>
                <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.08]">
                  Become a Donor.{" "}
                  <span className="text-primary">Be a Lifesaver.</span>
                </h1>
                <p className="mt-5 max-w-md text-base text-text-secondary sm:text-lg">
                  Your one donation can give someone a second chance at life.
                  Join thousands of heroes and be the reason for a healthier,
                  happier tomorrow.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <BecomeDonorCTA size="lg" />
                  <Link href="#process">
                    <Button variant="secondary" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[16/11] max-h-[440px] overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)] lg:aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80"
                    alt="Blood donor giving blood"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Eligibility
              </p>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                Who can <span className="text-primary">donate?</span>
              </h2>
              <p className="mt-3 text-sm text-text-secondary sm:text-base">
                Blood donation is safe for most healthy adults. Here's what you
                need to know before you donate.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Can donate */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-light text-green">
                    <CheckCircle2 className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-navy">
                    You can donate if:
                  </h3>
                </div>
                <ul className="space-y-3">
                  {eligibility.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-text-secondary">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-navy">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cannot donate */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <AlertCircle className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-navy">
                    Please wait if:
                  </h3>
                </div>
                <ul className="space-y-3">
                  {disqualifiers.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-text-secondary"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                The process
              </p>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                Simple. Safe. <span className="text-primary">Life-saving.</span>
              </h2>
              <p className="mt-3 text-sm text-text-secondary sm:text-base">
                A safe, simple, and quick process that can save multiple lives.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                        <Icon className="h-7 w-7" aria-hidden />
                      </span>
                      <span className="text-3xl font-bold text-border">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-navy">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Why donate
              </p>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                More than just <span className="text-primary">giving blood</span>
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-navy">
                        {b.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-secondary">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-deep via-primary to-primary-deep px-8 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
              <Heart
                className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 text-white/5 sm:h-52 sm:w-52"
                fill="currentColor"
                aria-hidden
              />
              <Heart
                className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 text-white/5 sm:h-56 sm:w-56"
                fill="currentColor"
                aria-hidden
              />

              <div className="relative mx-auto max-w-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  Ready to save lives?
                </p>
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Your journey as a hero starts here.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm text-white/90 sm:text-base">
                  Register now — it takes less than 2 minutes. Once approved,
                  you'll be notified when someone near you needs your blood
                  group.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <BecomeDonorCTA size="lg" variant="light" />
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-white hover:bg-white/10"
                    >
                      Contact Us
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}