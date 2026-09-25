import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRecentExports } from "@/lib/api";
import { AdminExportClient } from "./AdminExportClient";

export const metadata: Metadata = {
  title: "Export Data — Lifeline Admin",
};

export default async function AdminExportPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getRecentExports(token);
  const initial = res.success ? res.data : { exports: [] };

  return <AdminExportClient token={token} initial={initial} />;
}