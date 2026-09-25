import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/analytics.service.js';

// GET /api/v1/admin/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const data = await service.getAnalytics(req.organization.id);
  res.status(200).json({ success: true, data });
});