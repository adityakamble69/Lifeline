"use client";

import * as React from "react";
import {
  Droplet,
  Search,
  MapPin,
  RefreshCw,
  AlertCircle,
  Clock,
  TrendingUp,
  Plus,
  Minus,
  ArrowRightLeft,
  Settings2,
  Activity,
  Calendar,
  Package,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, KpiCard } from "@/components/ui/Card";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input, Select, Textarea } from "@/components/ui/Input";
import {
  getAdminInventory,
  recordInventoryTransaction,
  formatRelativeTime,
  type InventoryItem,
  type InventoryOverview,
  type InventoryTransaction,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initialInventory: InventoryOverview;
  initialTransactions: InventoryTransaction[];
}

const BLOOD_GROUPS = ["Any", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const LOW_STOCK_THRESHOLD = 5;

type TxType = "add" | "usage" | "transfer" | "adjustment";

const txMeta: Record<TxType, { label: string; icon: React.ComponentType<{ className?: string }>; accent: string }> = {
  add: { label: "Add Units", icon: Plus, accent: "bg-green-light text-green" },
  usage: { label: "Use Units", icon: Minus, accent: "bg-primary-light text-primary" },
  transfer: { label: "Transfer", icon: ArrowRightLeft, accent: "bg-blue-light text-blue" },
  adjustment: { label: "Adjust", icon: Settings2, accent: "bg-orange-light text-orange" },
};

function unitsTone(units: number): BadgeTone {
  if (units === 0) return "error";
  if (units <= LOW_STOCK_THRESHOLD) return "warning";
  if (units <= 15) return "info";
  return "success";
}

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const days = Math.ceil((then - now) / (1000 * 60 * 60 * 24));
  return days;
}

export function AdminInventoryClient({
  token,
  initialInventory,
  initialTransactions,
}: Props) {
  const [inventory, setInventory] = React.useState(initialInventory);
  const [transactions, setTransactions] = React.useState(initialTransactions);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [bloodFilter, setBloodFilter] = React.useState("Any");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Transaction modal
  const [txTarget, setTxTarget] = React.useState<InventoryItem | null>(null);
  const [txType, setTxType] = React.useState<TxType>("add");
  const [txUnits, setTxUnits] = React.useState("");
  const [txNotes, setTxNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [txError, setTxError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const [invRes, txRes] = await Promise.all([
      getAdminInventory(token, {
        locationId: locationFilter,
        bloodGroup: bloodFilter,
        search: debouncedSearch || undefined,
      }),
      // Don't refetch transactions every filter change
      Promise.resolve(null),
    ]);
    if (!invRes.success) {
      setError(invRes.error.message);
    } else {
      setInventory(invRes.data);
    }
    if (txRes) {
      // no-op
    }
    setLoading(false);
  }, [token, locationFilter, bloodFilter, debouncedSearch]);

  const reloadTransactions = React.useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/admin/inventory/transactions?limit=20`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    if (data.success) setTransactions(data.data.transactions);
  }, [token]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const openTxModal = (item: InventoryItem, type: TxType = "add") => {
    setTxTarget(item);
    setTxType(type);
    setTxUnits("");
    setTxNotes("");
    setTxError(null);
  };

  const handleSaveTx = async () => {
    if (!txTarget) return;
    const units = Number(txUnits);
    if (!Number.isFinite(units) || units <= 0) {
      setTxError("Enter a valid number of units.");
      return;
    }

    setSaving(true);
    setTxError(null);

    const res = await recordInventoryTransaction(token, txTarget.id, {
      type: txType,
      units,
      notes: txNotes || undefined,
    });

    setSaving(false);

    if (!res.success) {
      setTxError(res.error.message);
      return;
    }

    setTxTarget(null);
    await Promise.all([load(), reloadTransactions()]);
  };

  const resetFilters = () => {
    setSearch("");
    setLocationFilter("all");
    setBloodFilter("Any");
  };

  const stats = inventory.stats;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Inventory
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Blood <span className="text-primary">Inventory</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
              Track blood stock across locations. Every transaction is logged
              for full auditability.
            </p>
          </div>
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
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Droplet className="h-5 w-5" aria-hidden />}
          value={stats.total_units}
          label="Total Units Available"
          accent="primary"
        />
        <KpiCard
          icon={<Package className="h-5 w-5" aria-hidden />}
          value={stats.total_groups}
          label="Blood Groups in Stock"
          accent="blue"
        />
        <KpiCard
          icon={<AlertCircle className="h-5 w-5" aria-hidden />}
          value={stats.low_stock}
          label={`Low Stock (≤${LOW_STOCK_THRESHOLD} units)`}
          accent="orange"
        />
        <KpiCard
          icon={<Clock className="h-5 w-5" aria-hidden />}
          value={stats.expiring_soon}
          label="Expiring in 30 Days"
          accent="green"
        />
      </section>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                placeholder="Search by location or group..."
                className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Location
            </span>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <select
                suppressHydrationWarning
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="all">All Locations</option>
                {inventory.locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Blood Group
            </span>
            <div className="relative">
              <Droplet
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                aria-hidden
              />
              <select
                suppressHydrationWarning
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {BLOOD_GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <button
          suppressHydrationWarning
          type="button"
          onClick={resetFilters}
          className="mt-4 text-xs font-semibold text-text-secondary hover:text-primary"
        >
          Reset filters
        </button>
      </div>

      {/* Error */}
      {error && (
        <ErrorState
          title="Couldn't load inventory"
          description={error}
          onRetry={() => void load()}
        />
      )}

      {/* Empty */}
      {!error && inventory.items.length === 0 && !loading && (
        <EmptyState
          icon={<Droplet className="h-6 w-6" aria-hidden />}
          title="No inventory found"
          description="Try adjusting filters or add inventory records."
          action={{ label: "Reset Filters", onClick: resetFilters }}
        />
      )}

      {/* Inventory grid */}
      {!error && inventory.items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.items.map((item) => {
            const days = daysUntil(item.expiry_date);
            return (
              <InventoryCard
                key={item.id}
                item={item}
                daysUntilExpiry={days}
                onAdd={() => openTxModal(item, "add")}
                onUse={() => openTxModal(item, "usage")}
                onTransfer={() => openTxModal(item, "transfer")}
              />
            );
          })}
        </div>
      )}

      {/* Transactions */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-text-secondary" aria-hidden />
          <h2 className="text-base font-semibold text-navy">
            Recent Transactions
          </h2>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-6 w-6" aria-hidden />}
            title="No transactions yet"
            description="Stock changes will appear here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((tx) => {
              const meta = txMeta[tx.transaction_type as TxType] ?? txMeta.adjustment;
              const Icon = meta.icon;
              const isPositive = tx.units > 0;
              return (
                <li
                  key={tx.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      meta.accent,
                    )}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy">
                        {tx.blood_group ?? "—"} · {tx.location_name ?? "—"}
                      </p>
                      <Badge tone={isPositive ? "success" : "error"}>
                        {isPositive ? "+" : ""}
                        {tx.units}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {meta.label}
                      {tx.notes ? ` · ${tx.notes}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-text-secondary">
                    {formatRelativeTime(tx.created_at)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Transaction modal */}
      <Modal
        open={Boolean(txTarget)}
        onClose={() => setTxTarget(null)}
        title={txMeta[txType].label}
        description={
          txTarget
            ? `${txTarget.blood_group} · ${txTarget.location_name}`
            : undefined
        }
        className="!max-w-md"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setTxTarget(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={saving}
              onClick={handleSaveTx}
            >
              Confirm
            </Button>
          </>
        }
      >
        {txError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {txError}
          </div>
        )}

        {txTarget && (
          <div className="mb-4 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-text-secondary">Current Stock</p>
                <p className="mt-0.5 text-2xl font-bold text-navy">
                  {txTarget.units_available} units
                </p>
              </div>
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold",
                  txTarget.units_available <= LOW_STOCK_THRESHOLD
                    ? "bg-orange-light text-orange"
                    : "bg-primary-light text-primary",
                )}
              >
                {txTarget.blood_group}
              </span>
            </div>
          </div>
        )}

        <div className="mb-4 grid grid-cols-4 gap-2">
          {(Object.keys(txMeta) as TxType[]).map((t) => {
            const meta = txMeta[t];
            const Icon = meta.icon;
            return (
              <button
                key={t}
                suppressHydrationWarning
                type="button"
                onClick={() => setTxType(t)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-xs font-semibold transition-colors",
                  txType === t
                    ? "border-primary bg-primary-light/40 text-navy"
                    : "border-border bg-surface text-text-secondary hover:border-primary/40",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {meta.label}
              </button>
            );
          })}
        </div>

        <FormField label="Units" htmlFor="tx-units" required>
          <Input
            id="tx-units"
            type="number"
            min={1}
            value={txUnits}
            onChange={(e) => setTxUnits(e.target.value)}
            placeholder="e.g. 5"
            autoFocus
          />
        </FormField>

        <FormField label="Notes" htmlFor="tx-notes" help="Optional">
          <Textarea
            id="tx-notes"
            value={txNotes}
            onChange={(e) => setTxNotes(e.target.value)}
            placeholder="e.g. Received from XYZ Camp"
            rows={2}
          />
        </FormField>
      </Modal>
    </div>
  );
}

// ─── Inventory card ─────────────────────────────────────────────────────────
function InventoryCard({
  item,
  daysUntilExpiry,
  onAdd,
  onUse,
  onTransfer,
}: {
  item: InventoryItem;
  daysUntilExpiry: number | null;
  onAdd: () => void;
  onUse: () => void;
  onTransfer: () => void;
}) {
  const tone = unitsTone(item.units_available);
  const isLow = item.units_available <= LOW_STOCK_THRESHOLD && item.units_available > 0;
  const isZero = item.units_available === 0;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]",
        isZero ? "border-error/40" : isLow ? "border-orange/40" : "border-border",
      )}
    >
      {/* Header: blood group + units */}
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold",
            isZero
              ? "bg-error-light text-error"
              : isLow
                ? "bg-orange-light text-orange"
                : "bg-primary-light text-primary",
          )}
        >
          {item.blood_group}
        </span>
        <div className="text-right">
          <p className="text-3xl font-bold leading-none text-navy">
            {item.units_available}
          </p>
          <p className="mt-1 text-xs text-text-secondary">units available</p>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-1.5">
        {isZero && <Badge tone="error">Out of Stock</Badge>}
        {isLow && !isZero && <Badge tone="warning">Low Stock</Badge>}
        {!isLow && !isZero && <Badge tone={tone}>In Stock</Badge>}
        {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
          <Badge tone={daysUntilExpiry <= 7 ? "error" : "warning"}>
            <Clock className="h-3 w-3" aria-hidden />
            Expires in {daysUntilExpiry}d
          </Badge>
        )}
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 text-xs text-text-secondary">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">
            {item.location_name}
          </p>
          <p className="text-[11px]">
            {item.location_city}, {item.location_state}
          </p>
        </div>
      </div>

      {/* Expiry date */}
      {item.expiry_date && (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden />
          Expires: {new Date(item.expiry_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      )}

      {/* Actions */}
      <div className="mt-1 flex flex-wrap gap-1.5 border-t border-border pt-3">
        <button
          suppressHydrationWarning
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-green-light px-2.5 py-1.5 text-xs font-semibold text-green transition-colors hover:bg-green/20"
        >
          <Plus className="h-3 w-3" aria-hidden />
          Add
        </button>
        <button
          suppressHydrationWarning
          type="button"
          onClick={onUse}
          disabled={isZero}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            isZero
              ? "cursor-not-allowed bg-background text-text-secondary opacity-60"
              : "bg-primary-light text-primary hover:bg-primary/20",
          )}
        >
          <Minus className="h-3 w-3" aria-hidden />
          Use
        </button>
        <button
          suppressHydrationWarning
          type="button"
          onClick={onTransfer}
          disabled={isZero}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            isZero
              ? "cursor-not-allowed bg-background text-text-secondary opacity-60"
              : "bg-blue-light text-blue hover:bg-blue/20",
          )}
        >
          <ArrowRightLeft className="h-3 w-3" aria-hidden />
          Transfer
        </button>
      </div>
    </article>
  );
}