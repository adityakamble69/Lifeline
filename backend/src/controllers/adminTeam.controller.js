import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminTeam.service.js';

// GET /api/v1/admin/team
export const listMembers = asyncHandler(async (req, res) => {
  const data = await service.listMembers({
    organizationId: req.organization.id,
    search: req.query.search,
    role: req.query.role,
    status: req.query.status,
  });

  res.status(200).json({ success: true, data });
});

// POST /api/v1/admin/team
export const addMember = asyncHandler(async (req, res) => {
  const member = await service.addMember({
    organizationId: req.organization.id,
    email: req.body?.email,
    role: req.body?.role,
    requesterRole: req.organization.role,
  });

  res.status(201).json({ success: true, data: { member } });
});

// PATCH /api/v1/admin/team/:id
export const updateMember = asyncHandler(async (req, res) => {
  const member = await service.updateMember({
    memberId: req.params.id,
    organizationId: req.organization.id,
    patch: req.body ?? {},
    requesterRole: req.organization.role,
  });

  res.status(200).json({ success: true, data: { member } });
});

// DELETE /api/v1/admin/team/:id
export const removeMember = asyncHandler(async (req, res) => {
  const result = await service.removeMember({
    memberId: req.params.id,
    organizationId: req.organization.id,
    requesterRole: req.organization.role,
    requesterUserId: req.user.id,
  });

  res.status(200).json({ success: true, data: result });
});