import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

const PUBLIC_STATUSES = ['published', 'upcoming', 'open', 'registration_open'];

export async function listPublicCamps({ city, status, limit = 50 } = {}) {
  assertDb();

  let query = supabase
    .from('camps')
    .select(`
      id, title, description, venue, city, state,
      start_at, end_at, capacity, status, contact_phone,
      organizations ( id, name )
    `)
    .order('start_at', { ascending: true })
    .limit(limit);

  if (city) query = query.ilike('city', `%${city}%`);

  if (status) {
    query = query.eq('status', status);
  } else {
    query = query.in('status', PUBLIC_STATUSES);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[camps.listPublic]', error);
    throw ApiError.internal('Failed to fetch camps.');
  }
  return data ?? [];
}

export async function findPublicCampById(campId) {
  assertDb();
  const { data, error } = await supabase
    .from('camps')
    .select(`
      id, title, description, venue, city, state,
      start_at, end_at, capacity, status, contact_phone,
      organizations ( id, name )
    `)
    .eq('id', campId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch camp.');
  return data;
}

// Batched registration count for a list of camp IDs.
export async function countByCampIds(campIds) {
  if (!campIds.length) return {};
  assertDb();

  const { data, error } = await supabase
    .from('camp_registrations')
    .select('camp_id')
    .in('camp_id', campIds);

  if (error) {
    console.error('[camps.countByCampIds]', error);
    return {};
  }

  return data.reduce((acc, row) => {
    acc[row.camp_id] = (acc[row.camp_id] || 0) + 1;
    return acc;
  }, {});
}