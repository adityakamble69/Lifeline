import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/adminNotifications.service.js';

// GET /api/v1/admin/notifications
export const listNotifications = asyncHandler(async (req, res) => {
  const data = await service.getNotifications({
    userId: req.user.id,
    type: req.query.type,
    status: req.query.status,
    search: req.query.search,
    page: req.query.page,
    pageSize: req.query.page_size,
  });
  res.status(200).json({ success: true, data });
});

// PATCH /api/v1/admin/notifications/:id/read
export const markRead = asyncHandler(async (req, res) => {
  const notification = await service.markNotificationRead(
    req.user.id,
    req.params.id,
  );
  res.status(200).json({ success: true, data: { notification } });
});

// PATCH /api/v1/admin/notifications/read-all
export const markAllRead = asyncHandler(async (req, res) => {
  const result = await service.markAllNotificationsRead(req.user.id);
  res.status(200).json({ success: true, data: result });
});

// DELETE /api/v1/admin/notifications/:id
export const deleteOne = asyncHandler(async (req, res) => {
  const result = await service.deleteOne(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: result });
});

// DELETE /api/v1/admin/notifications/clear-read
export const deleteAllRead = asyncHandler(async (req, res) => {
  const result = await service.deleteAllRead(req.user.id);
  res.status(200).json({ success: true, data: result });
});