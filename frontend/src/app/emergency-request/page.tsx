import type { Metadata } from "next";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { EmergencyRequestForm } from "@/components/emergency";

export const metadata: Metadata = {
  title: "Emergency Blood Request — Lifeline",
  description:
    "Submit an urgent blood request and get help from verified donors near you.",
};

export default function EmergencyRequestPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-gradient-to-br from-primary-light/60 via-background to-background">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Emergency Request
            </p>
            <h1 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              Urgent Help.{" "}
              <span className="text-primary">Real Impact.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
              Every minute matters in an emergency. Submit your blood request
              and we&apos;ll notify nearby donors and NGOs immediately.
            </p>
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <EmergencyRequestForm />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}