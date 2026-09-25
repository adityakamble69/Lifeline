import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listNotifications({
  userId,
  type,
  status,
  search,
  limit = 50,
  offset = 0,
}) {
  assertDb();

  let query = supabase
    .from('notifications')
    .select('id, type, title, message, is_read, created_at, read_at, reference_type, reference_id', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (type && type !== 'all') query = query.eq('type', type);
  if (status === 'unread') query = query.eq('is_read', false);
  if (status === 'read') query = query.eq('is_read', true);
  if (search) {
    query = query.or(`title.ilike.%${search}%,message.ilike.%${search}%`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('[adminNotifications.list]', error);
    throw ApiError.internal('Failed to fetch notifications.');
  }
  return { rows: data ?? [], total: count ?? 0 };
}

export async function getCountsByType(userId) {
  assertDb();
  const { data, error } = await supabase
    .from('notifications')
    .select('type, is_read')
    .eq('user_id', userId);

  if (error) return { total: 0, unread: 0, by_type: {} };

  const counts = { total: 0, unread: 0, by_type: {} };
  for (const row of data ?? []) {
    counts.total += 1;
    if (!row.is_read) counts.unread += 1;
    counts.by_type[row.type] = (counts.by_type[row.type] ?? 0) + 1;
  }
  return counts;
}

export async function markRead(userId, notificationId) {
  assertDb();
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to update notification.');
  return data;
}

export async function markAllRead(userId) {
  assertDb();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('[adminNotifications.markAll]', error);
    throw ApiError.internal('Failed to mark all as read.');
  }
  return true;
}

export async function deleteNotification(userId, notificationId) {
  assertDb();
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) throw ApiError.internal('Failed to delete notification.');
  return true;
}

export async function deleteAllRead(userId) {
  assertDb();
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId)
    .eq('is_read', true);

  if (error) throw ApiError.internal('Failed to delete read notifications.');
  return true;
}