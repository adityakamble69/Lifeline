"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Droplet,
  Calendar,
  ClipboardList,
  Heart,
  Siren,
  Bell,
  Settings,
  X,
  Droplets,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/find-blood", label: "Find Blood", icon: Droplet },
  { href: "/dashboard/camps", label: "Nearby Camps", icon: Calendar },
  { href: "/dashboard/register-for-camp", label: "Register for Camp", icon: ClipboardList },
  { href: "/dashboard/donations", label: "My Donations", icon: Heart },
  { href: "/dashboard/emergency-requests", label: "Emergency Requests", icon: Siren },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-2 border-b border-border px-5 font-bold text-navy">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <Droplets className="h-5 w-5" aria-hidden />
        </span>
        <div className="leading-tight">
          <p className="text-sm">Lifeline</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
            Blood Donor
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-l-[3px] border-transparent px-3 py-2.5 text-sm font-medium text-navy transition-colors",
                    "hover:bg-background",
                    active && "border-primary bg-primary-light text-primary",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Give Blood card */}
        <div className="mt-6 rounded-2xl bg-primary-light p-4 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-primary">
            <Heart className="h-6 w-6" fill="currentColor" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-navy">
            Give Blood
            <br />
            Give Hope
            <br />
            Give Life
          </p>
          <Link
            href="/dashboard/find-blood"
            onClick={onNavigate}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Find Donors
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        {/* Need help */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-light text-blue">
            <Headphones className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-navy">Need Help?</p>
            <p className="text-[11px] text-text-secondary">
              Contact Support
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
}

export function DonorSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-[var(--sidebar-width)] shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
        <SidebarContent />
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
            "absolute left-0 top-0 h-full w-[280px] bg-surface shadow-[var(--shadow-elevated)] transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-3 top-5 z-10 rounded-lg p-1.5 text-text-secondary hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>
          <SidebarContent onNavigate={onClose} />
        </aside>
      </div>
    </>
  );
}