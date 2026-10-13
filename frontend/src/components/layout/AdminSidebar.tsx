"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tent,
  ClipboardList,
  Users,
  HeartHandshake,
  Droplets,
  Siren,
  ShieldCheck,
  MessageSquare,
  Bell,
  BarChart3,
  Download,
  Building2,
  UserCog,
  Settings,
  X,
  Droplet,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};
type NavGroup = { title?: string; items: NavItem[] };

const groups: NavGroup[] = [
  { items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Camp Management",
    items: [
      { href: "/admin/camps", label: "Manage Camps", icon: Tent },
      { href: "/admin/camps/registrations", label: "Registrations", icon: ClipboardList },
      { href: "/admin/camps/volunteers", label: "Volunteers", icon: HeartHandshake },
      { href: "/admin/camps/feedback", label: "Camp Feedback", icon: MessageSquare },
    ],
  },
  {
    title: "Donor Management",
    items: [
      { href: "/admin/donors", label: "Donors", icon: Users },
      { href: "/admin/donor-approvals", label: "Donor Approvals", icon: ShieldCheck },
      { href: "/admin/inventory", label: "Blood Inventory", icon: Droplets },
    ],
  },
  {
    title: "Request Management",
    items: [
      { href: "/admin/requests", label: "Emergency Requests", icon: Siren },
      { href: "/admin/requests/verifications", label: "Request Verifications", icon: ShieldCheck },
    ],
  },
  {
    title: "Communication",
    items: [
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Reports",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/export", label: "Export Data", icon: Download },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/organization", label: "Organization Profile", icon: Building2 },
      { href: "/admin/team", label: "Team Members", icon: UserCog },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavLinks({
  pathname,
  mounted,
  onNavigate,
}: {
  pathname: string;
  mounted: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-6">
      {groups.map((group, i) => (
        <div key={i}>
          {group.title && (
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              {group.title}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = mounted && isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    suppressHydrationWarning
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-l-[3px] border-transparent px-3 py-2.5 text-sm font-medium text-navy transition-colors",
                      "hover:bg-background",
                      active && "border-primary bg-primary-light text-primary",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-[72px] items-center gap-2 border-b border-border px-5 font-bold text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Droplet className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg">Lifeline</span>
        </div>
        <NavLinks pathname={pathname} mounted={mounted} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-navy-dark/40 transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
          aria-hidden
        />
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-[280px] flex-col bg-surface shadow-[var(--shadow-elevated)] transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-[72px] items-center justify-between border-b border-border px-5">
            <div className="flex items-center gap-2 font-bold text-navy">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                <Droplet className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-lg">Lifeline</span>
            </div>
            <button
              suppressHydrationWarning
              aria-label="Close menu"
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-background"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <NavLinks pathname={pathname} mounted={mounted} onNavigate={onClose} />
        </aside>
      </div>
    </>
  );
}