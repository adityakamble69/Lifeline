import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) {
    throw ApiError.internal(
      'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }
}

export async function findByClerkUserId(clerkUserId) {
  assertDb();
  const { data, error } = await supabase
    .from('users')
    .select('id, clerk_user_id, name, email, phone, role, status, email_verified_at, last_login_at, created_at, updated_at')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle();

  if (error) throw ApiError.internal('Failed to fetch user.');
  return data;
}

export async function insertUser({ clerkUserId, name, email, phone }) {
  assertDb();
  const { data, error } = await supabase
    .from('users')
    .insert({
      clerk_user_id: clerkUserId,
      name,
      email,
      phone: phone ?? null,
      role: 'donor',
      status: 'active',
      email_verified_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    // Unique violation on email or clerk_user_id
    if (error.code === '23505') throw ApiError.conflict('User already exists.');
    throw ApiError.internal('Failed to create user.');
  }
  return data;
}

export async function touchLastLogin(userId) {
  assertDb();
  await supabase
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', userId);
}