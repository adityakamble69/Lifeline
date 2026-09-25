import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminNotifications.repository.js';

const TYPE_META = {
  donor_approval: 'Donor Approval',
  request_verification: 'Request',
  camp_published: 'Camp',
  team_activity: 'Team',
  alert: 'Alert',
  system: 'System',
};

export async function getNotifications({
  userId,
  type,
  status,
  search,
  page = 1,
  pageSize = 30,
}) {
  const limit = Math.min(Math.max(Number(pageSize) || 30, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * limit;

  const [result, counts] = await Promise.all([
    repo.listNotifications({ userId, type, status, search, limit, offset }),
    repo.getCountsByType(userId),
  ]);

  return {
    notifications: result.rows,
    pagination: {
      page: safePage,
      page_size: limit,
      total: result.total,
      total_pages: Math.max(Math.ceil(result.total / limit), 1),
    },
    counts: {
      ...counts,
      by_type_labeled: Object.entries(counts.by_type).map(([t, c]) => ({
        type: t,
        label: TYPE_META[t] ?? t,
        count: c,
      })),
    },
  };
}

export async function markNotificationRead(userId, notificationId) {
  const row = await repo.markRead(userId, notificationId);
  if (!row) throw ApiError.notFound('Notification not found.');
  return row;
}

export async function markAllNotificationsRead(userId) {
  await repo.markAllRead(userId);
  return { success: true };
}

export async function deleteOne(userId, notificationId) {
  await repo.deleteNotification(userId, notificationId);
  return { success: true };
}

export async function deleteAllRead(userId) {
  await repo.deleteAllRead(userId);
  return { success: true };
}