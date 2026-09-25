import type { Metadata } from "next";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { CampsResults } from "@/components/camps";

export const metadata: Metadata = {
  title: "Blood Donation Camps — Lifeline",
  description:
    "Discover upcoming blood donation camps near you and register as a donor.",
};

export default function CampsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        {/* Page header */}
        <section className="border-b border-border bg-gradient-to-br from-primary-light/60 via-background to-background">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Find a Camp Near You
            </p>
            <h1 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              Blood Donation{" "}
              <span className="text-primary">Camps</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
              Be a part of life-saving events in your city. Join a blood
              donation camp and make a difference.
            </p>
          </div>
        </section>

        {/* Filters + Results */}
        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <CampsResults />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}