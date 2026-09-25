# Lifeline — frontend

Next.js (App Router) + Tailwind CSS v4.

```bash
cp .env.example .env.local
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

- `NEXT_PUBLIC_API_URL` — base URL of the backend API (`/api/v1`).
- `src/lib/api.ts` — thin fetch helper for calling the backend.
- `src/app/globals.css` — Lifeline design tokens (colors, see `../docs/design.md`)
  wired into Tailwind v4 via `@theme`.

Clerk auth isn't wired up yet — that's Phase 3 (`../docs/phases.md`).
