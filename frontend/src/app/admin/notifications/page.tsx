import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminNotifications } from "@/lib/api";
import { AdminNotificationsClient } from "./AdminNotificationsClient";

export const metadata: Metadata = {
  title: "Notifications — Lifeline Admin",
};

export default async function AdminNotificationsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminNotifications(token, { page: 1, pageSize: 30 });

  const initial = res.success
    ? res.data
    : {
        notifications: [],
        pagination: { page: 1, page_size: 30, total: 0, total_pages: 1 },
        counts: { total: 0, unread: 0, by_type: {}, by_type_labeled: [] },
      };

  return <AdminNotificationsClient token={token} initial={initial} />;
}