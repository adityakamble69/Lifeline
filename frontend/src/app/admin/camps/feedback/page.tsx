import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminFeedback } from "@/lib/api";
import { AdminFeedbackClient } from "./AdminFeedbackClient";

export const metadata: Metadata = {
  title: "Camp Feedback — Lifeline Admin",
};

export default async function AdminFeedbackPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminFeedback(token, { page: 1, pageSize: 20 });

  const initial = res.success
    ? res.data
    : {
        feedback: [],
        pagination: { page: 1, page_size: 20, total: 0, total_pages: 1 },
        stats: {
          total: 0,
          average: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          camp_options: [],
        },
      };

  return <AdminFeedbackClient token={token} initial={initial} />;
}