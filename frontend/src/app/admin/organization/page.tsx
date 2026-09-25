import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminOrganization } from "@/lib/api";
import { AdminOrganizationClient } from "./AdminOrganizationClient";

export const metadata: Metadata = {
  title: "Organization Profile — Lifeline Admin",
};

export default async function AdminOrganizationPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const res = await getAdminOrganization(token);

  if (!res.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-base font-semibold text-navy">
          Couldn&apos;t load organization
        </p>
        <p className="text-sm text-text-secondary">
          {res.error.message}
        </p>
      </div>
    );
  }

  return <AdminOrganizationClient token={token} initial={res.data} />;
}