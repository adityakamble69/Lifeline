import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listRegistrations({
  campId,
  status,
  search,
  limit = 50,
  offset = 0,
}) {
  assertDb();

  let query = supabase
    .from('camp_registrations')
    .select(
      `
      id, camp_id, user_id, status, attendance_status,
      registered_at, attended_at, updated_at,
      camps ( id, title, venue, city, start_at, end_at ),
      users!camp_registrations_user_id_fkey ( id, name, email, phone )
    `,
      { count: 'exact' },
    )
    .order('registered_at', { ascending: false });

  if (campId) query = query.eq('camp_id', campId);
  if (status && status !== 'all') query = query.eq('status', status);
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      { foreignTable: 'users' },
    );
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('[adminRegs.list]', error);
    throw ApiError.internal('Failed to fetch registrations.');
  }
  return { rows: data ?? [], total: count ?? 0 };
}

export async function getCounts() {
  assertDb();
  const { data, error } = await supabase
    .from('camp_registrations')
    .select('status, attendance_status');

  if (error) return { total: 0, confirmed: 0, pending: 0, cancelled: 0, attended: 0 };

  const counts = {
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    attended: 0,
  };
  for (const row of data ?? []) {
    counts.total += 1;
    if (counts[row.status] !== undefined) counts[row.status] += 1;
    if (row.attendance_status === 'attended') counts.attended += 1;
  }
  return counts;
}

export async function listCampOptions() {
  assertDb();
  const { data, error } = await supabase
    .from('camps')
    .select('id, title, city, start_at, status')
    .order('start_at', { ascending: false })
    .limit(100);

  if (error) return [];
  return data ?? [];
}

export async function updateStatus({ registrationId, status, attendanceStatus }) {
  assertDb();

  const patch = { updated_at: new Date().toISOString() };
  if (status) patch.status = status;
  if (attendanceStatus) {
    patch.attendance_status = attendanceStatus;
    if (attendanceStatus === 'attended') {
      patch.attended_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from('camp_registrations')
    .update(patch)
    .eq('id', registrationId)
    .select()
    .single();

  if (error) {
    console.error('[adminRegs.updateStatus]', error);
    throw ApiError.internal('Failed to update registration.');
  }
  return data;
}