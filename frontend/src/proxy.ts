import { clerkMiddleware } from "@clerk/nextjs/server";

// The real auth/role gates live on the resources themselves — see
// src/app/admin/layout.tsx and src/app/dashboard/layout.tsx. Clerk deprecated
// createRouteMatcher()-based gating here because Middleware path matching can
// diverge from how Next.js actually resolves routes (and Server Functions are
// called by ID, not by path, so they were never reliably covered by it).
// See: https://clerk.com/docs/guides/development/upgrading/upgrade-guides/migrate-from-create-route-matcher
//
// This is kept only as a perf optimization: it sends signed-out users to
// sign-in a little earlier, before the page even renders. It is NOT itself
// an auth guarantee — removing it changes nothing about access control.
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isGatedPath =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (!isGatedPath) return;

  const { isAuthenticated, redirectToSignIn } = await auth();
  if (!isAuthenticated) return redirectToSignIn({ returnBackUrl: req.url });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
