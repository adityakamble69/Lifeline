import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function findById(organizationId) {
  assertDb();
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch organization.');
  return data;
}

export async function update(organizationId, patch) {
  assertDb();
  const { data, error } = await supabase
    .from('organizations')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', organizationId)
    .select()
    .single();

  if (error) {
    console.error('[adminOrg.update]', error);
    throw ApiError.internal('Failed to update organization.');
  }
  return data;
}

export async function getStats(organizationId) {
  assertDb();

  // 1. Camps count
  const campsRes = await supabase
    .from('camps')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId);

  // 2. Members count
  const membersRes = await supabase
    .from('organization_members')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('status', 'active');

  // 3. Registrations count — first get camp IDs, then count
  const { data: orgCamps, error: campsErr } = await supabase
    .from('camps')
    .select('id')
    .eq('organization_id', organizationId);

  let registrationsCount = 0;
  if (!campsErr && Array.isArray(orgCamps) && orgCamps.length > 0) {
    const campIds = orgCamps.map((c) => c.id);
    const { count } = await supabase
      .from('camp_registrations')
      .select('id', { count: 'exact', head: true })
      .in('camp_id', campIds);
    registrationsCount = count ?? 0;
  }

  return {
    total_camps: campsRes.count ?? 0,
    total_registrations: registrationsCount,
    total_members: membersRes.count ?? 0,
  };
}