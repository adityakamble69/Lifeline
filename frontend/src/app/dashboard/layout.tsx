import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DonorLayout } from "@/components/layout";

// The real access-control gate for everything under /dashboard. src/proxy.ts
// only pre-redirects signed-out users as a perf optimization.
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");
  if (sessionClaims?.metadata?.role === "admin") redirect("/admin");

  return <DonorLayout>{children}</DonorLayout>;
}
