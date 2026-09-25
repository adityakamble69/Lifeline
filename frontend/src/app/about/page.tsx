import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Users,
  Droplet,
  Building2,
  Megaphone,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About — Lifeline",
  description:
    "Learn about Lifeline's mission to make blood donation easier, safer, and more impactful for everyone.",
};

const stats = [
  { value: "10,000+", label: "Registered Donors" },
  { value: "8,500+", label: "Lives Saved" },
  { value: "250+", label: "Blood Donation Camps" },
  { value: "120+", label: "Hospitals Connected" },
];

const values = [
  {
    icon: Heart,
    title: "Humanity First",
    description: "Every decision we make starts with the people we serve.",
    accent: "bg-primary-light text-primary",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We grow because our community grows — together.",
    accent: "bg-blue-light text-blue",
  },
  {
    icon: Target,
    title: "Trust & Transparency",
    description: "Every donor and request is verified. No shortcuts.",
    accent: "bg-green-light text-green",
  },
  {
    icon: Eye,
    title: "Safety & Responsibility",
    description: "Privacy, dignity, and safety are non-negotiable.",
    accent: "bg-purple-light text-purple",
  },
];

const whatWeDo = [
  {
    icon: Users,
    title: "Connect Donors with People in Need",
    description:
      "A privacy-aware matching system that brings the right donor to the right patient.",
  },
  {
    icon: Calendar,
    title: "Organize Blood Donation Camps",
    description:
      "End-to-end tools for organizers to run camps — from publishing to feedback.",
  },
  {
    icon: Building2,
    title: "Collaborate with Hospitals & NGOs",
    description:
      "Working with trusted medical and community partners across the region.",
  },
  {
    icon: Megaphone,
    title: "Spread Awareness",
    description:
      "Sharing the message that one donation can save up to three lives.",
  },
];

const timeline = [
  {
    year: "2024",
    title: "A student initiative",
    description:
      "Lifeline began with a simple belief — no one should suffer due to the unavailability of blood.",
  },
  {
    year: "2025",
    title: "Growing community",
    description:
      "Partnered with local hospitals and NGOs. Crossed 1,000 verified donors in Nagpur.",
  },
  {
    year: "2026",
    title: "Platform launch",
    description:
      "Launched the digital Lifeline platform to bring donors, requesters, and organizers together.",
  },
  {
    year: "Today",
    title: "10,000+ strong",
    description:
      "A growing community of donors, volunteers, and partners across the region — and beyond.",
  },
];

export default function AboutPage() {
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
                  About Lifeline
                </p>
                <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-[52px] lg:leading-[1.08]">
                  People helping people for a{" "}
                  <span className="text-primary">brighter tomorrow.</span>
                </h1>
                <p className="mt-5 max-w-md text-base text-text-secondary sm:text-lg">
                  Lifeline is a community-driven platform that connects blood
                  donors, recipients, and organizations to make blood donation
                  easier, safer, and more impactful.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/become-a-donor">
                    <Button variant="primary" size="lg" className="gap-2">
                      Join Our Journey
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="secondary" size="lg">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/3] max-h-[440px] overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)]">
                  <Image
                    src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80"
                    alt="Community members joining hands"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -right-3 hidden rounded-2xl bg-primary px-5 py-4 text-white shadow-[var(--shadow-elevated)] sm:block">
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    A stronger community
                  </p>
                  <p className="text-lg font-bold leading-tight">
                    A healthier tomorrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-[1440px] overflow-hidden rounded-3xl bg-gradient-to-r from-primary-deep via-primary to-primary-deep px-6 py-9 sm:px-10 lg:px-12">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-white">
                  <p className="text-2xl font-bold sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs text-white/80 sm:text-sm">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Our Story
              </p>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                A simple idea, a{" "}
                <span className="text-primary">greater impact.</span>
              </h2>
              <p className="mt-3 text-sm text-text-secondary sm:text-base">
                Lifeline started with a simple belief — no one should suffer
                due to the unavailability of blood.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
                >
                  <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary">
                    {item.year}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Our Mission, Vision & Values
              </p>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                What drives us.{" "}
                <span className="text-primary">What we stand for.</span>
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Target className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-navy">
                    Our Mission
                  </h3>
                </div>
                <p className="text-sm text-text-secondary sm:text-base">
                  To ensure easy, reliable, and safe access to blood for
                  everyone in need — using technology to remove friction,
                  increase trust, and save lives.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-light text-blue">
                    <Eye className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-navy">
                    Our Vision
                  </h3>
                </div>
                <p className="text-sm text-text-secondary sm:text-base">
                  A future where no life is lost due to the lack of blood
                  donors — and every community is empowered to help.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${v.accent}`}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-navy">
                      {v.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-secondary">
                      {v.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                What we do
              </p>
              <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                Working towards a{" "}
                <span className="text-primary">healthier community.</span>
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {whatWeDo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-5 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary"
                      aria-hidden
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-secondary">
                        {item.description}
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
                  Be a part of the change
                </p>
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Together, we can save more lives.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm text-white/90 sm:text-base">
                  The smallest act of kindness can make the biggest difference.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/become-a-donor">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="gap-2 border-transparent bg-surface text-primary hover:bg-primary-light"
                    >
                      Become a Donor
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-white hover:bg-white/10"
                    >
                      Partner With Us
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