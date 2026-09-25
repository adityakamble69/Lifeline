import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminOrganization.service.js';

// GET /api/v1/admin/organization
export const getOrganization = asyncHandler(async (req, res) => {
  const data = await service.getOrganization(req.organization.id);
  res.status(200).json({ success: true, data });
});

// PATCH /api/v1/admin/organization
export const updateOrganization = asyncHandler(async (req, res) => {
  const data = await service.updateOrganization({
    organizationId: req.organization.id,
    role: req.organization.role,
    body: req.body,
  });
  res.status(200).json({ success: true, data });
});