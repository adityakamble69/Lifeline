"use client";

import * as React from "react";
import { translate, type Language } from "@/lib/translations";

export type Theme = "light" | "dark" | "system";
export type PrimaryColor = "red" | "blue" | "green" | "purple" | "orange" | "pink";

interface AppState {
  theme: Theme;
  primaryColor: PrimaryColor;
  language: Language;
  setTheme: (t: Theme) => void;
  setPrimaryColor: (c: PrimaryColor) => void;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
}

const AppContext = React.createContext<AppState | null>(null);

const STORAGE_KEY = "lifeline.app.settings";

function readStored(): {
  theme: Theme;
  primaryColor: PrimaryColor;
  language: Language;
} {
  if (typeof window === "undefined") {
    return { theme: "light", primaryColor: "red", language: "en" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { theme: "light", primaryColor: "red", language: "en" };
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme ?? "light",
      primaryColor: parsed.primaryColor ?? "red",
      language: parsed.language ?? "en",
    };
  } catch {
    return { theme: "light", primaryColor: "red", language: "en" };
  }
}

function writeStored(patch: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, ...patch }),
    );
  } catch {
    // ignore
  }
}

function applyThemeToDOM(theme: Theme, primaryColor: PrimaryColor) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
  root.dataset.color = primaryColor;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Read initial from localStorage once on mount
  const [theme, setThemeState] = React.useState<Theme>("light");
  const [primaryColor, setColorState] = React.useState<PrimaryColor>("red");
  const [language, setLangState] = React.useState<Language>("en");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const stored = readStored();
    setThemeState(stored.theme);
    setColorState(stored.primaryColor);
    setLangState(stored.language);
    applyThemeToDOM(stored.theme, stored.primaryColor);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for system theme changes when in "system" mode
  React.useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeToDOM("system", primaryColor);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, primaryColor]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyThemeToDOM(t, primaryColor);
    writeStored({ theme: t });
  };

  const setPrimaryColor = (c: PrimaryColor) => {
    setColorState(c);
    applyThemeToDOM(theme, c);
    writeStored({ primaryColor: c });
  };

  const setLanguage = (l: Language) => {
    setLangState(l);
    writeStored({ language: l });
  };

  const t = React.useCallback(
    (key: string) => translate(language, key),
    [language],
  );

  const value: AppState = {
    theme,
    primaryColor,
    language,
    setTheme,
    setPrimaryColor,
    setLanguage,
    t,
  };

  // Prevent flash of default content — render nothing before mount? No, keep SSR content.
  // Theme is applied via inline script in <head>, so DOM already correct.
  // But language might differ — accept 1-frame delay.
  void mounted;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useTranslation() {
  return useApp().t;
}