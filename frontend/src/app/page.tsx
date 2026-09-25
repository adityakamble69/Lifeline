import type { Metadata } from "next";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import {
  Hero,
  ImpactStats,
  CoreFeatures,
  UpcomingCampsPreview,
  EmergencyBanner,
  MissionSection,
  FinalCTA,
} from "@/components/landing";

export const metadata: Metadata = {
  title: "Lifeline — Give Blood. Save Lives.",
  description:
    "Connect with verified blood donors, find donation camps, and help save lives in your community.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />
      <main className="flex-1">
        <Hero />
        <ImpactStats />
        <CoreFeatures />
        <UpcomingCampsPreview />
        <EmergencyBanner />
        <MissionSection />
        <FinalCTA />
      </main>
      <PublicFooter />
    </div>
  );
}