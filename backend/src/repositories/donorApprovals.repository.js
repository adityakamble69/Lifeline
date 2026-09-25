import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listByStatus({ status = 'pending' } = {}) {
  assertDb();

  const { data, error } = await supabase
    .from('donor_profiles')
    .select(`
      id, blood_group, date_of_birth, gender, city, state, address,
      availability_status, last_donation_date, consent_to_contact,
      approval_status, rejection_reason, reviewed_by, reviewed_at,
      created_at, weight_kg,
      users!donor_profiles_user_id_fkey!inner ( id, name, email, phone, created_at )
    `)
    .eq('approval_status', status)
    .order('created_at', { ascending: true })
    .limit(200);

  if (error) {
    console.error('[donorApprovals.listByStatus]', error);
    throw ApiError.internal('Failed to fetch approvals.');
  }
  return data ?? [];
}

export async function findByDonorProfileId(id) {
  assertDb();
  const { data, error } = await supabase
    .from('donor_profiles')
    .select(`
      id, user_id, blood_group, date_of_birth, gender, city, state, address,
      availability_status, last_donation_date, consent_to_contact,
      approval_status, rejection_reason, reviewed_by, reviewed_at,
      created_at, weight_kg,
      users!donor_profiles_user_id_fkey ( id, name, email, phone, created_at )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch approval.');
  return data;
}

export async function updateApprovalStatus({
  donorProfileId,
  status,
  reviewerId,
  rejectionReason,
}) {
  assertDb();

  const patch = {
    approval_status: status,
    reviewed_by: reviewerId,
    reviewed_at: new Date().toISOString(),
    rejection_reason: status === 'rejected' ? rejectionReason : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('donor_profiles')
    .update(patch)
    .eq('id', donorProfileId)
    .select()
    .single();

  if (error) {
    console.error('[donorApprovals.updateApprovalStatus]', error);
    throw ApiError.internal('Failed to update approval status.');
  }
  return data;
}

export async function countByStatus() {
  assertDb();
  const { data, error } = await supabase
    .from('donor_profiles')
    .select('approval_status');

  if (error) return { pending: 0, approved: 0, rejected: 0 };

  const counts = { pending: 0, approved: 0, rejected: 0 };
  for (const row of data ?? []) {
    counts[row.approval_status] = (counts[row.approval_status] ?? 0) + 1;
  }
  return counts;
}