"use client";

import * as React from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  RefreshCw,
  UserPlus,
  Shield,
  UserCog,
  HeartHandshake,
  User,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Crown,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input, Select } from "@/components/ui/Input";
import {
  getAdminTeam,
  addAdminTeamMember,
  updateAdminTeamMember,
  removeAdminTeamMember,
  formatRelativeTime,
  type AdminTeamMember,
  type AdminTeamResponse,
  type TeamRole,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: AdminTeamResponse;
}

const ROLES: { value: TeamRole; label: string; tone: BadgeTone }[] = [
  { value: "owner", label: "Owner", tone: "error" },
  { value: "admin", label: "Admin", tone: "primary" as BadgeTone },
  { value: "core_team", label: "Core Team", tone: "info" },
  { value: "volunteer", label: "Volunteer", tone: "purple" },
];

const ROLE_FILTERS = [
  { id: "all", label: "All Roles" },
  { id: "owner", label: "Owner" },
  { id: "admin", label: "Admin" },
  { id: "core_team", label: "Core Team" },
  { id: "volunteer", label: "Volunteer" },
] as const;

type RoleFilter = (typeof ROLE_FILTERS)[number]["id"];

function roleMeta(role: string) {
  return ROLES.find((r) => r.value === role) ?? ROLES[3];
}

function roleIcon(role: string) {
  if (role === "owner") return Crown;
  if (role === "admin") return Shield;
  if (role === "core_team") return UserCog;
  if (role === "volunteer") return HeartHandshake;
  return User;
}

export function AdminTeamClient({ token, initial }: Props) {
  const [data, setData] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>("all");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Modals
  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<AdminTeamMember | null>(
    null,
  );
  const [removeTarget, setRemoveTarget] =
    React.useState<AdminTeamMember | null>(null);

  const [saving, setSaving] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getAdminTeam(token, {
      search: debouncedSearch || undefined,
      role: roleFilter,
    });
    if (!res.success) {
      setError(res.error.message);
    } else {
      setData(res.data);
    }
    setLoading(false);
  }, [token, debouncedSearch, roleFilter]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

  const { counts } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Our Team
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Team <span className="text-primary">Members</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Meet the people behind Lifeline. Manage roles, permissions, and
              access for your organization.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void load()}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                aria-hidden
              />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setModalError(null);
                setAddOpen(true);
              }}
              className="gap-2"
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              Add Member
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={counts.total}
          label="Total Members"
          accent="primary"
        />
        <KpiCard
          icon={<Shield className="h-5 w-5" aria-hidden />}
          value={counts.admin + counts.owner}
          label="Organizers"
          accent="green"
        />
        <KpiCard
          icon={<UserCog className="h-5 w-5" aria-hidden />}
          value={counts.core_team}
          label="Core Team"
          accent="blue"
        />
        <KpiCard
          icon={<HeartHandshake className="h-5 w-5" aria-hidden />}
          value={counts.volunteer}
          label="Volunteers"
          accent="orange"
        />
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Search Members
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
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {ROLE_FILTERS.map((r) => {
            const active = roleFilter === r.id;
            const count =
              r.id === "all"
                ? counts.total
                : (counts[r.id as keyof typeof counts] as number) ?? 0;
            return (
              <button
                key={r.id}
                suppressHydrationWarning
                type="button"
                onClick={() => setRoleFilter(r.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-navy hover:border-primary hover:text-primary",
                )}
              >
                {r.label}
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
            Reset
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <ErrorState
          title="Couldn't load team"
          description={error}
          onRetry={() => void load()}
        />
      )}

      {/* Empty */}
      {!error && data.members.length === 0 && !loading && (
        <EmptyState
          icon={<Users className="h-6 w-6" aria-hidden />}
          title="No team members found"
          description="Add your first team member to get started."
          action={{ label: "Add Member", onClick: () => setAddOpen(true) }}
        />
      )}

      {/* Members list */}
      {!error && data.members.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={() => {
                setModalError(null);
                setEditTarget(member);
              }}
              onRemove={() => {
                setModalError(null);
                setRemoveTarget(member);
              }}
            />
          ))}
        </div>
      )}

      {/* Add member modal */}
      <AddMemberModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        token={token}
        saving={saving}
        setSaving={setSaving}
        error={modalError}
        setError={setModalError}
        onSaved={() => {
          setAddOpen(false);
          void load();
        }}
      />

      {/* Edit member modal */}
      <EditMemberModal
        target={editTarget}
        onClose={() => setEditTarget(null)}
        token={token}
        saving={saving}
        setSaving={setSaving}
        error={modalError}
        setError={setModalError}
        onSaved={() => {
          setEditTarget(null);
          void load();
        }}
      />

      {/* Remove confirmation */}
      <RemoveMemberModal
        target={removeTarget}
        onClose={() => setRemoveTarget(null)}
        token={token}
        saving={saving}
        setSaving={setSaving}
        error={modalError}
        setError={setModalError}
        onRemoved={() => {
          setRemoveTarget(null);
          void load();
        }}
      />
    </div>
  );
}

// ─── Member card ────────────────────────────────────────────────────────────
function MemberCard({
  member,
  onEdit,
  onRemove,
}: {
  member: AdminTeamMember;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const role = roleMeta(member.role);
  const Icon = roleIcon(member.role);
  const isActive = member.status === "active";

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Avatar */}
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-base font-bold text-primary">
          {member.name
            .split(" ")
            .slice(0, 2)
            .map((s) => s.charAt(0).toUpperCase())
            .join("")}
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-navy">
              {member.name}
            </h3>
            <Badge tone={role.tone}>
              <Icon className="h-3 w-3" aria-hidden />
              {role.label}
            </Badge>
            <Badge tone={isActive ? "success" : "neutral"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
            {member.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" aria-hidden />
                {member.email}
              </span>
            )}
            {member.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" aria-hidden />
                {member.phone}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />
              Joined {formatRelativeTime(member.joined_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <Button variant="secondary" size="sm" onClick={onEdit} className="gap-1.5">
            <Edit3 className="h-3.5 w-3.5" aria-hidden />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="gap-1.5 text-primary hover:bg-primary-light"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Add member modal ───────────────────────────────────────────────────────
function AddMemberModal({
  open,
  onClose,
  token,
  saving,
  setSaving,
  error,
  setError,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  token: string;
  saving: boolean;
  setSaving: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
  onSaved: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<TeamRole>("core_team");

  React.useEffect(() => {
    if (open) {
      setEmail("");
      setRole("core_team");
      setError(null);
    }
  }, [open, setError]);

  const handleAdd = async () => {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await addAdminTeamMember(token, {
      email: email.trim(),
      role,
    });
    setSaving(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    onSaved();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Team Member"
      description="Add an existing Lifeline user to your organization."
      className="!max-w-md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleAdd}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Add Member
          </Button>
        </>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}
      <div className="grid gap-4">
        <FormField
          label="Email Address"
          htmlFor="team-email"
          required
          help="User must already have a Lifeline account"
        >
          <Input
            id="team-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@example.com"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Role" htmlFor="team-role" required>
          <Select
            id="team-role"
            value={role}
            onChange={(e) => setRole(e.target.value as TeamRole)}
          >
            <option value="core_team">Core Team — Full access to most features</option>
            <option value="admin">Admin — Full access including settings</option>
            <option value="volunteer">Volunteer — Limited access</option>
          </Select>
        </FormField>
      </div>
    </Modal>
  );
}

// ─── Edit member modal ──────────────────────────────────────────────────────
function EditMemberModal({
  target,
  onClose,
  token,
  saving,
  setSaving,
  error,
  setError,
  onSaved,
}: {
  target: AdminTeamMember | null;
  onClose: () => void;
  token: string;
  saving: boolean;
  setSaving: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
  onSaved: () => void;
}) {
  const [role, setRole] = React.useState<TeamRole>("core_team");
  const [status, setStatus] = React.useState("active");

  React.useEffect(() => {
    if (target) {
      setRole(target.role);
      setStatus(target.status);
      setError(null);
    }
  }, [target, setError]);

  const handleSave = async () => {
    if (!target) return;
    setSaving(true);
    setError(null);
    const res = await updateAdminTeamMember(token, target.id, { role, status });
    setSaving(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    onSaved();
  };

  return (
    <Modal
      open={Boolean(target)}
      onClose={onClose}
      title="Edit Member"
      description={target ? `Update role & status for ${target.name}` : undefined}
      className="!max-w-md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={saving}>
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
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}
      <div className="grid gap-4">
        <FormField label="Role" htmlFor="edit-role" required>
          <Select
            id="edit-role"
            value={role}
            onChange={(e) => setRole(e.target.value as TeamRole)}
          >
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="core_team">Core Team</option>
            <option value="volunteer">Volunteer</option>
          </Select>
        </FormField>
        <FormField label="Status" htmlFor="edit-status" required>
          <Select
            id="edit-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </Select>
        </FormField>
      </div>
    </Modal>
  );
}

// ─── Remove member modal ────────────────────────────────────────────────────
function RemoveMemberModal({
  target,
  onClose,
  token,
  saving,
  setSaving,
  error,
  setError,
  onRemoved,
}: {
  target: AdminTeamMember | null;
  onClose: () => void;
  token: string;
  saving: boolean;
  setSaving: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
  onRemoved: () => void;
}) {
  const handleRemove = async () => {
    if (!target) return;
    setSaving(true);
    setError(null);
    const res = await removeAdminTeamMember(token, target.id);
    setSaving(false);
    if (!res.success) {
      setError(res.error.message);
      return;
    }
    onRemoved();
  };

  return (
    <Modal
      open={Boolean(target)}
      onClose={onClose}
      title="Remove Team Member"
      description={
        target ? `Remove ${target.name} from your organization?` : undefined
      }
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            loading={saving}
            onClick={handleRemove}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Remove
          </Button>
        </>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}
      <p className="text-sm text-text-secondary">
        This member will lose access to your organization&apos;s dashboard
        immediately. They can be re-added later.
      </p>
    </Modal>
  );
}