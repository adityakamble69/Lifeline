export {};

// Role stored in Clerk's public metadata; mirrors `users.role` in the DB.
// Values match database/schema.sql: "donor" | "admin" (extend as org roles land).
type Role = "donor" | "admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: Role;
    };
  }
}
