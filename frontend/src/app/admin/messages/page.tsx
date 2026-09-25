import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminConversations } from "@/lib/api";
import { AdminMessagesClient } from "./AdminMessagesClient";

export const metadata: Metadata = {
  title: "Messages — Lifeline Admin",
};

export default async function AdminMessagesPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminConversations(token);
  const initial = res.success ? res.data.conversations : [];

  return <AdminMessagesClient token={token} initialConversations={initial} />;
}