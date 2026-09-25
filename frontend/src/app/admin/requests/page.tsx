import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminRequests } from "@/lib/api";
import { AdminRequestsClient } from "./AdminRequestsClient";

export const metadata: Metadata = {
  title: "Emergency Requests — Lifeline Admin",
};

export default async function AdminRequestsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminRequests(token, { page: 1, pageSize: 20 });

  const initial = res.success
    ? res.data
    : {
        requests: [],
        pagination: { page: 1, page_size: 20, total: 0, total_pages: 1 },
        counts: {
          total: 0,
          pending: 0,
          verified: 0,
          in_progress: 0,
          fulfilled: 0,
          rejected: 0,
          critical: 0,
        },
      };

  return <AdminRequestsClient token={token} initial={initial} />;
}