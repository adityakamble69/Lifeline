import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getCamps,
  getMyUpcomingCamps,
  formatCampDateParts,
  formatCampTimeRange,
  type CampListItem,
} from "@/lib/api";
import { RegisterForCampClient } from "./RegisterForCampClient";

export const metadata: Metadata = {
  title: "Register for Camp — Lifeline",
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=800&q=80",
];

function pickImage(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) | 0;
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

function statusForCard(s: string) {
  if (s === "registration_open" || s === "open")
    return "registration_open" as const;
  if (s === "completed") return "completed" as const;
  if (s === "cancelled") return "cancelled" as const;
  return "upcoming" as const;
}

export default async function RegisterForCampPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const [campsRes, mineRes] = await Promise.all([
    getCamps(),
    getMyUpcomingCamps(token),
  ]);

  const camps: CampListItem[] = campsRes.success ? campsRes.data.camps : [];
  const registeredIds = new Set(
    mineRes.success
      ? mineRes.data.camps
          .map((r) => r.camps?.id)
          .filter((id): id is string => Boolean(id))
      : [],
  );

  const cards = camps.map((c) => {
    const { day, month, dateLabel } = formatCampDateParts(c.start_at);
    const time = formatCampTimeRange(c.start_at, c.end_at);
    return {
      id: c.id,
      title: c.title,
      organizer: c.organizer,
      date: dateLabel,
      day,
      month,
      venue: `${c.venue}, ${c.city}`,
      time,
      description: c.description ?? "",
      capacity: `${c.registered} / ${c.capacity} registered`,
      tags: ["All Blood Groups", "Free Health Checkup"],
      status: statusForCard(c.status),
      image: pickImage(c.id),
      isRegistered: registeredIds.has(c.id),
    };
  });

  return <RegisterForCampClient camps={cards} />;
}