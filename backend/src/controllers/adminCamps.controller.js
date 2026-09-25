import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminCamps.service.js';

// GET /api/v1/admin/camps
export const listCamps = asyncHandler(async (req, res) => {
  const data = await service.listCamps({
    organizationId: req.organization.id,
    status: req.query.status,
    search: req.query.search,
    page: req.query.page,
    pageSize: req.query.page_size,
  });
  res.status(200).json({ success: true, data });
});

// POST /api/v1/admin/camps
export const createCamp = asyncHandler(async (req, res) => {
  const camp = await service.createCamp({
    organizationId: req.organization.id,
    userId: req.user.id,
    body: req.body,
  });
  res.status(201).json({ success: true, data: { camp } });
});

// PATCH /api/v1/admin/camps/:id
export const updateCamp = asyncHandler(async (req, res) => {
  const camp = await service.updateCamp({
    campId: req.params.id,
    organizationId: req.organization.id,
    body: req.body,
  });
  res.status(200).json({ success: true, data: { camp } });
});

// POST /api/v1/admin/camps/:id/status
export const changeStatus = asyncHandler(async (req, res) => {
  const camp = await service.changeStatus({
    campId: req.params.id,
    organizationId: req.organization.id,
    status: req.body?.status,
  });
  res.status(200).json({ success: true, data: { camp } });
});