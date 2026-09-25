"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Droplet } from "lucide-react";
import {
  SignInButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { PublicThemeMenu } from "./PublicThemeMenu";
import { useTranslation } from "@/components/providers";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const t = useTranslation();
  const [open, setOpen] = React.useState(false);

  const links = [
    { href: "/", label: t("public.home") },
    { href: "/find-blood", label: t("public.findBlood") },
    { href: "/camps", label: t("public.camps") },
    { href: "/become-a-donor", label: t("public.becomeDonor") },
    { href: "/about", label: t("public.about") },
    { href: "/contact", label: t("public.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Droplet className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg">Lifeline</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-2 lg:flex">
          <PublicThemeMenu />

          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                {t("public.login")}
              </Button>
            </SignInButton>
            <Link href="/become-a-donor">
              <Button variant="primary" size="sm">
                {t("public.becomeDonor")}
              </Button>
            </Link>
          </Show>

          <Show when="signed-in">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                {t("public.dashboard")}
              </Button>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "h-9 w-9" } }}
              userProfileMode="modal"
            />
          </Show>
        </div>

        {/* Mobile toggle */}
        <button
          suppressHydrationWarning
          className="rounded-lg p-2 text-navy lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-surface transition-[max-height] duration-200 lg:hidden",
          open ? "max-h-[600px]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Primary mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy hover:bg-background"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-3 border-t border-border pt-3">
            <Show when="signed-out">
              <div className="flex flex-col gap-2 px-3">
                <SignInButton mode="modal">
                  <Button variant="secondary" size="sm" className="w-full">
                    {t("public.login")}
                  </Button>
                </SignInButton>
                <Link href="/become-a-donor" onClick={() => setOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    {t("public.becomeDonor")}
                  </Button>
                </Link>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3 px-3">
                <UserButton
                  appearance={{ elements: { avatarBox: "h-10 w-10" } }}
                  userProfileMode="modal"
                />
                <div className="flex-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold text-navy hover:text-primary"
                  >
                    {t("public.dashboard")}
                  </Link>
                  <p className="text-xs text-text-secondary">
                    Manage your donations
                  </p>
                </div>
              </div>
            </Show>
          </div>

          {/* Theme picker at bottom */}
          <div className="mt-3 flex items-center justify-between border-t border-border px-3 pt-3">
            <span className="text-xs font-medium text-text-secondary">
              {t("theme.settings")}
            </span>
            <PublicThemeMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}