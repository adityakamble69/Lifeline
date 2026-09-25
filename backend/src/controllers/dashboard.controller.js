import { asyncHandler } from '../utils/asyncHandler.js';
import * as dashService from '../services/dashboard.service.js';

// GET /api/v1/admin/dashboard/stats
export const getStats = asyncHandler(async (req, res) => {
  const stats = await dashService.getDashboardStats();
  res.status(200).json({ success: true, data: { stats } });
});

// GET /api/v1/admin/dashboard/activity
export const getActivity = asyncHandler(async (req, res) => {
  const activity = await dashService.getDashboardActivity();
  res.status(200).json({ success: true, data: activity });
});