# Lifeline Blood Donor Network — System Architecture

**Status:** Initial / Documentation Foundation  
**Architecture style:** SPA + REST API + relational database

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | Supabase (PostgreSQL) |
| API | REST / JSON |
| Authentication | Clerk |
| Version control | Git + GitHub |
| API testing | Postman |
| DB tooling | Supabase Dashboard / SQL Editor |

The stack is intentionally aligned with the project's existing preferred technologies.

## 2. Overall Architecture

```text
Browser
   |
   v
Next.js + Tailwind CSS v4
   |
   | HTTPS / JSON
   v
Node.js + Express API
   |
   +--> Authentication / Authorization
   |
   +--> Validation / Business Logic
   |
   +--> Services
   |
   v
Supabase PostgreSQL
```

External providers, when introduced:

```text
Backend
 ├── Supabase PostgreSQL
 ├── Email/SMS provider (optional)
 ├── Object storage (optional)
 └── Maps/geocoding provider (optional)
```

## 3. Application Flow

1. User opens the Next.js application.
2. Frontend renders public or authenticated routes.
3. Protected pages request the authenticated user's session/profile.
4. Frontend calls `/api/v1/...`.
5. Express authenticates the request.
6. Authorization middleware checks role/permission.
7. Validation checks request data.
8. Service/business layer performs the operation.
9. Repository/data-access layer executes parameterized SQL.
10. API returns a stable JSON response.
11. Frontend updates local UI state.

## 4. Frontend Architecture

Use feature-oriented modules rather than one giant components directory.

```text
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   └── data-display/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── stores/
│   ├── validators/
│   └── utils/
├── features/
│   ├── auth/
│   ├── donors/
│   ├── camps/
│   ├── requests/
│   ├── inventory/
│   ├── notifications/
│   ├── messaging/
│   └── analytics/
├── routes/
│   ├── public/
│   ├── donor/
│   └── admin/
└── app.html
```

## 5. Backend Architecture

```text
server/
├── src/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   └── app.js
├── migrations/
├── seeds/
└── tests/
```

Responsibilities:

- **routes:** endpoint definitions.
- **controllers:** translate HTTP input/output.
- **services:** business rules and workflows.
- **repositories:** database access.
- **middleware:** auth, roles, validation, errors.
- **validators:** input schemas.
- **config:** environment-driven configuration.

## 6. API Architecture

Base URL:

```text
/api/v1
```

Suggested route groups:

```text
/auth
/users
/donors
/camps
/registrations
/volunteers
/requests
/verifications
/inventory
/messages
/notifications
/analytics
/exports
/organization
/team
/settings
```

Example:

```text
GET    /api/v1/donors
GET    /api/v1/donors/:id
POST   /api/v1/donors
PATCH  /api/v1/donors/:id
POST   /api/v1/donors/:id/approve

GET    /api/v1/camps
POST   /api/v1/camps
PATCH  /api/v1/camps/:id
POST   /api/v1/camps/:id/register

GET    /api/v1/requests
POST   /api/v1/requests
PATCH  /api/v1/requests/:id/status
POST   /api/v1/requests/:id/verify
```

## 7. Authentication Flow

```text
Login
  |
  v
POST /auth/login
  |
  v
Verify credentials
  |
  v
Issue access token
  |
  v
Frontend stores session safely
  |
  v
Protected API request
  |
  v
Auth middleware
  |
  v
Role/permission middleware
  |
  v
Controller
```

Prefer secure, HttpOnly cookies for refresh/session credentials where deployment architecture permits. Do not place long-lived secrets in localStorage.

## 8. Authorization

Authorization is role-based and organization-scoped.

```text
Guest
  └── public resources

Donor
  ├── own profile
  ├── own registrations
  ├── own donations
  └── permitted blood/request workflows

Requester
  └── own requests

Volunteer
  └── assigned camp workflows

Organizer/Admin
  └── organization resources
```

The backend is authoritative.

## 9. Data Flow — Emergency Request

```text
Requester
  ↓
Emergency Request Form
  ↓
POST /requests
  ↓
Validation
  ↓
Create request
  ↓
Verification queue
  ↓
Admin verifies
  ↓
Matching / coordination
  ↓
Donor contact / response
  ↓
Fulfilled / closed
  ↓
Notification + audit event
```

## 10. Data Flow — Camp

```text
Admin creates camp
      ↓
Draft
      ↓
Publish
      ↓
Public camp listing
      ↓
User registration
      ↓
Capacity/status update
      ↓
Camp attendance
      ↓
Donation / feedback
```

## 11. Folder / Route Principles

- Shared UI components live in `components/ui`.
- Business-specific components live under their feature.
- Routes should compose features, not contain large business logic.
- API calls are centralized in `lib/api`.
- Validation is shared where possible.
- Do not duplicate layouts for donor/admin sections when a reusable layout can support them safely.

## 12. Important Technical Decisions

1. **Next.js + Vite** for a fast SPA development experience.
2. **Tailwind CSS v4** for a consistent design system.
3. **Express** for a small, understandable REST backend.
4. **Supabase PostgreSQL** because the domain has strong relational requirements.
5. **Service/repository separation** to keep business logic independent from SQL.
6. **API versioning** from the first endpoint.
7. **Role + organization authorization** to prevent cross-organization access.
8. **Auditability** for high-impact admin actions.
9. **Pagination/filtering** for donor, request, registration, message, and notification collections.
10. **Optional integrations** remain behind service interfaces so they can be added without redesigning the core domain.

## 13. Scalability Strategy

Start as a modular monolith.

Do not introduce microservices at the initial stage. Separate services internally by domain so extraction is possible later if scale requires it.

Potential future domains:
- notification service
- messaging service
- matching service
- reporting/export worker

## 14. Error Handling

API errors should use a predictable shape:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data.",
    "details": {}
  }
}
```

Never return stack traces or SQL errors to clients.

## 15. Deployment Architecture

```text
User Browser
    |
    v
Vercel
Next.js Frontend
    |
    | HTTPS / REST
    v
Render
Node.js + Express API
    |
    +--------------------+
    |                    |
    v                    v
Clerk               Supabase
Authentication      PostgreSQL
                    + Storage (if required)
```

### Frontend — Vercel
- Deploy the Next.js application to Vercel.
- Configure Clerk public/frontend environment variables in Vercel.
- Configure the backend API base URL as a Vercel environment variable.
- Use separate Preview and Production environments where practical.

### Backend — Render
- Deploy the Node.js/Express API as a Render web service.
- Configure Clerk verification settings and Supabase server credentials as Render environment variables.
- Enable health checks.
- Keep the Supabase service-role key server-only.

### Database — Supabase
- Use Supabase PostgreSQL as the primary application database.
- Use SQL migrations for schema changes.
- Enable RLS where browser/client access is permitted.
- Prefer backend-mediated access for sensitive administrative operations.

### Authentication — Clerk
- Clerk is the identity provider.
- Next.js uses Clerk's official integration.
- Express verifies authenticated requests before protected operations.
- Application roles and organization permissions remain application-level authorization concerns.

## 16. Environment Separation

Use separate configuration for:

```text
local development
preview/staging
production
```

Never copy production secrets into local or preview environments.
