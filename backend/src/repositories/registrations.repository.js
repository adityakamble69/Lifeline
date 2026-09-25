import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function findExisting(campId, userId) {
  assertDb();
  const { data, error } = await supabase
    .from('camp_registrations')
    .select('id, status')
    .eq('camp_id', campId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to check registration.');
  return data;
}

export async function create({ campId, userId }) {
  assertDb();
  const { data, error } = await supabase
    .from('camp_registrations')
    .insert({
      camp_id: campId,
      user_id: userId,
      status: 'registered',
      attendance_status: 'pending',
      registered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[registrations.create]', error);
    if (error.code === '23505')
      throw ApiError.conflict('You are already registered for this camp.');
    throw ApiError.internal('Failed to register for camp.');
  }
  return data;
}

export async function countForCamp(campId) {
  assertDb();
  const { count, error } = await supabase
    .from('camp_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('camp_id', campId);

  if (error) throw ApiError.internal('Failed to count registrations.');
  return count ?? 0;
}