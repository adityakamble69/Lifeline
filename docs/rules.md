# Lifeline Blood Donor Network — Development Rules

These rules are mandatory unless explicitly changed and documented.

## 1. Source of Truth

### DO
- Check `PRD.md` before feature work.
- Check `architecture.md` before structural changes.
- Check `database.md` for data-related work.
- Check `rules.md` before implementation.
- Check `design.md` for UI work.
- Check `phases.md` and `memory.md` before starting tasks.
- Update the relevant documentation after meaningful changes.

### DON'T
- Invent functionality without a product reason.
- Randomly change the technology stack.
- Change architecture without documentation.
- Change database schema without documenting it.
- Skip a phase without recording why.

## 2. Coding Standards

### DO
- Prefer readable, small functions.
- Keep business logic out of UI components.
- Use descriptive names.
- Handle errors explicitly.
- Reuse shared utilities.
- Keep modules focused.

### DON'T
- Create giant components.
- Duplicate business logic.
- Add abstractions before they are needed.
- Leave debug logging in production paths.

## 3. Naming

Frontend:
- Components: `PascalCase`.
- Functions/variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Route names: kebab-case where applicable.

Backend:
- Files: consistent `camelCase` or existing project convention.
- Controllers/services/repositories should have explicit domain names.

Database:
- Tables and columns: `snake_case`.
- Primary keys: `id`.
- Foreign keys: `<entity>_id`.

## 4. Components

### DO
- Build reusable UI primitives.
- Keep domain-specific components inside their feature.
- Reuse buttons, inputs, modals, tables, badges, and cards.

### DON'T
- Copy-paste the same component into multiple features.
- Create multiple versions of the same button/card without a documented design reason.

## 5. API

### DO
- Version APIs under `/api/v1`.
- Validate all input.
- Use HTTP methods semantically.
- Return consistent JSON structures.
- Paginate large collections.
- Enforce authorization on the server.

### DON'T
- Trust frontend authorization.
- Return passwords, secrets, or internal stack traces.
- Put SQL directly in route handlers.

## 6. Database

### DO
- Use parameterized queries.
- Use foreign keys.
- Add PostgreSQL indexes for real query patterns.
- Use Supabase migrations/SQL migrations for schema changes.
- Use Row Level Security policies for client-accessible data.
- Preserve audit/history data.

### DON'T
- Store plaintext passwords.
- Duplicate data unnecessarily.
- Change production schema manually without a migration.
- Use `SELECT *` by default in performance-sensitive queries.

## 7. Security

### DO
- Use Clerk for authentication; do not implement password storage in the application.
- Validate and sanitize inputs.
- Apply authentication and authorization middleware.
- Rate-limit login and other abuse-prone endpoints.
- Protect uploaded documents.
- Keep secrets in environment variables.
- Use HTTPS in production.

### DON'T
- Hardcode API keys.
- Commit `.env` files containing secrets.
- Expose donor contact information publicly.
- Trust client-provided role values.
- Log passwords, tokens, or sensitive personal data.

## 8. Environment Variables

Use:

```text
.env
.env.example
```

`.env.example` may contain variable names but never real secrets.

Example:

```text
PORT=
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
```

## 9. Error Handling

- Use stable application error codes.
- Show human-readable messages to users.
- Log useful server-side diagnostics without sensitive data.
- Use centralized Express error handling.

## 10. Validation

Validate:
- frontend for user experience;
- backend for security and correctness.

Backend validation is mandatory even when frontend validation exists.

## 11. Responsive Design

### DO
- Design mobile-first.
- Support mobile, tablet, and desktop.
- Keep tables usable with responsive alternatives.
- Preserve important actions on small screens.

### DON'T
- Build desktop-only workflows.
- Depend on hover for essential actions.

## 12. Accessibility

- Use semantic HTML.
- Provide labels for form controls.
- Ensure keyboard navigation.
- Maintain visible focus states.
- Use sufficient color contrast.
- Do not communicate status by color alone.
- Provide accessible names for icon-only controls.

## 13. Git/GitHub

### DO
- Use meaningful commits.
- Work in feature branches when appropriate.
- Review changes before merging.
- Keep documentation changes with the feature that requires them.

Suggested format:

```text
feat: add donor approval workflow
fix: prevent duplicate camp registration
docs: update inventory architecture
```

### DON'T
- Commit secrets.
- Commit generated build artifacts unless required.
- Rewrite shared history unnecessarily.

## 14. Dependencies

### DO
- Prefer existing dependencies.
- Add a dependency only when it solves a real problem.
- Document significant dependency decisions.

### DON'T
- Install packages for trivial utilities.
- Add multiple libraries for the same purpose.

## 15. Performance

- Paginate large datasets.
- Avoid unnecessary API calls.
- Lazy-load heavy features where useful.
- Optimize images.
- Avoid excessive reactive state.
- Add database indexes based on actual access patterns.

## 16. Testing

Minimum expectations:
- API validation tests.
- Authentication/authorization tests.
- Core service tests.
- Critical frontend interaction tests.
- Database migration/seed verification.
- Manual responsive checks.

Critical flows must be tested before release:
- login
- donor registration
- donor approval
- blood search
- emergency request
- camp registration
- inventory update
- admin authorization

## 17. Documentation Rule

If implementation changes:
- architecture → update `architecture.md`;
- schema → update `database.md`;
- visual system → update `design.md`;
- development process → update `rules.md`;
- roadmap → update `phases.md`;
- state/progress → update `memory.md`.

