import { clerkClient } from '../config/clerkClient.js';
import { ApiError } from '../utils/ApiError.js';
import * as userRepo from '../repositories/user.repository.js';

// Returns the app-level user for the given Clerk user ID, creating it in the
// DB on first sight (idempotent upsert-like behavior).
export async function ensureUserSynced(clerkUserId) {
  // Fast path: already in DB.
  const existing = await userRepo.findByClerkUserId(clerkUserId);
  if (existing) {
    await userRepo.touchLastLogin(existing.id);
    return { ...existing, last_login_at: new Date().toISOString() };
  }

  // Slow path: fetch fresh profile from Clerk, then insert.
  if (!clerkClient) {
    throw ApiError.internal('CLERK_SECRET_KEY is not configured.');
  }

  const clerkUser = await clerkClient.users.getUser(clerkUserId).catch(() => {
    throw ApiError.unauthorized('Could not fetch user from Clerk.');
  });

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    null;

  if (!email) {
    throw ApiError.validation('User has no email address on file.');
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() ||
    clerkUser.username ||
    email.split('@')[0];

  const phone =
    clerkUser.primaryPhoneNumber?.phoneNumber ??
    clerkUser.phoneNumbers?.[0]?.phoneNumber ??
    null;

  return userRepo.insertUser({ clerkUserId, name, email, phone });
}