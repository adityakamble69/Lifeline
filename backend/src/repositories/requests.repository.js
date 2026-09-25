import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

const PUBLIC_STATUSES = ['verified', 'pending', 'in_progress'];

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function createBloodRequest(payload) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_requests')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[requests.create]', error);
    throw ApiError.internal('Failed to create request.');
  }
  return data;
}

export async function findById(id) {
  assertDb();
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch request.');
  return data;
}

export async function listPublicRequests({ bloodGroup, city, urgency } = {}) {
  assertDb();

  let query = supabase
    .from('blood_requests')
    .select(`
      id, patient_name, blood_group, units_required, hospital_name,
      city, state, urgency, required_at, status, contact_phone,
      description, created_at,
      requester:users!blood_requests_requester_id_fkey ( id, name )
    `)
    .in('status', PUBLIC_STATUSES)
    .order('urgency', { ascending: true })
    .order('required_at', { ascending: true, nullsFirst: false })
    .limit(50);

  if (bloodGroup && bloodGroup !== 'Any') {
    query = query.eq('blood_group', bloodGroup);
  }
  if (city) {
    query = query.ilike('city', `%${city}%`);
  }
  if (urgency && urgency !== 'all') {
    query = query.eq('urgency', urgency);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[requests.listPublic]', error);
    throw ApiError.internal('Failed to fetch requests.');
  }
  return data ?? [];
}