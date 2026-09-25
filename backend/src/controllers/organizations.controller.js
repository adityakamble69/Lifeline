import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import * as orgRepo from '../repositories/organizations.repository.js';

// GET /api/v1/me/organizations
export const listMyOrganizations = asyncHandler(async (req, res) => {
  const memberships = await orgRepo.findMembershipsByUserId(req.user.id);

  const organizations = memberships.map((m) => ({
    id: m.organization_id,
    role: m.role,
    status: m.status,
    joined_at: m.joined_at,
    organization: m.organizations,
  }));

  res.status(200).json({
    success: true,
    data: { organizations },
  });
});

// GET /api/v1/admin/organization
export const getCurrentOrganization = asyncHandler(async (req, res) => {
  const full = await orgRepo.getOrganization(req.organization.id);
  if (!full) throw ApiError.notFound('Organization not found.');

  res.status(200).json({
    success: true,
    data: {
      organization: full,
      role: req.organization.role,
    },
  });
});

// GET /api/v1/admin/organization/members
export const listOrganizationMembers = asyncHandler(async (req, res) => {
  const members = await orgRepo.listMembers(req.organization.id);

  res.status(200).json({
    success: true,
    data: { members },
  });
});