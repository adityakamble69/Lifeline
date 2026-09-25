"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Droplet,
  MessageSquare,
  Settings,
  AlertCircle,
  Info,
  CheckCheck,
  BellRing,
  Mail,
  CheckCircle2,
  Siren,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/utils";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  formatRelativeTime,
  type MeNotificationFull,
} from "@/lib/api";

interface Props {
  token: string;
  initial: {
    notifications: MeNotificationFull[];
    unread_count: number;
    total: number;
  };
}

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "emergency", label: "Emergency" },
  { id: "camp", label: "Camps" },
  { id: "donation", label: "Donations" },
  { id: "message", label: "Messages" },
  { id: "system", label: "System" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const typeMeta: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; accent: string }
> = {
  emergency: { icon: Siren, accent: "bg-primary-light text-primary" },
  camp: { icon: Calendar, accent: "bg-blue-light text-blue" },
  donation: { icon: Heart, accent: "bg-green-light text-green" },
  message: { icon: MessageSquare, accent: "bg-purple-light text-purple" },
  verification: { icon: CheckCircle2, accent: "bg-green-light text-green" },
  system: { icon: Settings, accent: "bg-orange-light text-orange" },
  default: { icon: Bell, accent: "bg-background text-text-secondary" },
};

function getMeta(type: string) {
  return typeMeta[type] ?? typeMeta.default;
}

export function NotificationsClient({ token, initial }: Props) {
  const [notifications, setNotifications] = React.useState(
    initial.notifications,
  );
  const [activeTab, setActiveTab] = React.useState<TabId>("all");
  const [loading, setLoading] = React.useState(false);
  const [markingAll, setMarkingAll] = React.useState(false);

  // Preferences state — persisted in localStorage only for now
  const [prefs, setPrefs] = React.useState({
    emergency: true,
    camp: true,
    messages: true,
    system: false,
    email: true,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const refresh = React.useCallback(
    async (filter?: TabId) => {
      setLoading(true);
      const apiFilter =
        filter === "unread" ? "unread" : undefined;
      const res = await getMyNotifications(token, apiFilter);
      if (res.success) setNotifications(res.data.notifications);
      setLoading(false);
    },
    [token],
  );

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    void refresh(tab);
  };

  const markOne = async (id: string) => {
    // optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    const res = await markNotificationRead(token, id);
    if (!res.success) {
      // revert on failure
      void refresh(activeTab);
    }
  };

  const markAll = async () => {
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    const res = await markAllNotificationsRead(token);
    if (!res.success) void refresh(activeTab);
    setMarkingAll(false);
  };

  // Filter displayed notifications
  const displayed = React.useMemo(() => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread")
      return notifications.filter((n) => !n.is_read);
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  const tabCount = (id: TabId) => {
    if (id === "all") return notifications.length;
    if (id === "unread") return unreadCount;
    return notifications.filter((n) => n.type === id).length;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Notifications
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Stay Updated.{" "}
              <span className="text-primary">Save Lives.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Get real-time updates about donation requests, camp registrations,
              messages, and more.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;Small Notifications,
              <br />
              Big Impact&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: list */}
        <div className="flex flex-col gap-4">
          {/* Tabs */}
          <Card className="!p-0">
            <div className="flex items-center gap-1 overflow-x-auto border-b border-border p-2">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                const count = tabCount(tab.id);
                return (
                  <button
                    key={tab.id}
                    suppressHydrationWarning
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                      active
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:bg-background hover:text-navy",
                    )}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={cn(
                          "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          active
                            ? "bg-white/25 text-white"
                            : tab.id === "unread"
                              ? "bg-primary text-white"
                              : "bg-background text-text-secondary",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              {unreadCount > 0 && (
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={markAll}
                  disabled={markingAll}
                  className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-primary-light"
                >
                  <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="p-2 sm:p-3">
              {loading ? (
                <div className="p-6 text-center text-sm text-text-secondary">
                  Loading…
                </div>
              ) : displayed.length === 0 ? (
                <EmptyState
                  icon={<Bell className="h-6 w-6" aria-hidden />}
                  title="No notifications here"
                  description={
                    activeTab === "unread"
                      ? "You're all caught up!"
                      : "New updates will appear here."
                  }
                />
              ) : (
                <ul className="flex flex-col">
                  {displayed.map((n) => {
                    const meta = getMeta(n.type);
                    const Icon = meta.icon;
                    return (
                      <li
                        key={n.id}
                        className={cn(
                          "group flex items-start gap-3 rounded-2xl p-3 transition-colors sm:p-4",
                          !n.is_read
                            ? "bg-primary-light/30"
                            : "hover:bg-background",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            meta.accent,
                          )}
                          aria-hidden
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <p className="text-sm font-semibold text-navy">
                              {n.title}
                            </p>
                            {!n.is_read && (
                              <span
                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                                aria-label="Unread"
                              />
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                            {n.message}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-[11px] text-text-secondary">
                              {formatRelativeTime(n.created_at)}
                            </span>
                            {!n.is_read && (
                              <button
                                suppressHydrationWarning
                                type="button"
                                onClick={() => markOne(n.id)}
                                className="text-[11px] font-semibold text-primary hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </Card>
        </div>

        {/* Right: settings */}
        <div className="flex flex-col gap-5">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Settings
                className="h-4 w-4 text-text-secondary"
                aria-hidden
              />
              <h2 className="text-base font-semibold text-navy">
                Notification Settings
              </h2>
            </div>
            <p className="text-xs text-text-secondary">
              Choose what updates you want to receive.
            </p>

            <ul className="mt-4 flex flex-col gap-3">
              <ToggleRow
                icon={<Siren className="h-4 w-4" aria-hidden />}
                label="Emergency Requests"
                checked={prefs.emergency}
                onChange={(v) => setPrefs({ ...prefs, emergency: v })}
              />
              <ToggleRow
                icon={<Calendar className="h-4 w-4" aria-hidden />}
                label="Camp Updates"
                checked={prefs.camp}
                onChange={(v) => setPrefs({ ...prefs, camp: v })}
              />
              <ToggleRow
                icon={<MessageSquare className="h-4 w-4" aria-hidden />}
                label="Messages"
                checked={prefs.messages}
                onChange={(v) => setPrefs({ ...prefs, messages: v })}
              />
              <ToggleRow
                icon={<Settings className="h-4 w-4" aria-hidden />}
                label="System Notifications"
                checked={prefs.system}
                onChange={(v) => setPrefs({ ...prefs, system: v })}
              />
              <ToggleRow
                icon={<Mail className="h-4 w-4" aria-hidden />}
                label="Email Notifications"
                checked={prefs.email}
                onChange={(v) => setPrefs({ ...prefs, email: v })}
              />
            </ul>
          </Card>

          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
            <div>
              <p className="text-xs font-semibold text-navy">
                Stay Informed, Stay Ready
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                Turn on notifications so you never miss a chance to save a life.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-primary-light bg-primary-light/40 p-4">
            <BellRing
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden
            />
            <div>
              <p className="text-xs font-semibold text-navy">
                Kindness Never Sleeps
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                Even a small notification can lead to a big change.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-text-secondary">
          {icon}
        </span>
        <span className="text-sm font-medium text-navy">{label}</span>
      </div>
      <button
        suppressHydrationWarning
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </li>
  );
}