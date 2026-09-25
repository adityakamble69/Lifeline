# Lifeline Blood Donor Network — Project Memory

**Last updated:** Phase 1 scaffold created
**Development status:** Phase 1 in progress

## Current Phase

**Phase 1 — Project Setup**

Frontend, backend, and Tailwind are scaffolded and verified running locally
against each other. Supabase project/database creation and Git init are still
outstanding (they require a real Supabase account and local `git init`, which
weren't available in the environment that generated this scaffold).

## Current Task

Create the Supabase project, run `database/schema.sql` against it, set the
real `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` values, and `git init` the
repo.

## Note on database.md vs. security requirements

`database.md`'s `users` table lists a `password_hash` column, but
`rules.md` §7 and the PRD say Clerk owns authentication and the app must
never store Clerk passwords/hashes. `database/schema.sql` resolves this by
using `clerk_user_id` instead of `password_hash`. `database.md` should be
updated to match once this is confirmed.

## Note on stack conflict

`architecture.md`/`phases.md` specify Next.js + Supabase (Postgres); this
memory file's "Important Decisions" section (below) previously said
Svelte + Vite + MySQL. The Next.js + Supabase version was built. Decision 2
and 5 below should be corrected to match, or reverted if that was the actual
intent.

## Completed

- [x] Project concept defined as a blood donor network.
- [x] Core public experience identified.
- [x] Donor/user panel identified.
- [x] Admin/organizer panel identified.
- [x] Core modules identified.
- [x] Initial technology stack selected.
- [x] PRD created.
- [x] Architecture created.
- [x] Database design created.
- [x] Development rules created.
- [x] Development phases created.
- [x] Design system created.
- [x] Initial project memory created.
- [x] Detailed `ui-ux.md` created from the approved Lifeline visual direction.

## Completed Files

```text
PRD.md
architecture.md
database.md
rules.md
phases.md
design.md
ui-ux.md
memory.md
```

## Current Project Structure

```text
lifeline/
├── frontend/         # Next.js (App Router) + Tailwind v4
├── backend/          # Node.js + Express, REST API under /api/v1
├── database/
│   └── schema.sql    # Initial Postgres schema for Supabase
├── docs/             # This documentation set
└── README.md
```

## Currently Being Modified

None.

## Pending

- [ ] Initialize Git repository.
- [x] Initialize Next.js frontend with App Router.
- [x] Configure Tailwind CSS v4.
- [x] Initialize Node.js + Express backend.
- [ ] Configure Supabase project/database (schema.sql is ready to run).
- [ ] Configure Clerk authentication.
- [ ] Prepare Vercel frontend deployment.
- [ ] Prepare Render backend deployment.
- [x] Add `.env.example`.
- [x] Add initial API health endpoint.
- [x] Add base frontend/backend README.
- [x] Verify local development workflow.

## Known Bugs

None — application code does not exist yet.

## Current Errors

None.

## Important Decisions

1. Product name: **Lifeline Blood Donor Network**.
2. Frontend: **Svelte + Vite**.
3. Styling: **Tailwind CSS v4**.
4. Backend: **Node.js + Express.js**.
5. Database: **MySQL**.
6. API style: **versioned REST API**.
7. Architecture: **modular monolith**, not microservices initially.
8. Admin authorization is organization-scoped.
9. High-impact admin actions should be auditable.
10. Design system uses a clean modern interface with a red humanitarian accent.
11. Documentation files are the project source of truth.

## Recent Changes

- Created the initial seven-file documentation system.
- Added detailed UI/UX specification matching the established Lifeline screen designs.
- Defined core donor, camp, request, inventory, communication, analytics, and organization modules.
- Defined the initial relational database model.
- Defined the initial development roadmap.

## Next Task

**Phase 1:** Initialize the project repository and create the Svelte/Vite frontend and Node/Express backend skeleton.

## Deployment Status

Not deployed.

## Change Log

### Initial Foundation
- Project documentation established.
- No production data or credentials exist.
