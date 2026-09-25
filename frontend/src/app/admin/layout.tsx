import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AdminLayout } from "@/components/layout";

// The real access-control gate for everything under /admin. src/proxy.ts only
// pre-redirects signed-out users as a perf optimization — this check is what
// actually protects the route (see the createRouteMatcher migration guide).
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");
  if (sessionClaims?.metadata?.role !== "admin") redirect("/dashboard");

  return <AdminLayout>{children}</AdminLayout>;
}
