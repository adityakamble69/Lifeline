import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminRegistrations } from "@/lib/api";
import { AdminRegistrationsClient } from "./AdminRegistrationsClient";

export const metadata: Metadata = {
  title: "Camp Registrations — Lifeline Admin",
};

export default async function AdminRegistrationsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminRegistrations(token, { page: 1, pageSize: 20 });

  const initial = res.success
    ? res.data
    : {
        registrations: [],
        pagination: { page: 1, page_size: 20, total: 0, total_pages: 1 },
        counts: { total: 0, confirmed: 0, pending: 0, cancelled: 0, attended: 0 },
        camp_options: [],
      };

  return <AdminRegistrationsClient token={token} initial={initial} />;
}