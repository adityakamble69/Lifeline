import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminTeam } from "@/lib/api";
import { AdminTeamClient } from "./AdminTeamClient";

export const metadata: Metadata = {
  title: "Team Members — Lifeline Admin",
};

export default async function AdminTeamPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminTeam(token);

  const initial = res.success
    ? res.data
    : {
        members: [],
        counts: {
          total: 0,
          owner: 0,
          admin: 0,
          core_team: 0,
          volunteer: 0,
          active: 0,
        },
      };

  return <AdminTeamClient token={token} initial={initial} />;
}