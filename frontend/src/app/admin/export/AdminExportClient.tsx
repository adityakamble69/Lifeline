"use client";

import * as React from "react";
import {
  Download,
  FileText,
  Calendar,
  Droplet,
  Users,
  Siren,
  ClipboardList,
  HeartHandshake,
  MessageSquare,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  FileSpreadsheet,
  FileJson,
  Clock,
  TrendingUp,
  Award,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, KpiCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import {
  exportAdminData,
  getRecentExports,
  formatRelativeTime,
  type ExportDataType,
  type ExportFormat,
  type ExportRecentResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  token: string;
  initial: ExportRecentResponse;
}

const DATA_TYPES: {
  id: ExportDataType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  {
    id: "donors",
    label: "Donors",
    description: "Contact info, blood group, location",
    icon: Droplet,
    accent: "bg-primary-light text-primary",
  },
  {
    id: "camps",
    label: "Camps",
    description: "Details, registrations, and volunteers",
    icon: Calendar,
    accent: "bg-blue-light text-blue",
  },
  {
    id: "requests",
    label: "Blood Requests",
    description: "All blood requests (emergency & regular)",
    icon: Siren,
    accent: "bg-orange-light text-orange",
  },
  {
    id: "registrations",
    label: "Registrations",
    description: "Camp registrations and attendance",
    icon: ClipboardList,
    accent: "bg-green-light text-green",
  },
  {
    id: "volunteers",
    label: "Volunteers",
    description: "Volunteer info and participation",
    icon: HeartHandshake,
    accent: "bg-purple-light text-purple",
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Ratings and comments from camps",
    icon: MessageSquare,
    accent: "bg-primary-light text-primary",
  },
  {
    id: "donations",
    label: "Donations",
    description: "All donation records",
    icon: TrendingUp,
    accent: "bg-green-light text-green",
  },
];

export function AdminExportClient({ token, initial }: Props) {
  const [recent, setRecent] = React.useState(initial.exports);

  const [selected, setSelected] = React.useState<ExportDataType[]>([
    "donors",
  ]);
  const [format, setFormat] = React.useState<ExportFormat>("csv");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const toggleType = (id: ExportDataType) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const downloadFile = (fileName: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (selected.length === 0) {
      setError("Please select at least one data type.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      for (const dataType of selected) {
        const res = await exportAdminData(token, {
          data_type: dataType,
          format,
          filters: {
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
          },
        });

        if (!res.success) {
          throw new Error(res.error.message);
        }

        const mime =
          format === "csv"
            ? "text/csv;charset=utf-8;"
            : "application/json;charset=utf-8;";
        downloadFile(res.data.file_name, res.data.content, mime);

        // Small delay between downloads
        if (selected.length > 1) {
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      setSuccess(
        `${selected.length} export${selected.length === 1 ? "" : "s"} downloaded successfully.`,
      );
      setTimeout(() => setSuccess(null), 4000);

      // Refresh recent list
      const recentRes = await getRecentExports(token);
      if (recentRes.success) setRecent(recentRes.data.exports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Reports
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Export <span className="text-primary">Data</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
              Download your organization&apos;s data in various formats. Use it
              for reports, presentations, research, or to share with partners.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-surface/70 p-5 backdrop-blur lg:block">
            <p className="font-['Brush_Script_MT',_cursive] text-lg leading-snug text-primary">
              &ldquo;Data For
              <br />
              A Healthier
              <br />
              Tomorrow&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Success / Error banners */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-light bg-green-light/40 p-3 text-sm text-green">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-sm text-primary">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          {/* Data type selection */}
          <Card>
            <h2 className="text-base font-semibold text-navy">
              Select Data to Export
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Choose one or more data types to include in the export.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {DATA_TYPES.map((dt) => {
                const isSelected = selected.includes(dt.id);
                const Icon = dt.icon;
                return (
                  <button
                    key={dt.id}
                    suppressHydrationWarning
                    type="button"
                    onClick={() => toggleType(dt.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary-light/40"
                        : "border-border bg-surface hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        dt.accent,
                      )}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-navy">
                          {dt.label}
                        </p>
                        {isSelected && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-3 w-3" aria-hidden />
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {dt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Export settings */}
          <Card>
            <h2 className="text-base font-semibold text-navy">
              Export Settings
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Configure your export preferences.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Format */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  File Format
                </label>
                <div className="mt-2 flex gap-3">
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => setFormat("csv")}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                      format === "csv"
                        ? "border-primary bg-primary-light/40"
                        : "border-border bg-surface hover:border-primary/40",
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-light text-green">
                      <FileSpreadsheet className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        CSV
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        Best for Excel & Sheets
                      </p>
                    </div>
                  </button>
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => setFormat("json")}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                      format === "json"
                        ? "border-primary bg-primary-light/40"
                        : "border-border bg-surface hover:border-primary/40",
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-light text-blue">
                      <FileJson className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        JSON
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        Best for developers & APIs
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date range */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Date Range
                </label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <Calendar
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                      aria-hidden
                    />
                    <input
                      suppressHydrationWarning
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="relative">
                    <Calendar
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                      aria-hidden
                    />
                    <input
                      suppressHydrationWarning
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-border bg-surface pl-9 pr-3 text-sm text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-text-secondary">
                  Leave blank to export all data.
                </p>
              </div>
            </div>

            {/* Export button */}
            <div className="mt-5 border-t border-border pt-5">
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={handleExport}
                disabled={selected.length === 0}
                className="w-full gap-2 sm:w-auto"
              >
                <Download className="h-4 w-4" aria-hidden />
                Export {selected.length > 0 ? `${selected.length} ` : ""}
                {selected.length === 1 ? "Dataset" : "Datasets"}
              </Button>
            </div>
          </Card>

          {/* Recent exports */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-navy">
                Recent Exports
              </h2>
            </div>

            {recent.length === 0 ? (
              <EmptyState
                icon={<Download className="h-6 w-6" aria-hidden />}
                title="No exports yet"
                description="Your export history will appear here."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        #
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        File Name
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Type
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Format
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Rows
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        When
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recent.map((exp, i) => (
                      <tr key={exp.id} className="hover:bg-background/60">
                        <td className="px-3 py-3 text-xs text-text-secondary">
                          {i + 1}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            {exp.format === "csv" ? (
                              <FileSpreadsheet
                                className="h-4 w-4 text-green"
                                aria-hidden
                              />
                            ) : (
                              <FileJson
                                className="h-4 w-4 text-blue"
                                aria-hidden
                              />
                            )}
                            <span className="truncate font-medium text-navy">
                              {exp.file_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs capitalize text-text-secondary">
                          {exp.data_type}
                        </td>
                        <td className="px-3 py-3">
                          <Badge tone={exp.format === "csv" ? "success" : "info"}>
                            {exp.format.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-xs text-navy">
                          {exp.row_count}
                        </td>
                        <td className="px-3 py-3 text-xs text-text-secondary">
                          {formatRelativeTime(exp.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Security notice */}
          <div className="flex gap-3 rounded-2xl border border-blue-light bg-blue-light/40 p-4">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
            <div>
              <p className="text-xs font-semibold text-navy">
                Your data is secure
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                Exports include only the data you have permission to access.
                Sensitive information can be anonymized.
              </p>
            </div>
          </div>

          {/* Quick tips */}
          <Card>
            <h3 className="mb-3 text-base font-semibold text-navy">
              Quick Tips
            </h3>
            <ul className="flex flex-col gap-3">
              <TipRow
                icon={<CheckCircle2 className="h-4 w-4" aria-hidden />}
                accent="bg-green-light text-green"
                title="CSV for spreadsheets"
                description="Open in Excel, Google Sheets, or Numbers."
              />
              <TipRow
                icon={<FileJson className="h-4 w-4" aria-hidden />}
                accent="bg-blue-light text-blue"
                title="JSON for developers"
                description="Structured data for apps and integrations."
              />
              <TipRow
                icon={<Calendar className="h-4 w-4" aria-hidden />}
                accent="bg-orange-light text-orange"
                title="Filter by date"
                description="Narrow down exports to a specific period."
              />
            </ul>
          </Card>

          {/* Custom data */}
          <Card>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                <FileText className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold text-navy">
                Need custom data?
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              If you need a specific report or custom data format, contact the
              admin team.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 w-full"
              disabled
            >
              Request Custom Export
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function TipRow({
  icon,
  accent,
  title,
  description,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          accent,
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold text-navy">{title}</p>
        <p className="text-[11px] text-text-secondary">{description}</p>
      </div>
    </li>
  );
}