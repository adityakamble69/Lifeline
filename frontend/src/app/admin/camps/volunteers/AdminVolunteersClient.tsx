"use client";

import * as React from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  UserPlus,
  UserCheck,
  UserX,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  MessageSquare,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input, Select } from "@/components/ui/Input";
import {
  getAdminVolunteers,
  updateAdminVolunteer,
  formatRelativeTime,
  type AdminVolunteerItem,
  type AdminVolunteersResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminVolunteersResponse;
}

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
] as const;

const AVAILABILITY_OPTIONS = [
  "Flexible",
  "Weekends",
  "Weekdays",
  "On-call",
];

const statusTone: Record<string, BadgeTone> = {
  active: "success",
  inactive: "neutral",
  pending: "warning",
};

export function AdminVolunteersClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState<
    (typeof STATUS_TABS)[number]["id"]
  >("all");
  const [page, setPage] = React.useState(1);

  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Edit modal
  const [editTarget, setEditTarget] = React.useState<AdminVolunteerItem | null>(
    null,
  );
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const load = React.useCallback(
    async (opts?: { page?: number }) => {
      setLoading(true);
      setError(null);
      const res = await getAdminVolunteers(token, {
        search: debouncedSearch || undefined,
        role: roleFilter,
        status: statusFilter,
        page: opts?.page ?? page,
        pageSize: 20,
      });
      if (!res.success) {
        setError(res.error.message);
      } else {
        setData(res.data);
      }
      setLoading(false);
    },
    [token, debouncedSearch, roleFilter, statusFilter, page],
  );

  React.useEffect(() => {
    setPage(1);
    void load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, roleFilter, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  const handleToggleStatus = async (vol: AdminVolunteerItem) => {
    const nextStatus = vol.status === "active" ? "inactive" : "active";
    setLoading(true);
    const res = await updateAdminVolunteer(token, vol.id, {
      status: nextStatus,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    void load({ page });
  };

  const { stats, pagination } = data;
  const roleOptions = ["all", ...stats.role_options];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Volunteers
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Manage <span className="text-primary">Volunteers</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Our volunteers make the difference. Manage, engage, and organize
              volunteers for a stronger, healthier community.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void load({ page })}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                aria-hidden
              />
              Refresh
            </Button>
            <Button variant="primary" size="sm" className="gap-2" disabled>
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              Add Volunteer
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={stats.total}
          label="Total Volunteers"
          accent="primary"
        />
        <KpiCard
          icon={<UserCheck className="h-5 w-5" aria-hidden />}
          value={stats.active}
          label="Active Volunteers"
          accent="green"
        />
        <KpiCard
          icon={<UserX className="h-5 w-5" aria-hidden />}
          value={stats.inactive}
          label="Inactive"
          accent="orange"
        />
        <KpiCard
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          value={Object.keys(stats.roles).length}
          label="Distinct Roles"
          accent="blue"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Search
                </span>
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
                    placeholder="Search by name, email, phone..."
                    className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Role
                </span>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r === "all" ? "All Roles" : r}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              {STATUS_TABS.map((t) => {
                const active = statusFilter === t.id;
                const count =
                  t.id === "all"
                    ? stats.total
                    : t.id === "active"
                      ? stats.active
                      : stats.inactive;
                return (
                  <button
                    key={t.id}
                    suppressHydrationWarning
                    type="button"
                    onClick={() => setStatusFilter(t.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "bg-primary text-white"
                        : "border border-border bg-surface text-navy hover:border-primary hover:text-primary",
                    )}
                  >
                    {t.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                        active
                          ? "bg-white/25 text-white"
                          : "bg-background text-text-secondary",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              <button
                suppressHydrationWarning
                type="button"
                onClick={resetFilters}
                className="ml-auto text-xs font-semibold text-text-secondary hover:text-primary"
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <ErrorState
              title="Couldn't load volunteers"
              description={error}
              onRetry={() => void load({ page })}
            />
          )}

          {/* Empty */}
          {!error && data.volunteers.length === 0 && !loading && (
            <EmptyState
              icon={<Users className="h-6 w-6" aria-hidden />}
              title="No volunteers found"
              description="Try adjusting filters or add a new volunteer."
              action={{ label: "Reset Filters", onClick: resetFilters }}
            />
          )}

          {/* Table */}
          {!error && data.volunteers.length > 0 && (
            <>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse text-sm">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Volunteer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Availability
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Joined
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.volunteers.map((vol, i) => {
                        const globalIndex =
                          (pagination.page - 1) * pagination.page_size + i + 1;
                        return (
                          <tr
                            key={vol.id}
                            className="transition-colors hover:bg-background/60"
                          >
                            <td className="px-4 py-3 text-xs text-text-secondary">
                              {globalIndex}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                                  {vol.name
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((s) => s.charAt(0).toUpperCase())
                                    .join("")}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-navy">
                                    {vol.name}
                                  </p>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                                    {vol.email && (
                                      <span className="inline-flex items-center gap-1">
                                        <Mail className="h-3 w-3" aria-hidden />
                                        <span className="truncate max-w-[140px]">
                                          {vol.email}
                                        </span>
                                      </span>
                                    )}
                                    {vol.phone && (
                                      <span className="inline-flex items-center gap-1">
                                        <Phone className="h-3 w-3" aria-hidden />
                                        {vol.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {vol.role ? (
                                <Badge tone="info">{vol.role}</Badge>
                              ) : (
                                <span className="text-xs text-text-secondary">
                                  —
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-navy">
                                {vol.availability}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-text-secondary">
                              {formatRelativeTime(vol.joined_at)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                tone={statusTone[vol.status] ?? "neutral"}
                              >
                                {vol.status.charAt(0).toUpperCase() +
                                  vol.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  suppressHydrationWarning
                                  type="button"
                                  onClick={() => setEditTarget(vol)}
                                  className="rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-primary"
                                  aria-label="Edit"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  suppressHydrationWarning
                                  type="button"
                                  onClick={() => handleToggleStatus(vol)}
                                  className="rounded-lg p-1.5 text-text-secondary hover:bg-background hover:text-primary"
                                  aria-label="Toggle status"
                                >
                                  {vol.status === "active" ? (
                                    <UserX className="h-4 w-4" />
                                  ) : (
                                    <UserCheck className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-text-secondary">
                  Showing{" "}
                  <span className="font-semibold text-navy">
                    {(pagination.page - 1) * pagination.page_size + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-navy">
                    {Math.min(
                      pagination.page * pagination.page_size,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-navy">
                    {pagination.total}
                  </span>{" "}
                  volunteers
                </p>

                <div className="flex items-center gap-2">
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => {
                      const next = Math.max(1, page - 1);
                      setPage(next);
                      void load({ page: next });
                    }}
                    disabled={pagination.page <= 1 || loading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-navy transition-colors hover:bg-background disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-navy">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => {
                      const next = Math.min(pagination.total_pages, page + 1);
                      setPage(next);
                      void load({ page: next });
                    }}
                    disabled={
                      pagination.page >= pagination.total_pages || loading
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-navy transition-colors hover:bg-background disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Role distribution */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-base font-semibold text-navy">
              Volunteer Roles
            </h3>
            {Object.keys(stats.roles).length === 0 ? (
              <p className="text-xs text-text-secondary">
                No volunteers with assigned roles yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {Object.entries(stats.roles)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([role, count]) => {
                    const max = Math.max(...Object.values(stats.roles));
                    const pct = Math.round((count / max) * 100);
                    return (
                      <li key={role}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-navy">{role}</span>
                          <span className="text-text-secondary">{count}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-base font-semibold text-navy">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="justify-start gap-2" disabled>
                <UserPlus className="h-3.5 w-3.5" aria-hidden />
                Invite Volunteer
              </Button>
              <Button variant="secondary" size="sm" className="justify-start gap-2" disabled>
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                Send Message
              </Button>
              <Button variant="secondary" size="sm" className="justify-start gap-2" disabled>
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                Assign to Camp
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
            <p className="text-[11px] leading-relaxed text-navy">
              Volunteers are community members who help run blood donation
              camps — from registration to medical support to awareness.
            </p>
          </div>
        </aside>
      </div>

      {/* Edit modal */}
      <EditVolunteerModal
        target={editTarget}
        onClose={() => {
          setEditTarget(null);
          setSaveError(null);
        }}
        token={token}
        roleOptions={stats.role_options}
        saving={saving}
        saveError={saveError}
        setSaving={setSaving}
        setSaveError={setSaveError}
        onSaved={() => {
          setEditTarget(null);
          void load({ page });
        }}
      />
    </div>
  );
}

// ─── Edit modal ─────────────────────────────────────────────────────────────
function EditVolunteerModal({
  target,
  onClose,
  token,
  roleOptions,
  saving,
  saveError,
  setSaving,
  setSaveError,
  onSaved,
}: {
  target: AdminVolunteerItem | null;
  onClose: () => void;
  token: string;
  roleOptions: string[];
  saving: boolean;
  saveError: string | null;
  setSaving: (v: boolean) => void;
  setSaveError: (v: string | null) => void;
  onSaved: () => void;
}) {
  const [values, setValues] = React.useState({
    role: "",
    availability: "Flexible",
    skills: "",
    city: "",
    state: "",
    status: "active",
  });

  React.useEffect(() => {
    if (!target) return;
    setValues({
      role: target.role ?? "",
      availability: target.availability ?? "Flexible",
      skills: target.skills ?? "",
      city: target.city ?? "",
      state: target.state ?? "",
      status: target.status ?? "active",
    });
  }, [target]);

  const handleSave = async () => {
    if (!target) return;
    setSaving(true);
    setSaveError(null);
    const res = await updateAdminVolunteer(token, target.id, values);
    setSaving(false);
    if (!res.success) {
      setSaveError(res.error.message);
      return;
    }
    onSaved();
  };

  const allRoleOptions = Array.from(
    new Set([...roleOptions, values.role].filter(Boolean)),
  );

  return (
    <Modal
      open={Boolean(target)}
      onClose={onClose}
      title="Edit Volunteer"
      description={target ? `Update details for ${target.name}` : undefined}
      className="!max-w-lg"
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </>
      }
    >
      {saveError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <span>{saveError}</span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Role" htmlFor="v-role">
          <Select
            id="v-role"
            value={values.role}
            onChange={(e) =>
              setValues({ ...values, role: e.target.value })
            }
          >
            <option value="">Select role</option>
            {allRoleOptions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Availability" htmlFor="v-avail">
          <Select
            id="v-avail"
            value={values.availability}
            onChange={(e) =>
              setValues({ ...values, availability: e.target.value })
            }
          >
            {AVAILABILITY_OPTIONS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Status" htmlFor="v-status">
          <Select
            id="v-status"
            value={values.status}
            onChange={(e) =>
              setValues({ ...values, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </Select>
        </FormField>

        <FormField label="City" htmlFor="v-city">
          <Input
            id="v-city"
            value={values.city}
            onChange={(e) =>
              setValues({ ...values, city: e.target.value })
            }
            placeholder="e.g. Nagpur"
          />
        </FormField>

        <FormField label="State" htmlFor="v-state" className="sm:col-span-2">
          <Input
            id="v-state"
            value={values.state}
            onChange={(e) =>
              setValues({ ...values, state: e.target.value })
            }
            placeholder="e.g. Maharashtra"
          />
        </FormField>

        <FormField
          label="Skills"
          htmlFor="v-skills"
          help="Comma-separated list"
          className="sm:col-span-2"
        >
          <Input
            id="v-skills"
            value={values.skills}
            onChange={(e) =>
              setValues({ ...values, skills: e.target.value })
            }
            placeholder="e.g. First aid, Logistics, Photography"
          />
        </FormField>
      </div>
    </Modal>
  );
}