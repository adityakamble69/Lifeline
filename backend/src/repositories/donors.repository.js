import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function searchDonors({ bloodGroup, city, availability }) {
  assertDb();

  let query = supabase
    .from('donor_profiles')
    .select(`
      id,
      blood_group,
      date_of_birth,
      gender,
      city,
      state,
      availability_status,
      last_donation_date,
      consent_to_contact,
      approval_status,
      user:users!donor_profiles_user_id_fkey ( id, name, phone, status )
    `)
    .eq('consent_to_contact', true)
    .eq('approval_status', 'approved')
    .eq('user.status', 'active')
    .order('last_donation_date', { ascending: false, nullsFirst: false })
    .limit(50);

  if (bloodGroup && bloodGroup !== 'Any') {
    query = query.eq('blood_group', bloodGroup);
  }
  if (city) {
    query = query.ilike('city', `%${city}%`);
  }
  if (availability === 'available') {
    query = query.eq('availability_status', 'available');
  }

  const { data, error } = await query;
  if (error) {
    console.error('[donors.searchDonors]', error);
    throw ApiError.internal('Failed to search donors.');
  }
  return data ?? [];
}

export async function listAllForAdmin({
  search,
  bloodGroup,
  city,
  approvalStatus,
  limit = 50,
  offset = 0,
} = {}) {
  assertDb();

  let query = supabase
    .from('donor_profiles')
    .select(
      `
      id, blood_group, date_of_birth, gender, city, state, address,
      availability_status, last_donation_date, consent_to_contact,
      approval_status, rejection_reason, reviewed_at, created_at, weight_kg,
      users!donor_profiles_user_id_fkey!inner ( id, name, email, phone, status, created_at )
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false });

  if (bloodGroup && bloodGroup !== 'Any') {
    query = query.eq('blood_group', bloodGroup);
  }
  if (city) {
    query = query.ilike('city', `%${city}%`);
  }
  if (approvalStatus && approvalStatus !== 'all') {
    query = query.eq('approval_status', approvalStatus);
  }
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      { foreignTable: 'users' },
    );
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('[donors.listAllForAdmin]', error);
    throw ApiError.internal('Failed to fetch donors.');
  }
  return { rows: data ?? [], total: count ?? 0 };
}