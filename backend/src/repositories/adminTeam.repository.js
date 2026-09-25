import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listMembers({ organizationId, search, role, status }) {
  assertDb();

  let query = supabase
    .from('organization_members')
    .select(`
      id, organization_id, user_id, role, status, joined_at, updated_at,
      users!organization_members_user_id_fkey!inner ( id, name, email, phone, role )
    `)
    .eq('organization_id', organizationId)
    .order('joined_at', { ascending: true });

  if (role && role !== 'all') query = query.eq('role', role);
  if (status && status !== 'all') query = query.eq('status', status);
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      { foreignTable: 'users' },
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error('[adminTeam.listMembers]', error);
    throw ApiError.internal('Failed to fetch team members.');
  }
  return data ?? [];
}

export async function findMemberById(memberId, organizationId) {
  assertDb();
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      id, organization_id, user_id, role, status, joined_at,
      users!organization_members_user_id_fkey ( id, name, email, phone )
    `)
    .eq('id', memberId)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch member.');
  return data;
}

export async function findUserByEmail(email) {
  assertDb();
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to find user.');
  return data;
}

export async function findMembership(organizationId, userId) {
  assertDb();
  const { data, error } = await supabase
    .from('organization_members')
    .select('id, role, status')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to check membership.');
  return data;
}

export async function addMember({ organizationId, userId, role }) {
  assertDb();
  const { data, error } = await supabase
    .from('organization_members')
    .insert({
      organization_id: organizationId,
      user_id: userId,
      role,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('[adminTeam.addMember]', error);
    if (error.code === '23505') {
      throw ApiError.conflict('User is already a member.');
    }
    throw ApiError.internal('Failed to add member.');
  }
  return data;
}

export async function updateMember(memberId, patch) {
  assertDb();
  const { data, error } = await supabase
    .from('organization_members')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', memberId)
    .select()
    .single();

  if (error) {
    console.error('[adminTeam.updateMember]', error);
    throw ApiError.internal('Failed to update member.');
  }
  return data;
}

export async function removeMember(memberId) {
  assertDb();
  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('[adminTeam.removeMember]', error);
    throw ApiError.internal('Failed to remove member.');
  }
  return true;
}

export async function countOwners(organizationId) {
  assertDb();
  const { count, error } = await supabase
    .from('organization_members')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('role', 'owner')
    .eq('status', 'active');

  if (error) return 0;
  return count ?? 0;
}