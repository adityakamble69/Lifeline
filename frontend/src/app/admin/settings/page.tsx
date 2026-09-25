import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/api";
import { AdminSettingsClient } from "./AdminSettingsClient";

export const metadata: Metadata = {
  title: "Settings — Lifeline Admin",
};

export default async function AdminSettingsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getMyProfile(token);
  if (!res.success) redirect("/dashboard");

  return <AdminSettingsClient token={token} profile={res.data} />;
}