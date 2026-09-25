import { ApiError } from '../utils/ApiError.js';

// Checks role from the verified session claims (set by requireAuth).
// Usage: router.get('/x', requireAuth, requireRole('admin'), handler)
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.auth?.sessionClaims?.metadata?.role;

    if (!role) {
      return next(ApiError.forbidden('No role assigned to this user.'));
    }

    if (!allowedRoles.includes(role)) {
      return next(ApiError.forbidden(`Requires one of: ${allowedRoles.join(', ')}.`));
    }

    next();
  };
}