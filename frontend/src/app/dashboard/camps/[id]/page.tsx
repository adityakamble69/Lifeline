import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getCampById,
  getMyUpcomingCamps,
  formatCampDateParts,
  formatCampTimeRange,
} from "@/lib/api";
import { DonorCampDetailClient } from "./DonorCampDetailClient";

export const metadata: Metadata = {
  title: "Camp Details — Lifeline",
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1600&q=80",
];

function pickImage(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) | 0;
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DonorCampDetailPage({ params }: PageProps) {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const { id } = await params;

  const [campRes, mineRes] = await Promise.all([
    getCampById(id),
    getMyUpcomingCamps(token),
  ]);

  if (!campRes.success) redirect("/dashboard/camps");

  const camp = campRes.data.camp;
  const isRegistered = mineRes.success
    ? mineRes.data.camps.some((r) => r.camps?.id === camp.id)
    : false;

  const { day, month, dateLabel } = formatCampDateParts(camp.start_at);
  const time = formatCampTimeRange(camp.start_at, camp.end_at);

  return (
    <DonorCampDetailClient
      camp={{
        id: camp.id,
        title: camp.title,
        organizer: camp.organizer,
        date: dateLabel,
        day,
        month,
        venue: camp.venue,
        address: `${camp.city}, ${camp.state}`,
        time,
        description: camp.description ?? "",
        capacity: camp.capacity,
        registered: camp.registered,
        status: camp.status,
        image: pickImage(camp.id),
      }}
      isRegistered={isRegistered}
    />
  );
}