import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getDashboardStats,
  getDashboardActivity,
  type DashboardStats,
  type DashboardActivity,
} from "@/lib/api";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard — Lifeline",
};

export default async function AdminDashboardPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const [statsRes, activityRes] = await Promise.all([
    getDashboardStats(token),
    getDashboardActivity(token),
  ]);

  const initialStats: DashboardStats = statsRes.success
    ? statsRes.data.stats
    : {
        donors: { total: 0, pending: 0, approved: 0, rejected: 0 },
        camps: { total: 0, upcoming: 0, completed: 0, cancelled: 0 },
        requests: { total: 0, pending: 0, verified: 0, fulfilled: 0, critical: 0 },
        registrations: { total: 0 },
      };

  const initialActivity: DashboardActivity = activityRes.success
    ? activityRes.data
    : {
        pending_approvals: [],
        upcoming_camps: [],
        recent_requests: [],
        recent_registrations: [],
      };

  return (
    <AdminDashboardClient
      stats={initialStats}
      activity={initialActivity}
    />
  );
}