import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminRequests.service.js';

// GET /api/v1/admin/requests
export const listRequests = asyncHandler(async (req, res) => {
  const [data, counts] = await Promise.all([
    service.listRequests({
      status: req.query.status,
      urgency: req.query.urgency,
      bloodGroup: req.query.blood_group,
      city: req.query.city,
      search: req.query.search,
      page: req.query.page,
      pageSize: req.query.page_size,
    }),
    service.getCounts(),
  ]);

  res.status(200).json({ success: true, data: { ...data, counts } });
});

// POST /api/v1/admin/requests/:id/verify
export const verifyRequest = asyncHandler(async (req, res) => {
  const request = await service.verifyRequest({
    requestId: req.params.id,
    reviewerId: req.user.id,
  });
  res.status(200).json({ success: true, data: { request } });
});

// POST /api/v1/admin/requests/:id/reject
export const rejectRequest = asyncHandler(async (req, res) => {
  const request = await service.rejectRequest({
    requestId: req.params.id,
    reviewerId: req.user.id,
    reason: req.body?.reason,
  });
  res.status(200).json({ success: true, data: { request } });
});

// POST /api/v1/admin/requests/:id/fulfill
export const markFulfilled = asyncHandler(async (req, res) => {
  const request = await service.markFulfilled({
    requestId: req.params.id,
    reviewerId: req.user.id,
  });
  res.status(200).json({ success: true, data: { request } });
});

// POST /api/v1/admin/requests/:id/in-progress
export const setInProgress = asyncHandler(async (req, res) => {
  const request = await service.setInProgress({
    requestId: req.params.id,
    reviewerId: req.user.id,
  });
  res.status(200).json({ success: true, data: { request } });
});