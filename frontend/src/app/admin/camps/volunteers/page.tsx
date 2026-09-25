import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminVolunteers } from "@/lib/api";
import { AdminVolunteersClient } from "./AdminVolunteersClient";

export const metadata: Metadata = {
  title: "Volunteers — Lifeline Admin",
};

export default async function AdminVolunteersPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminVolunteers(token, { page: 1, pageSize: 20 });

  const initial = res.success
    ? res.data
    : {
        volunteers: [],
        pagination: { page: 1, page_size: 20, total: 0, total_pages: 1 },
        stats: {
          total: 0,
          active: 0,
          inactive: 0,
          roles: {} as Record<string, number>,
          role_options: [],
        },
      };

  return <AdminVolunteersClient token={token} initial={initial} />;
}