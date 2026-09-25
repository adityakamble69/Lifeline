import type { Metadata } from "next";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { CampDetail } from "@/components/camps/CampDetail";

export const metadata: Metadata = {
  title: "Camp Details — Lifeline",
  description:
    "View camp details and register as a blood donor for upcoming camps.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CampDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        <CampDetail campId={id} />
      </main>

      <PublicFooter />
    </div>
  );
}