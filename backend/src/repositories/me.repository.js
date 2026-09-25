import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function findUserWithDonorProfile(userId) {
  assertDb();

  const { data, error } = await supabase
    .from('users')
    .select(`
      id, name, email, phone, role, status, created_at, last_login_at,
      donor_profiles!donor_profiles_user_id_fkey (
        id, blood_group, date_of_birth, gender, city, state, address,
        availability_status, last_donation_date, consent_to_contact,
        approval_status, rejection_reason, reviewed_at,
        weight_kg, medical_conditions, on_medication, allergies,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        preferred_language, default_search_radius_km, preferred_blood_groups,
        id_document_url, medical_certificate_url, documents_uploaded_at
      )
    `)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[me.findUserWithDonorProfile]', error);
    throw ApiError.internal('Failed to fetch profile.');
  }
  return data;
}

export async function listDonationsByUserId(userId) {
  assertDb();

  const { data: donor } = await supabase
    .from('donor_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!donor) return [];

  const { data, error } = await supabase
    .from('donations')
    .select(`
      id, donation_date, blood_group, units, status, notes, created_at,
      camps ( id, title, venue, city )
    `)
    .eq('donor_id', donor.id)
    .order('donation_date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[me.listDonations]', error);
    return [];
  }
  return data ?? [];
}

export async function countUpcomingCampsForUser(userId) {
  assertDb();

  const { count, error } = await supabase
    .from('camp_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('[me.countUpcomingCamps]', error);
    return 0;
  }
  return count ?? 0;
}

export async function listUpcomingCampRegistrations(userId) {
  assertDb();

  const { data, error } = await supabase
    .from('camp_registrations')
    .select(`
      id, status, registered_at,
      camps ( id, title, venue, city, start_at, end_at, status )
    `)
    .eq('user_id', userId)
    .order('registered_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('[me.listUpcomingCamps]', error);
    return [];
  }
  return data ?? [];
}

export async function listRecentNotifications(userId, limit = 5) {
  assertDb();

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, message, is_read, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[me.listNotifications]', error);
    return [];
  }
  return data ?? [];
}

export async function listNotificationsForUser(userId, { filter } = {}) {
  assertDb();

  let query = supabase
    .from('notifications')
    .select(
      'id, type, title, message, is_read, created_at, read_at, reference_type, reference_id',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (filter === 'unread') {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[me.listNotificationsForUser]', error);
    throw ApiError.internal('Failed to fetch notifications.');
  }
  return data ?? [];
}

export async function markNotificationRead(userId, notificationId) {
  assertDb();
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('[me.markNotificationRead]', error);
    throw ApiError.internal('Failed to update notification.');
  }
  return data;
}

export async function markAllNotificationsRead(userId) {
  assertDb();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('[me.markAllNotificationsRead]', error);
    throw ApiError.internal('Failed to update notifications.');
  }
  return true;
}

export async function updateUser(userId, patch) {
  assertDb();
  const { data, error } = await supabase
    .from('users')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('[me.updateUser]', error);
    throw ApiError.internal('Failed to update profile.');
  }
  return data;
}

export async function updateDonorProfile(userId, patch) {
  assertDb();

  const { data: profile, error: fetchErr } = await supabase
    .from('donor_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchErr) throw ApiError.internal('Failed to update donor profile.');
  if (!profile) throw ApiError.notFound('Donor profile not found.');

  const { data, error } = await supabase
    .from('donor_profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', profile.id)
    .select()
    .single();

  if (error) {
    console.error('[me.updateDonorProfile]', error);
    throw ApiError.internal('Failed to update donor profile.');
  }
  return data;
}

export async function createDonorProfile(userId, patch) {
  assertDb();

  const { data, error } = await supabase
    .from('donor_profiles')
    .insert({
      user_id: userId,
      approval_status: 'pending',
      ...patch,
    })
    .select()
    .single();

  if (error) {
    console.error('[me.createDonorProfile]', error);
    throw ApiError.internal('Failed to create donor profile.');
  }
  return data;
}