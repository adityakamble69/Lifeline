import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyProfile, getMyDonations } from "@/lib/api";
import { DonationsClient } from "./DonationsClient";

export const metadata: Metadata = {
  title: "My Donations — Lifeline",
};

export default async function DonationsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const [profileRes, donationsRes] = await Promise.all([
    getMyProfile(token),
    getMyDonations(token),
  ]);

  if (!profileRes.success) redirect("/dashboard");

  const donations = donationsRes.success ? donationsRes.data.donations : [];

  return (
    <DonationsClient
      profile={profileRes.data}
      donations={donations}
    />
  );
}