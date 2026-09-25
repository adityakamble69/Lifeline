import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

// GET /api/v1/auth/me
// Returns the current authenticated user, syncing from Clerk on first call.
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.ensureUserSynced(req.auth.userId);

  res.status(200).json({
    success: true,
    data: {
      user,
      sessionClaims: {
        role: req.auth.sessionClaims?.metadata?.role ?? null,
      },
    },
  });
});

// POST /api/v1/auth/sync
// Explicitly syncs the Clerk user into the DB (idempotent).
export const syncUser = asyncHandler(async (req, res) => {
  const user = await authService.ensureUserSynced(req.auth.userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
});