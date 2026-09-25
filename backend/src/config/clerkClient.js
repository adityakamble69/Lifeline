import { createClerkClient } from '@clerk/backend';

const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
  console.warn(
    '[clerkClient] CLERK_SECRET_KEY not set — Clerk API calls will fail. Set it in .env.'
  );
}

export const clerkClient = secretKey
  ? createClerkClient({ secretKey })
  : null;