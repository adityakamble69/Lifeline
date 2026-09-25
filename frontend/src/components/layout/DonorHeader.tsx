"use client";

import * as React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function DonorHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-[72px] items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <button
        suppressHydrationWarning
        aria-label="Open menu"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-navy hover:bg-background lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          suppressHydrationWarning
          type="search"
          placeholder="Search camps, blood requests, or locations..."
          className="h-10 w-full rounded-[10px] border border-border bg-background pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          suppressHydrationWarning
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-text-secondary hover:bg-background hover:text-text-primary"
        >
          <Bell className="h-5 w-5" />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"
            aria-hidden
          />
        </button>
        <div className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-background">
          <UserButton
            appearance={{ elements: { avatarBox: "h-8 w-8" } }}
            userProfileMode="modal"
          />
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold text-navy">Blood Donor</p>
            <p className="text-[10px] text-text-secondary">View account</p>
          </div>
        </div>
      </div>
    </header>
  );
}