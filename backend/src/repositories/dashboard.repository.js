import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function getDonorCounts() {
  assertDb();
  const { data, error } = await supabase
    .from('donor_profiles')
    .select('approval_status');

  if (error) {
    console.error('[dashboard.getDonorCounts]', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }
  const counts = { total: 0, pending: 0, approved: 0, rejected: 0 };
  for (const row of data ?? []) {
    counts.total += 1;
    counts[row.approval_status] = (counts[row.approval_status] ?? 0) + 1;
  }
  return counts;
}

export async function getCampCounts() {
  assertDb();
  const { data, error } = await supabase
    .from('camps')
    .select('id, status, start_at, capacity');

  if (error) {
    console.error('[dashboard.getCampCounts]', error);
    return { total: 0, upcoming: 0, completed: 0, cancelled: 0 };
  }
  const now = Date.now();
  const counts = { total: 0, upcoming: 0, completed: 0, cancelled: 0 };
  for (const row of data ?? []) {
    counts.total += 1;
    if (row.status === 'cancelled') counts.cancelled += 1;
    else if (new Date(row.start_at).getTime() > now) counts.upcoming += 1;
    else counts.completed += 1;
  }
  return counts;
}

export async function getRequestCounts() {
  assertDb();
  const { data, error } = await supabase
    .from('blood_requests')
    .select('id, status, urgency');

  if (error) {
    console.error('[dashboard.getRequestCounts]', error);
    return { total: 0, pending: 0, verified: 0, fulfilled: 0, critical: 0 };
  }
  const counts = {
    total: 0,
    pending: 0,
    verified: 0,
    fulfilled: 0,
    critical: 0,
  };
  for (const row of data ?? []) {
    counts.total += 1;
    if (['pending', 'verified', 'fulfilled'].includes(row.status)) {
      counts[row.status] += 1;
    }
    if (row.urgency === 'critical' && row.status !== 'fulfilled') {
      counts.critical += 1;
    }
  }
  return counts;
}

export async function getRegistrationCounts() {
  assertDb();
  const { count, error } = await supabase
    .from('camp_registrations')
    .select('id', { count: 'exact', head: true });

  if (error) return { total: 0 };
  return { total: count ?? 0 };
}

export async function getPendingApprovals(limit = 5) {
  assertDb();
  const { data, error } = await supabase
    .from('donor_profiles')
    .select(`
      id, blood_group, city, state, created_at, approval_status,
      users!donor_profiles_user_id_fkey!inner ( id, name, email, phone, created_at )
    `)
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[dashboard.getPendingApprovals]', error);
    return [];
  }
  return data ?? [];
}

export async function getUpcomingCamps(limit = 5) {
  assertDb();
  const { data, error } = await supabase
    .from('camps')
    .select(
      'id, title, venue, city, start_at, end_at, capacity, status, organization_id, organizations ( name )',
    )
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[dashboard.getUpcomingCamps]', error);
    return [];
  }
  return data ?? [];
}

export async function getRecentRequests(limit = 5) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_requests')
    .select(
      'id, patient_name, blood_group, units_required, hospital_name, city, urgency, status, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[dashboard.getRecentRequests]', error);
    return [];
  }
  return data ?? [];
}

export async function getRecentRegistrations(limit = 5) {
  assertDb();
  const { data, error } = await supabase
    .from('camp_registrations')
    .select(`
      id, status, registered_at,
      users ( id, name ),
      camps ( id, title, city )
    `)
    .order('registered_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[dashboard.getRecentRegistrations]', error);
    return [];
  }
  return data ?? [];
}