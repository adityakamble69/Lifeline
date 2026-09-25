# Lifeline Blood Donor Network — Development Roadmap

**Current status:** Phase 1 (project setup) and Phase 2 (UI foundation) complete. Ready to start Phase 3 (Authentication & Authorization).

## Phase 1 — Project Setup

**Objective:** Create the working repository and development foundations.

Tasks:
- [ ] Initialize Git repository. (run `git init` once the folder is on your machine)
- [x] Create Next.js frontend using the App Router.
- [x] Create Node.js + Express backend.
- [x] Configure Tailwind CSS v4.
- [x] Configure environment variables (`.env.example` in both apps; `.env` / `.env.local` are git-ignored).
- [ ] Create/configure Supabase project and PostgreSQL schema. (schema is written at `database/schema.sql`; still needs to be run against a real Supabase project — no Supabase project exists yet)
- [x] Create base README and scripts.
- [ ] Create development database. (blocked on the Supabase project above)
- [x] Verify frontend/backend local startup. (frontend renders a live health check from the backend's `/api/v1/health` endpoint)

**Files/modules:** frontend root, backend root, `.env.example`, package manifests.

**Dependencies:** Node.js, npm, Supabase, Clerk, Vercel, Render.

**Expected result:** Frontend and API run locally.

**Completion criteria:** Both applications start cleanly and communicate through a health endpoint.

## Phase 2 — UI Foundation

**Objective:** Build the shared design system and layouts.

Tasks:
- [x] Implement color tokens. (`src/app/globals.css` — full red/navy/blue/green/orange/purple palette from `design.md` + `ui-ux.md`)
- [x] Implement typography scale. (Inter via `next/font/google`; sizes applied per-component per the `ui-ux.md` scale)
- [x] Create reusable buttons, inputs, cards, badges, tables, modals. (`src/components/ui/`)
- [x] Create public navbar/footer. (`src/components/layout/PublicNavbar.tsx`, `PublicFooter.tsx`)
- [x] Create donor layout. (`src/components/layout/DonorLayout.tsx`)
- [x] Create admin sidebar/header. (`src/components/layout/AdminSidebar.tsx`, `AdminHeader.tsx`, composed in `AdminLayout.tsx`)
- [x] Add responsive breakpoints. (Tailwind `sm/md/lg/xl/2xl`; mobile drawers for both admin sidebar and donor nav)
- [x] Implement loading/empty/error states. (`src/components/ui/States.tsx`: `Skeleton*`, `EmptyState`, `ErrorState`)

Visual QA: `/style-guide` renders every component for a manual pass across breakpoints.

**Expected result:** All future pages can reuse a consistent visual system.

**Completion criteria:** Shared components work across desktop and mobile.

## Phase 3 — Authentication & Authorization

**Objective:** Secure user access.

Tasks:
- [ ] Configure Clerk in Next.js.
- [ ] Registration/login/logout.
- [ ] Clerk-protected routes.
- [ ] Backend Clerk token/session verification.
- [ ] Role/organization authorization middleware.
- [ ] Protected frontend routes.
- [ ] Organization-scoped admin authorization.
- [ ] Authentication tests.

**Completion criteria:** Unauthorized users cannot access protected APIs/pages.

## Phase 4 — Donor & Profile Core

**Objective:** Establish the donor identity system.

Tasks:
- [ ] User profile API.
- [ ] Donor profile schema/API.
- [ ] Donor registration flow.
- [ ] Donor approval workflow.
- [ ] Donor profile UI.
- [ ] Find Blood UI/API.
- [ ] Privacy-aware donor contact workflow.

**Completion criteria:** A donor can register, complete a profile, be approved, and become searchable according to rules.

## Phase 5 — Camps & Registrations

**Objective:** Enable the full camp workflow.

Tasks:
- [ ] Camp CRUD API.
- [ ] Public camp listing.
- [ ] Camp detail page.
- [ ] Camp creation/edit UI.
- [ ] Camp registration API.
- [ ] Registration management.
- [ ] Volunteer assignment.
- [ ] Camp feedback.

**Completion criteria:** Admin can publish a camp and a donor can register with capacity enforcement.

## Phase 6 — Blood Requests & Verification

**Objective:** Build request coordination.

Tasks:
- [ ] Blood request API.
- [ ] Emergency request UI.
- [ ] Request verification.
- [ ] Status transitions.
- [ ] Admin request management.
- [ ] Donor matching/search workflow.
- [ ] Request notifications.

**Completion criteria:** A request can move from creation through verification and fulfillment/closure.

## Phase 7 — Inventory

**Objective:** Track blood stock safely.

Tasks:
- [ ] Inventory location management.
- [ ] Blood group stock.
- [ ] Inventory transactions.
- [ ] Add/usage/transfer workflows.
- [ ] Low-stock indicators.
- [ ] Expiry tracking.
- [ ] Inventory audit events.

**Completion criteria:** Every stock change is traceable to an inventory transaction.

## Phase 8 — Communication & Notifications

**Objective:** Support operational communication.

Tasks:
- [ ] Notification model/API.
- [ ] Notification center.
- [ ] Read/unread workflow.
- [ ] Conversation model/API.
- [ ] Message UI.
- [ ] Emergency-related communication.
- [ ] Optional email integration behind a service interface.

**Completion criteria:** Relevant events generate persisted notifications and authorized users can communicate.

## Phase 9 — Analytics & Exports

**Objective:** Provide useful operational reporting.

Tasks:
- [ ] Admin dashboard.
- [ ] Donation metrics.
- [ ] Request metrics.
- [ ] Camp metrics.
- [ ] Donor distribution.
- [ ] Analytics APIs.
- [ ] Export data workflow.
- [ ] Permission-aware exports.
- [ ] Optional anonymization.

**Completion criteria:** Admin can view operational metrics and export permitted data.

## Phase 10 — Organization & Team Administration

**Objective:** Complete organization management.

Tasks:
- [ ] Organization profile.
- [ ] Team members.
- [ ] Role/permission management.
- [ ] Organization settings.
- [ ] Audit logs.
- [ ] Admin profile/settings.

**Completion criteria:** Organization administrators can safely manage organization information and access.

## Phase 11 — Testing & Hardening

**Objective:** Prepare the system for release.

Tasks:
- [ ] API tests.
- [ ] Auth/security tests.
- [ ] Core workflow tests.
- [ ] Responsive UI checks.
- [ ] Accessibility review.
- [ ] Database migration verification.
- [ ] Performance review.
- [ ] Error-state review.
- [ ] Security review.

**Completion criteria:** Critical workflows pass tests and release blockers are resolved.

## Phase 12 — Deployment

**Objective:** Deploy a production-ready version.

Tasks:
- [ ] Production environment configuration.
- [ ] Production Supabase project/database.
- [ ] Backend deployment to Render.
- [ ] Frontend deployment to Vercel.
- [ ] HTTPS/domain configuration.
- [ ] Database migrations.
- [ ] Seed only non-sensitive production-safe reference data.
- [ ] Logging/monitoring.
- [ ] Backup strategy.
- [ ] Smoke tests.

**Completion criteria:** Production deployment passes smoke tests and operational checks.

