"use client";

import * as React from "react";
import { Users, Tent, Droplets, Heart } from "lucide-react";
import { PublicNavbar, PublicFooter } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, FormField } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, KpiCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, SkeletonCard, SkeletonTableRows } from "@/components/ui/States";

export default function StyleGuidePage() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h1 className="text-2xl font-bold text-navy">Lifeline style guide</h1>
          <p className="mt-1 text-text-secondary">
            Phase 2 shared components — buttons, inputs, cards, badges,
            tables, modals, loading/empty/error states.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-navy">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" loading>
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="name" required>
            <Input id="name" placeholder="Rahul Sharma" />
          </FormField>
          <FormField label="Blood group" htmlFor="group">
            <Select id="group" defaultValue="">
              <option value="" disabled>
                Select blood group
              </option>
              <option>O+</option>
              <option>A+</option>
              <option>B+</option>
              <option>AB+</option>
            </Select>
          </FormField>
          <FormField
            label="Email"
            htmlFor="email"
            error="Enter a valid email address."
            className="sm:col-span-2"
          >
            <Input id="email" type="email" invalid defaultValue="not-an-email" />
          </FormField>
          <FormField label="Notes" htmlFor="notes" help="Optional." className="sm:col-span-2">
            <Textarea id="notes" placeholder="Anything we should know?" />
          </FormField>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<Users className="h-5 w-5" />} value="1,248" label="Total Donors" accent="primary" trend={{ direction: "up", text: "↑ 12% this month" }} />
          <KpiCard icon={<Tent className="h-5 w-5" />} value="36" label="Active Camps" accent="blue" trend={{ direction: "neutral", text: "No change" }} />
          <KpiCard icon={<Droplets className="h-5 w-5" />} value="842" label="Units in Stock" accent="green" trend={{ direction: "up", text: "↑ 4%" }} />
          <KpiCard icon={<Heart className="h-5 w-5" />} value="19" label="Volunteers" accent="purple" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Donor Management</CardTitle>
                <CardDescription>Standard card with header + actions.</CardDescription>
              </div>
              <Button size="sm" variant="secondary">
                Export
              </Button>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              <Badge tone="success">Active</Badge>
              <Badge tone="warning">Pending</Badge>
              <Badge tone="error">Urgent</Badge>
              <Badge tone="info">In Progress</Badge>
              <Badge tone="purple">Volunteer</Badge>
              <Badge tone="neutral">Neutral</Badge>
            </div>
          </Card>
          <SkeletonCard />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-navy">Table</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Blood Group</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Rahul Sharma</TableCell>
                <TableCell>O+</TableCell>
                <TableCell>Nagpur</TableCell>
                <TableCell>
                  <Badge tone="success">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Priya Verma</TableCell>
                <TableCell>A+</TableCell>
                <TableCell>Pune</TableCell>
                <TableCell>
                  <Badge tone="warning">Pending</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-sm text-text-secondary">Loading state:</p>
          <div className="rounded-2xl border border-border bg-surface">
            <SkeletonTableRows rows={3} cols={4} />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <EmptyState
            title="No pending donor approvals"
            description="There are no donor applications waiting for review."
            action={{ label: "Refresh", onClick: () => {} }}
          />
          <ErrorState onRetry={() => {}} />
        </section>

        <section className="flex flex-col items-start gap-3">
          <h2 className="text-lg font-semibold text-navy">Modal</h2>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Approve donor?"
            description="This will make the donor searchable in Find Blood."
            footer={
              <>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  Approve
                </Button>
              </>
            }
          >
            <p className="text-sm text-text-secondary">
              You can revoke approval later from Donor Management.
            </p>
          </Modal>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
