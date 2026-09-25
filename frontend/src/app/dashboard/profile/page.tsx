import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/api";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile — Lifeline",
};

export default async function ProfilePage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getMyProfile(token);
  if (!res.success) redirect("/dashboard");

  return <ProfileClient initialProfile={res.data} />;
}