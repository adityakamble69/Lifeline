import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listAdminCamps({
  organizationId,
  status,
  search,
  limit = 50,
  offset = 0,
}) {
  assertDb();

  let query = supabase
    .from('camps')
    .select(
      `
      id, title, description, venue, city, state,
      start_at, end_at, capacity, status, contact_phone,
      created_by, created_at, updated_at,
      organization_id,
      organizations ( id, name ),
      users!camps_created_by_fkey ( id, name )
    `,
      { count: 'exact' },
    )
    .order('start_at', { ascending: false });

  if (organizationId) query = query.eq('organization_id', organizationId);
  if (status && status !== 'all') query = query.eq('status', status);
  if (search) query = query.ilike('title', `%${search}%`);

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('[adminCamps.list]', error);
    throw ApiError.internal('Failed to fetch camps.');
  }
  return { rows: data ?? [], total: count ?? 0 };
}

export async function findById(campId) {
  assertDb();
  const { data, error } = await supabase
    .from('camps')
    .select(`
      id, title, description, venue, city, state,
      start_at, end_at, capacity, status, contact_phone,
      created_by, created_at, updated_at, organization_id,
      organizations ( id, name )
    `)
    .eq('id', campId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch camp.');
  return data;
}

export async function create(payload) {
  assertDb();
  const { data, error } = await supabase
    .from('camps')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[adminCamps.create]', error);
    throw ApiError.internal('Failed to create camp.');
  }
  return data;
}

export async function update(campId, patch) {
  assertDb();
  const { data, error } = await supabase
    .from('camps')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', campId)
    .select()
    .single();

  if (error) {
    console.error('[adminCamps.update]', error);
    throw ApiError.internal('Failed to update camp.');
  }
  return data;
}

export async function countRegistrations(campId) {
  assertDb();
  const { count, error } = await supabase
    .from('camp_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('camp_id', campId);

  if (error) return 0;
  return count ?? 0;
}

export async function countRegistrationsByCampIds(campIds) {
  if (!campIds.length) return {};
  assertDb();
  const { data, error } = await supabase
    .from('camp_registrations')
    .select('camp_id')
    .in('camp_id', campIds);

  if (error) return {};
  return data.reduce((acc, row) => {
    acc[row.camp_id] = (acc[row.camp_id] ?? 0) + 1;
    return acc;
  }, {});
}