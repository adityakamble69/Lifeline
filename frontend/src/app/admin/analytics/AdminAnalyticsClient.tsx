"use client";

import * as React from "react";
import {
  Users,
  Droplet,
  Siren,
  Calendar,
  Heart,
  HeartHandshake,
  TrendingUp,
  Activity,
  Award,
  Target,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, KpiCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { AnalyticsResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

const BRAND_COLORS = ["#E53935", "#2563EB", "#16A34A", "#F59E0B", "#7C3AED", "#0EA5E9", "#EC4899", "#64748B"];

const NAVY = "#101B5C";
const GRID = "#E5E7EB";
const MUTED = "#64748B";

interface Props {
  initial: AnalyticsResponse;
}

export function AdminAnalyticsClient({ initial }: Props) {
  const { kpis, impact } = initial;

  const statusColors = ["#16A34A", "#2563EB", "#F59E0B", "#E53935", "#64748B", "#7C3AED"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-primary-light/60 to-background p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Analytics
            </p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Impact in <span className="text-primary">Numbers</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
              Track donations, requests, camps and community growth.
              Data-driven insights for a healthier tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={kpis.total_donors}
          label="Total Donors"
          accent="primary"
        />
        <KpiCard
          icon={<Droplet className="h-5 w-5" aria-hidden />}
          value={kpis.total_donations}
          label="Total Donations"
          accent="green"
        />
        <KpiCard
          icon={<Siren className="h-5 w-5" aria-hidden />}
          value={kpis.total_requests}
          label="Blood Requests"
          accent="orange"
        />
        <KpiCard
          icon={<Calendar className="h-5 w-5" aria-hidden />}
          value={kpis.total_camps}
          label="Blood Camps"
          accent="blue"
        />
      </section>

      {/* Row: 3 charts side by side */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Donation trends — Line */}
        <ChartCard title="Donations Trend" subtitle="Last 9 months">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={initial.donation_trends}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis
                dataKey="label"
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${GRID}`,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E53935"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#E53935" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Request trends — Bar */}
        <ChartCard title="Blood Requests Trend" subtitle="Last 9 months">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={initial.request_trends}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis
                dataKey="label"
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${GRID}`,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donor growth — Area */}
        <ChartCard title="Donor Growth" subtitle="Cumulative">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={initial.donor_growth}>
              <defs>
                <linearGradient id="donorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis
                dataKey="label"
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${GRID}`,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#16A34A"
                strokeWidth={2.5}
                fill="url(#donorGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Row: distributions */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Blood Group Distribution */}
        <ChartCard title="Blood Group Distribution" subtitle="Active donors">
          {initial.blood_group_distribution.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="flex flex-col gap-3">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={initial.blood_group_distribution}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {initial.blood_group_distribution.map((_, i) => (
                      <Cell
                        key={i}
                        fill={BRAND_COLORS[i % BRAND_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: `1px solid ${GRID}`,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {initial.blood_group_distribution.map((d, i) => (
                  <li
                    key={d.label}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: BRAND_COLORS[i % BRAND_COLORS.length],
                      }}
                    />
                    <span className="font-medium text-navy">{d.label}</span>
                    <span className="text-text-secondary">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ChartCard>

        {/* Request Status */}
        <ChartCard title="Requests by Status" subtitle="All time">
          {initial.request_status_distribution.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="flex flex-col gap-3">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={initial.request_status_distribution}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {initial.request_status_distribution.map((_, i) => (
                      <Cell
                        key={i}
                        fill={statusColors[i % statusColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: `1px solid ${GRID}`,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {initial.request_status_distribution.map((d, i) => (
                  <li
                    key={d.label}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: statusColors[i % statusColors.length],
                      }}
                    />
                    <span className="font-medium text-navy">{d.label}</span>
                    <span className="text-text-secondary">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ChartCard>

        {/* Camps Overview */}
        <ChartCard title="Camps Overview" subtitle="Last 9 months">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={initial.camps_overview}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis
                dataKey="label"
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={MUTED}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${GRID}`,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="#E53935" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Row: Top cities + Impact metrics */}
      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Top Cities */}
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-navy">
                Top Donor Cities
              </h3>
              <p className="text-xs text-text-secondary">
                By total registered donors
              </p>
            </div>
          </div>

          {initial.top_cities.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      #
                    </th>
                    <th className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      City
                    </th>
                    <th className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Total Donors
                    </th>
                    <th className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Donations
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {initial.top_cities.map((c, i) => (
                    <tr key={c.city}>
                      <td className="px-2 py-3 text-xs text-text-secondary">
                        {i + 1}
                      </td>
                      <td className="px-2 py-3 font-medium text-navy">
                        {c.city}
                      </td>
                      <td className="px-2 py-3 text-navy">{c.donors}</td>
                      <td className="px-2 py-3 text-text-secondary">
                        {c.donations}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Impact metrics */}
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">
            Impact Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <ImpactTile
              icon={<Heart className="h-4 w-4" aria-hidden />}
              accent="primary"
              value={impact.lives_impacted}
              suffix="+"
              label="Lives Impacted"
            />
            <ImpactTile
              icon={<Calendar className="h-4 w-4" aria-hidden />}
              accent="blue"
              value={impact.camps_organized}
              suffix="+"
              label="Camps Organized"
            />
            <ImpactTile
              icon={<Target className="h-4 w-4" aria-hidden />}
              accent="green"
              value={impact.request_fulfillment_rate}
              suffix="%"
              label="Request Fulfillment"
            />
            <ImpactTile
              icon={<HeartHandshake className="h-4 w-4" aria-hidden />}
              accent="orange"
              value={impact.active_volunteers}
              suffix="+"
              label="Active Volunteers"
            />
          </div>
          <div className="mt-4 rounded-2xl bg-primary-light/40 p-4 text-center">
            <p className="font-['Brush_Script_MT',_cursive] text-base leading-snug text-primary">
              &ldquo;Together we donate, we support,
              <br />
              we save lives.&rdquo;
            </p>
          </div>
        </Card>
      </section>

      {/* Bottom row: extra KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MiniKpi
          icon={<Award className="h-5 w-5" aria-hidden />}
          value={kpis.approved_donors}
          label="Approved Donors"
          accent="green"
        />
        <MiniKpi
          icon={<Users className="h-5 w-5" aria-hidden />}
          value={kpis.lives_saved}
          label="Lives Potentially Saved"
          accent="primary"
        />
        <MiniKpi
          icon={<TrendingUp className="h-5 w-5" aria-hidden />}
          value={kpis.active_volunteers}
          label="Active Volunteers"
          accent="orange"
        />
      </section>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-navy">{title}</h3>
        {subtitle && (
          <p className="text-xs text-text-secondary">{subtitle}</p>
        )}
      </div>
      {children}
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-background text-center">
      <p className="text-xs text-text-secondary">Not enough data yet</p>
    </div>
  );
}

function ImpactTile({
  icon,
  accent,
  value,
  suffix,
  label,
}: {
  icon: React.ReactNode;
  accent: "primary" | "green" | "blue" | "orange";
  value: number;
  suffix?: string;
  label: string;
}) {
  const accents: Record<typeof accent, string> = {
    primary: "bg-primary-light text-primary",
    green: "bg-green-light text-green",
    blue: "bg-blue-light text-blue",
    orange: "bg-orange-light text-orange",
  };
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          accents[accent],
        )}
        aria-hidden
      >
        {icon}
      </span>
      <p className="mt-3 text-lg font-bold leading-tight text-navy">
        {value}
        {suffix}
      </p>
      <p className="mt-0.5 text-xs text-text-secondary">{label}</p>
    </div>
  );
}

function MiniKpi({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent: "primary" | "green" | "orange";
}) {
  const accents: Record<typeof accent, string> = {
    primary: "bg-primary-light text-primary",
    green: "bg-green-light text-green",
    orange: "bg-orange-light text-orange",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          accents[accent],
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold leading-tight text-navy">{value}</p>
        <p className="text-xs text-text-secondary">{label}</p>
      </div>
    </div>
  );
}