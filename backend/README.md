# Lifeline — backend

Node.js + Express. REST API versioned under `/api/v1`.

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:4000, restarts on file change
npm start        # plain start
```

## Structure

```text
src/
├── config/supabaseClient.js   Server-side Supabase client (service-role key)
├── middleware/errorHandler.js Centralized error + 404 handling
├── routes/health.routes.js    GET /api/v1/health
├── routes/index.js            Mounts all /api/v1 routes
└── server.js                  App entry point
```

## Adding a route

Add a `*.routes.js` file under `src/routes/`, mount it in `src/routes/index.js`.
Keep SQL/Supabase calls out of route handlers directly — route to a
service/repository layer as the API grows (`../docs/rules.md` §5).

## Env vars

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` is server-only — never send
it to the frontend.
