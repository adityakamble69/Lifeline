import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminAnalytics } from "@/lib/api";
import { AdminAnalyticsClient } from "./AdminAnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics — Lifeline Admin",
};

export default async function AdminAnalyticsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminAnalytics(token);

  const empty = {
    kpis: {
      total_donors: 0,
      approved_donors: 0,
      total_donations: 0,
      total_requests: 0,
      total_camps: 0,
      active_volunteers: 0,
      lives_saved: 0,
    },
    donation_trends: [],
    request_trends: [],
    donor_growth: [],
    blood_group_distribution: [],
    request_status_distribution: [],
    camps_overview: [],
    top_cities: [],
    impact: {
      lives_impacted: 0,
      camps_organized: 0,
      request_fulfillment_rate: 0,
      active_volunteers: 0,
    },
  };

  const initial = res.success ? res.data : empty;

  return <AdminAnalyticsClient initial={initial} />;
}