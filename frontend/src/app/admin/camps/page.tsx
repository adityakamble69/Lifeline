import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminCamps } from "@/lib/api";
import { AdminCampsClient } from "./AdminCampsClient";

export const metadata: Metadata = {
  title: "Manage Camps — Lifeline Admin",
};

export default async function AdminCampsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminCamps(token, { page: 1, pageSize: 20 });

  const initial = res.success
    ? res.data
    : {
        camps: [],
        pagination: {
          page: 1,
          page_size: 20,
          total: 0,
          total_pages: 1,
        },
      };

  return <AdminCampsClient token={token} initial={initial} />;
}