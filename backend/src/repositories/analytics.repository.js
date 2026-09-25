import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function fetchRawData(organizationId) {
  assertDb();

  const [donorsRes, donationsRes, requestsRes, campsRes, volunteersRes] =
    await Promise.all([
      supabase
        .from('donor_profiles')
        .select('id, user_id, blood_group, city, state, approval_status, created_at, last_donation_date'),
      supabase
        .from('donations')
        .select('id, donor_id, donation_date, blood_group, units, camp_id, status'),
      supabase
        .from('blood_requests')
        .select('id, blood_group, status, urgency, city, state, created_at, required_at, fulfilled_at'),
      supabase
        .from('camps')
        .select('id, title, city, state, start_at, capacity, status, organization_id')
        .eq('organization_id', organizationId),
      supabase
        .from('volunteers')
        .select('id, user_id, role, status'),
    ]);

  return {
    donors: donorsRes.data ?? [],
    donations: donationsRes.data ?? [],
    requests: requestsRes.data ?? [],
    camps: campsRes.data ?? [],
    volunteers: volunteersRes.data ?? [],
  };
}