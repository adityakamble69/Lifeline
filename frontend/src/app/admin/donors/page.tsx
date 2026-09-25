import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminDonors } from "@/lib/api";
import { DonorsClient } from "./DonorsClient";

export const metadata: Metadata = {
  title: "Donors — Lifeline Admin",
};

export default async function DonorsPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminDonors(token, { page: 1, pageSize: 20 });

  const initial = res.success
    ? res.data
    : {
        donors: [],
        pagination: {
          page: 1,
          page_size: 20,
          total: 0,
          total_pages: 1,
        },
      };

  return <DonorsClient token={token} initial={initial} />;
}