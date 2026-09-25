import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DonorFindBloodClient } from "./DonorFindBloodClient";

export const metadata: Metadata = {
  title: "Find Blood — Lifeline",
};

export default async function DonorFindBloodPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <DonorFindBloodClient />;
}