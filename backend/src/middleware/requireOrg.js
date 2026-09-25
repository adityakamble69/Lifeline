import { ApiError } from '../utils/ApiError.js';
import * as orgRepo from '../repositories/organizations.repository.js';

/**
 * Ensures the authenticated user belongs to an active organization.
 * Must be used AFTER requireAuth (needs req.user.id).
 *
 * Behavior:
 *  - If `x-organization-id` header is set → verify membership for that org
 *  - Otherwise → pick user's "primary" org (prefers admin/owner role)
 *  - Attaches `req.organization = { id, role, status, organization }`
 *
 * Returns 403 if user has no active membership.
 */
export function requireOrg() {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        throw ApiError.unauthorized('Authentication required.');
      }

      const requestedOrgId =
        typeof req.headers['x-organization-id'] === 'string'
          ? req.headers['x-organization-id'].trim()
          : null;

      // Specific org requested via header
      if (requestedOrgId) {
        const membership = await orgRepo.findMembership(
          req.user.id,
          requestedOrgId,
        );
        if (!membership) {
          throw ApiError.forbidden(
            'You are not an active member of this organization.',
          );
        }
        req.organization = {
          id: membership.organization_id,
          role: membership.role,
          status: membership.status,
          organization: membership.organizations ?? null,
        };
        return next();
      }

      // Otherwise: pick user's primary org
      const memberships = await orgRepo.findMembershipsByUserId(req.user.id);
      const active = memberships.filter((m) => m.status === 'active');

      if (active.length === 0) {
        throw ApiError.forbidden(
          'You are not an active member of any organization.',
        );
      }

      const preferred =
        active.find((m) => ['owner', 'admin'].includes(m.role)) ?? active[0];

      req.organization = {
        id: preferred.organization_id,
        role: preferred.role,
        status: preferred.status,
        organization: preferred.organizations ?? null,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}