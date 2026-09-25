import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBloodRequests } from "@/lib/api";
import { DonorRequestsClient } from "./DonorRequestsClient";

export const metadata: Metadata = {
  title: "Emergency Requests — Lifeline",
};

export default async function EmergencyRequestsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const res = await getBloodRequests();
  const requests = res.success ? res.data.requests : [];

  return <DonorRequestsClient initialRequests={requests} />;
}