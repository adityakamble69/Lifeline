"use client";

import * as React from "react";
import {
  Search,
  Send,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  User,
  MoreVertical,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Phone as PhoneIcon,
  Video,
  Users,
  Plus,
  RefreshCw,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import {
  getAdminConversations,
  getAdminConversation,
  sendAdminMessage,
  markConversationRead,
  getMessageContact,
  formatRelativeTime,
  type ConversationListItem,
  type ChatMessage,
  type ContactDetails,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initialConversations: ConversationListItem[];
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("");
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday =
    d.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminMessagesClient({
  token,
  initialConversations,
}: Props) {
  const [conversations, setConversations] = React.useState(
    initialConversations,
  );
  const [activeId, setActiveId] = React.useState<string | null>(
    initialConversations[0]?.id ?? null,
  );
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [contact, setContact] = React.useState<ContactDetails | null>(null);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [showContact, setShowContact] = React.useState(true);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const otherUser = activeConversation?.other_user ?? null;

  const filteredConversations = React.useMemo(() => {
    if (!search.trim()) return conversations;
    const s = search.toLowerCase();
    return conversations.filter(
      (c) =>
        (c.other_user?.name ?? "").toLowerCase().includes(s) ||
        (c.last_message?.body ?? "").toLowerCase().includes(s),
    );
  }, [conversations, search]);

  // Load messages when active changes
  const loadConversation = React.useCallback(
    async (conversationId: string) => {
      setLoadingMessages(true);
      const res = await getAdminConversation(token, conversationId);
      if (res.success) {
        setMessages(res.data.messages);
        // Mark as read
        await markConversationRead(token, conversationId);
        // Update unread in list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, unread_count: 0 } : c,
          ),
        );
      }
      setLoadingMessages(false);
    },
    [token],
  );

  React.useEffect(() => {
    if (activeId) {
      void loadConversation(activeId);
      // Load contact
      if (otherUser) {
        void getMessageContact(token, otherUser.id).then((res) => {
          if (res.success) setContact(res.data.contact);
        });
      }
    }
  }, [activeId, loadConversation, token, otherUser]);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeId) return;
    setSending(true);
    const body = draft.trim();
    setDraft("");
    const res = await sendAdminMessage(token, activeId, body);
    setSending(false);

    if (res.success) {
      setMessages((prev) => [...prev, res.data.message]);
      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                last_message: {
                  body,
                  sent_at: res.data.message.sent_at,
                  sender_id: res.data.message.sender_id,
                  is_mine: true,
                },
              }
            : c,
        ),
      );
    } else {
      setDraft(body); // restore on failure
    }
  };

  const handleRefresh = async () => {
    const res = await getAdminConversations(token);
    if (res.success) setConversations(res.data.conversations);
  };

  // Group messages by day
  const messagesByDay = React.useMemo(() => {
    const groups: { day: string; messages: ChatMessage[] }[] = [];
    for (const msg of messages) {
      const day = formatDay(msg.sent_at);
      const last = groups[groups.length - 1];
      if (last && last.day === day) {
        last.messages.push(msg);
      } else {
        groups.push({ day, messages: [msg] });
      }
    }
    return groups;
  }, [messages]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Communication
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Messages
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Connect with donors, recipients, volunteers and team members.
              Build a stronger, healthier community together.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Refresh
          </Button>
        </div>
      </section>

      {/* Main chat layout */}
      <div className="grid gap-4 lg:grid-cols-[300px_1fr_300px] lg:gap-5">
        {/* Left: conversation list */}
        <aside className="flex h-[calc(100vh-320px)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
          {/* Search */}
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                aria-hidden
              />
              <input
                suppressHydrationWarning
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="h-10 w-full rounded-[10px] border border-border bg-background pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-secondary">
                No conversations found.
              </div>
            ) : (
              <ul className="flex flex-col">
                {filteredConversations.map((c) => {
                  const active = c.id === activeId;
                  const name = c.other_user?.name ?? "Unknown";
                  return (
                    <li key={c.id}>
                      <button
                        suppressHydrationWarning
                        type="button"
                        onClick={() => setActiveId(c.id)}
                        className={cn(
                          "flex w-full items-start gap-3 border-l-2 p-3 text-left transition-colors",
                          active
                            ? "border-primary bg-primary-light/40"
                            : "border-transparent hover:bg-background",
                        )}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                          {initials(name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-navy">
                              {name}
                            </p>
                            {c.last_message && (
                              <span className="shrink-0 text-[10px] text-text-secondary">
                                {formatRelativeTime(c.last_message.sent_at)}
                              </span>
                            )}
                          </div>
                          {c.last_message && (
                            <p
                              className={cn(
                                "mt-0.5 truncate text-xs",
                                c.unread_count > 0
                                  ? "font-medium text-navy"
                                  : "text-text-secondary",
                              )}
                            >
                              {c.last_message.is_mine && (
                                <span className="text-text-secondary">You: </span>
                              )}
                              {c.last_message.body}
                            </p>
                          )}
                        </div>
                        {c.unread_count > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                            {c.unread_count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Center: chat thread */}
        <div className="flex h-[calc(100vh-320px)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
          {!activeId || !activeConversation ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" aria-hidden />}
                title="No conversation selected"
                description="Pick a conversation from the left to start chatting."
              />
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-border p-3 sm:p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                  {initials(otherUser?.name ?? "?")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">
                    {otherUser?.name ?? "Unknown"}
                  </p>
                  <p className="truncate text-[11px] text-text-secondary">
                    {otherUser?.email ?? ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    suppressHydrationWarning
                    type="button"
                    className="rounded-lg p-2 text-text-secondary hover:bg-background hover:text-primary"
                    aria-label="More"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 space-y-4 overflow-y-auto bg-background/40 p-4"
              >
                {loadingMessages && messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                    Loading messages…
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                    No messages yet. Say hi 👋
                  </div>
                ) : (
                  messagesByDay.map((group) => (
                    <div key={group.day} className="space-y-3">
                      <div className="flex items-center justify-center">
                        <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary shadow-sm">
                          {group.day}
                        </span>
                      </div>
                      {group.messages.map((msg) => (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          senderName={
                            msg.is_mine
                              ? "You"
                              : otherUser?.name ?? "Unknown"
                          }
                        />
                      ))}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="border-t border-border p-3">
                <div className="flex items-end gap-2">
                  <button
                    suppressHydrationWarning
                    type="button"
                    className="rounded-lg p-2 text-text-secondary hover:bg-background hover:text-primary"
                    aria-label="Attach"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <textarea
                    suppressHydrationWarning
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="max-h-32 min-h-[40px] flex-1 resize-none rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    suppressHydrationWarning
                    type="button"
                    className="rounded-lg p-2 text-text-secondary hover:bg-background hover:text-primary"
                    aria-label="Emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSend}
                    loading={sending}
                    disabled={!draft.trim()}
                    className="gap-1.5 !h-10 !px-3"
                  >
                    <Send className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                <p className="mt-1.5 text-[10px] text-text-secondary">
                  Press <kbd className="rounded bg-background px-1 py-0.5 font-mono">Enter</kbd> to send,{" "}
                  <kbd className="rounded bg-background px-1 py-0.5 font-mono">Shift + Enter</kbd> for new line.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right: contact details */}
        <aside className="hidden h-[calc(100vh-320px)] min-h-[500px] flex-col overflow-y-auto rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] lg:flex">
          {!contact ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState
                icon={<Info className="h-6 w-6" aria-hidden />}
                title="No contact selected"
                description="Choose a conversation to view contact details."
              />
            </div>
          ) : (
            <>
              {/* Contact header */}
              <div className="border-b border-border p-5 text-center">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-xl font-bold text-primary">
                  {initials(contact.name)}
                </span>
                <p className="mt-3 text-base font-semibold text-navy">
                  {contact.name}
                </p>
                <div className="mt-1 flex justify-center">
                  <Badge tone="success">Verified</Badge>
                </div>
              </div>

              {/* Contact details */}
              <div className="border-b border-border p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Contact Details
                </p>
                <ul className="flex flex-col gap-3">
                  {contact.phone && (
                    <ContactRow
                      icon={<Phone className="h-4 w-4" aria-hidden />}
                      label="Phone"
                      value={contact.phone}
                    />
                  )}
                  {contact.email && (
                    <ContactRow
                      icon={<Mail className="h-4 w-4" aria-hidden />}
                      label="Email"
                      value={contact.email}
                    />
                  )}
                  <ContactRow
                    icon={<User className="h-4 w-4" aria-hidden />}
                    label="Role"
                    value={contact.role}
                  />
                  <ContactRow
                    icon={<User className="h-4 w-4" aria-hidden />}
                    label="Joined"
                    value={new Date(contact.created_at).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  />
                </ul>
              </div>

              {/* Quick actions */}
              <div className="border-b border-border p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Quick Actions
                </p>
                <div className="flex flex-col gap-2">
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <PhoneIcon className="h-3.5 w-3.5" aria-hidden />
                        Start Call
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start gap-2"
                    disabled
                  >
                    <Video className="h-3.5 w-3.5" aria-hidden />
                    Video Call
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start gap-2"
                    disabled
                  >
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    Add to Group
                  </Button>
                </div>
              </div>

              {/* Emergency */}
              <div className="p-5">
                <div className="flex gap-3 rounded-2xl border border-primary-light bg-primary-light/40 p-3">
                  <MessageSquare
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <p className="text-[11px] leading-relaxed text-navy">
                    For urgent blood requests, prefer calling directly. Chat
                    may not be immediate.
                  </p>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// ─── Message bubble ─────────────────────────────────────────────────────────
function MessageBubble({
  message,
  senderName,
}: {
  message: ChatMessage;
  senderName: string;
}) {
  const isMine = message.is_mine;
  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isMine ? "justify-end" : "justify-start",
      )}
    >
      {!isMine && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
          {initials(senderName)}
        </span>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm sm:max-w-[65%]",
          isMine
            ? "rounded-tr-sm bg-primary text-white"
            : "rounded-tl-sm bg-surface text-navy",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-[10px]",
            isMine ? "text-white/70" : "text-text-secondary",
          )}
        >
          <span>{formatTime(message.sent_at)}</span>
          {isMine && (
            <>
              {message.read_at ? (
                <CheckCheck className="h-3 w-3" aria-label="Read" />
              ) : (
                <Check className="h-3 w-3" aria-label="Sent" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Contact row ────────────────────────────────────────────────────────────
function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs font-medium text-navy">
          {value}
        </p>
      </div>
    </li>
  );
}