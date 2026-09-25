# Lifeline Blood Donor Network

Connects blood donors, people/organizations needing blood, and blood
donation camps through one platform. See `docs/` for the full product,
architecture, database, design, and process documentation — those files are
the source of truth (`docs/rules.md` §1).

## Status

**Phase 1 — Project Setup**, in progress. Frontend and backend scaffolds
exist and talk to each other locally. No Supabase project exists yet, so the
app is running without a real database. See `docs/memory.md` for the current
state and `docs/phases.md` for the full roadmap.

## Structure

```text
lifeline/
├── frontend/   Next.js (App Router) + Tailwind CSS v4
├── backend/    Node.js + Express — REST API under /api/v1
├── database/   schema.sql — initial Postgres schema for Supabase
└── docs/       PRD, architecture, database, design, rules, phases, memory
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in Supabase/Clerk values once you have them
npm install
npm run dev             # http://localhost:4000
```

`GET http://localhost:4000/api/v1/health` should return `{"status":"ok", ...}`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev              # http://localhost:3000
```

The home page calls the backend's health endpoint and shows whether it's
reachable and whether Supabase is configured yet.

### 3. Database (not yet done)

1. Create a Supabase project.
2. In the Supabase SQL editor, run `database/schema.sql`.
3. Copy the project URL and **service-role** key into `backend/.env` as
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never put the
   service-role key in the frontend.

## Known documentation gaps

These were found while scaffolding and are noted in `docs/memory.md` too:

- `docs/architecture.md`/`docs/phases.md` specify Next.js + Supabase
  (Postgres); an older note in `docs/memory.md`'s "Important Decisions"
  said Svelte + Vite + MySQL for the same project. This scaffold follows
  the Next.js + Supabase version — the memory.md decision list should be
  corrected or reverted to match whichever is actually intended.
- `docs/database.md`'s `users` table lists `password_hash`, which
  conflicts with `docs/rules.md` §7 ("Clerk owns authentication; the app
  must not store Clerk passwords or password hashes"). `database/schema.sql`
  uses a `clerk_user_id` column instead — `database.md` should be updated
  to match.

## Conventions

Coding, naming, API, and security conventions are in `docs/rules.md` — read
it before adding features.
