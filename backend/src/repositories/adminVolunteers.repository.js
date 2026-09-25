import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listVolunteers({
  search,
  role,
  status,
  city,
  limit = 50,
  offset = 0,
}) {
  assertDb();

  let query = supabase
    .from('volunteers')
    .select(
      `
      id, user_id, skills, role, availability, city, state, status,
      joined_at, updated_at,
      users!volunteers_user_id_fkey!inner ( id, name, email, phone )
    `,
      { count: 'exact' },
    )
    .order('joined_at', { ascending: false });

  if (role && role !== 'all') query = query.eq('role', role);
  if (status && status !== 'all') query = query.eq('status', status);
  if (city) query = query.ilike('city', `%${city}%`);
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      { foreignTable: 'users' },
    );
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('[adminVolunteers.list]', error);
    throw ApiError.internal('Failed to fetch volunteers.');
  }
  return { rows: data ?? [], total: count ?? 0 };
}

export async function getStats() {
  assertDb();
  const { data, error } = await supabase
    .from('volunteers')
    .select('role, status');

  if (error) return { total: 0, active: 0, inactive: 0, roles: {} };

  const stats = { total: 0, active: 0, inactive: 0, roles: {} };
  for (const row of data ?? []) {
    stats.total += 1;
    if (row.status === 'active') stats.active += 1;
    else stats.inactive += 1;
    if (row.role) {
      stats.roles[row.role] = (stats.roles[row.role] ?? 0) + 1;
    }
  }
  return stats;
}

export async function listRoleOptions() {
  assertDb();
  const { data, error } = await supabase
    .from('volunteers')
    .select('role')
    .not('role', 'is', null);

  if (error) return [];
  const unique = [...new Set((data ?? []).map((r) => r.role))].filter(Boolean);
  return unique.sort();
}

export async function updateVolunteer(volunteerId, patch) {
  assertDb();
  const { data, error } = await supabase
    .from('volunteers')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', volunteerId)
    .select()
    .single();

  if (error) {
    console.error('[adminVolunteers.update]', error);
    throw ApiError.internal('Failed to update volunteer.');
  }
  return data;
}