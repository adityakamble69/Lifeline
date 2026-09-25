"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

interface Props {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function ProfileTabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="border-b border-border">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              suppressHydrationWarning
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-navy",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}