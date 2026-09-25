import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listRequests({
  status,
  urgency,
  bloodGroup,
  city,
  search,
  limit = 50,
  offset = 0,
}) {
  assertDb();

  let query = supabase
    .from('blood_requests')
    .select(
      `
      id, patient_name, blood_group, units_required, hospital_name,
      city, state, urgency, required_at, status, contact_phone,
      description, verified_by, verified_at, fulfilled_at,
      created_at, updated_at,
      requester:users!blood_requests_requester_id_fkey ( id, name, email, phone )
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false });

  if (status && status !== 'all') query = query.eq('status', status);
  if (urgency && urgency !== 'all') query = query.eq('urgency', urgency);
  if (bloodGroup && bloodGroup !== 'Any')
    query = query.eq('blood_group', bloodGroup);
  if (city) query = query.ilike('city', `%${city}%`);
  if (search) {
    query = query.or(
      `patient_name.ilike.%${search}%,hospital_name.ilike.%${search}%`,
    );
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('[adminRequests.list]', error);
    throw ApiError.internal('Failed to fetch requests.');
  }
  return { rows: data ?? [], total: count ?? 0 };
}

export async function findById(requestId) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_requests')
    .select(
      `
      id, patient_name, blood_group, units_required, hospital_name,
      city, state, urgency, required_at, status, contact_phone,
      description, verified_by, verified_at, fulfilled_at,
      created_at, updated_at,
      requester:users!blood_requests_requester_id_fkey ( id, name, email, phone )
    `,
    )
    .eq('id', requestId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch request.');
  return data;
}

export async function updateStatus({
  requestId,
  status,
  reviewerId,
  patch = {},
}) {
  assertDb();

  const update = {
    status,
    updated_at: new Date().toISOString(),
    ...patch,
  };

  const { data, error } = await supabase
    .from('blood_requests')
    .update(update)
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    console.error('[adminRequests.updateStatus]', error);
    throw ApiError.internal('Failed to update request.');
  }
  return data;
}

export async function getStatusCounts() {
  assertDb();
  const { data, error } = await supabase
    .from('blood_requests')
    .select('status, urgency');

  if (error) return { total: 0, pending: 0, verified: 0, fulfilled: 0, critical: 0 };

  const counts = {
    total: 0,
    pending: 0,
    verified: 0,
    in_progress: 0,
    fulfilled: 0,
    rejected: 0,
    critical: 0,
  };
  for (const row of data ?? []) {
    counts.total += 1;
    if (counts[row.status] !== undefined) counts[row.status] += 1;
    if (row.urgency === 'critical' && row.status !== 'fulfilled') {
      counts.critical += 1;
    }
  }
  return counts;
}