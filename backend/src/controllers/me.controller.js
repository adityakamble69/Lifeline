import { asyncHandler } from '../utils/asyncHandler.js';
import * as meService from '../services/me.service.js';
import { ApiError } from '../utils/ApiError.js';

// GET /api/v1/me
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await meService.getMyProfile(req.user.id);
  if (!profile) throw ApiError.notFound('User profile not found.');

  res.status(200).json({ success: true, data: profile });
});

// PATCH /api/v1/me
export const updateMyUser = asyncHandler(async (req, res) => {
  const profile = await meService.updateMyUser(req.user.id, req.body);
  res.status(200).json({ success: true, data: profile });
});

// PATCH /api/v1/me/donor
export const updateMyDonor = asyncHandler(async (req, res) => {
  const profile = await meService.updateMyDonor(req.user.id, req.body);
  res.status(200).json({ success: true, data: profile });
});

// GET /api/v1/me/stats
export const getMyStats = asyncHandler(async (req, res) => {
  const stats = await meService.getMyStats(req.user.id);
  if (!stats) throw ApiError.notFound('User profile not found.');

  res.status(200).json({ success: true, data: { stats } });
});

// GET /api/v1/me/donations
export const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await meService.getMyDonations(req.user.id);
  res.status(200).json({ success: true, data: { donations } });
});

// GET /api/v1/me/camps
export const getMyUpcomingCamps = asyncHandler(async (req, res) => {
  const camps = await meService.getMyUpcomingCamps(req.user.id);
  res.status(200).json({ success: true, data: { camps } });
});

// GET /api/v1/me/notifications?filter=unread|all
export const getMyNotifications = asyncHandler(async (req, res) => {
  const data = await meService.getMyNotifications(req.user.id, {
    filter: req.query.filter,
  });
  res.status(200).json({ success: true, data });
});

// PATCH /api/v1/me/notifications/:id/read
export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await meService.markOneRead(
    req.user.id,
    req.params.id,
  );
  res.status(200).json({ success: true, data: { notification } });
});

// PATCH /api/v1/me/notifications/read-all
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await meService.markAllRead(req.user.id);
  res.status(200).json({ success: true, data: result });
});