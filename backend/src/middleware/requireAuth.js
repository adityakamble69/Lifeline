import { verifyToken } from '@clerk/backend';
import { ApiError } from '../utils/ApiError.js';
import * as authService from '../services/auth.service.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing Authorization header.');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) throw ApiError.unauthorized('Empty session token.');

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw ApiError.internal('CLERK_SECRET_KEY is not configured.');

    const sessionClaims = await verifyToken(token, { secretKey });

    if (!sessionClaims?.sub) {
      throw ApiError.unauthorized('Token is missing a subject.');
    }

    // Sync/fetch app-level user (creates on first sight).
    const user = await authService.ensureUserSynced(sessionClaims.sub);

    req.auth = {
      userId: sessionClaims.sub,
      sessionClaims,
    };
    req.user = user;

    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    return next(ApiError.unauthorized('Invalid or expired session token.'));
  }
}