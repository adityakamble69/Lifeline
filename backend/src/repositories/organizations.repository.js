import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function findMembershipsByUserId(userId) {
  assertDb();
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      id, organization_id, user_id, role, status, joined_at,
      organizations ( id, name, type, city, state )
    `)
    .eq('user_id', userId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('[orgs.findMembershipsByUserId]', error);
    throw ApiError.internal('Failed to fetch memberships.');
  }
  return data ?? [];
}

export async function findMembership(userId, organizationId) {
  assertDb();
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      id, organization_id, user_id, role, status, joined_at,
      organizations ( id, name, type, city, state )
    `)
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('[orgs.findMembership]', error);
    return null;
  }
  return data;
}

export async function getOrganization(organizationId) {
  assertDb();
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch organization.');
  return data;
}

export async function listMembers(organizationId) {
  assertDb();
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      id, user_id, role, status, joined_at,
      users ( id, name, email, phone )
    `)
    .eq('organization_id', organizationId)
    .eq('status', 'active')
    .order('joined_at', { ascending: true });

  if (error) throw ApiError.internal('Failed to fetch members.');
  return data ?? [];
}