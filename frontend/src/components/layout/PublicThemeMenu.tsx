"use client";

import * as React from "react";
import { Sun, Moon, Monitor, Globe, Check, Palette } from "lucide-react";
import { useApp } from "@/components/providers";
import { LANGUAGE_OPTIONS } from "@/lib/translations";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

export function PublicThemeMenu() {
  const { theme, setTheme, language, setLanguage, t } = useApp();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const themes: { id: ThemeOption; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "light", label: t("theme.light"), icon: Sun },
    { id: "dark", label: t("theme.dark"), icon: Moon },
    { id: "system", label: t("theme.system"), icon: Monitor },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("theme.settings")}
        aria-expanded={open}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-navy transition-colors",
          "hover:bg-background hover:text-primary",
          open && "bg-background text-primary",
        )}
      >
        <Palette className="h-[18px] w-[18px]" aria-hidden />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
          {/* Theme section */}
          <div className="border-b border-border p-3">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              {t("theme.title")}
            </p>
            <ul className="flex flex-col gap-0.5">
              {themes.map((th) => {
                const Icon = th.icon;
                const active = theme === th.id;
                return (
                  <li key={th.id}>
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-light text-primary"
                          : "text-navy hover:bg-background",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="flex-1">{th.label}</span>
                      {active && (
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Language section */}
          <div className="p-3">
            <p className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              <Globe className="h-3 w-3" aria-hidden />
              {t("theme.language")}
            </p>
            <ul className="flex flex-col gap-0.5">
              {LANGUAGE_OPTIONS.map((l) => {
                const active = language === l.id;
                return (
                  <li key={l.id}>
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => setLanguage(l.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-light text-primary"
                          : "text-navy hover:bg-background",
                      )}
                    >
                      <span className="flex-1">{l.label}</span>
                      {active && (
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}