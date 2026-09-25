import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyNotifications } from "@/lib/api";
import { NotificationsClient } from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications — Lifeline",
};

export default async function NotificationsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getMyNotifications(token);
  const initial = res.success
    ? res.data
    : { notifications: [], unread_count: 0, total: 0 };

  return <NotificationsClient token={token} initial={initial} />;
}