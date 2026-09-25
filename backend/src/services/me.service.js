import * as meRepo from '../repositories/me.repository.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

function computeAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function computeNextEligibleDate(lastDonationDate) {
  if (!lastDonationDate) return null;
  const d = new Date(lastDonationDate);
  d.setDate(d.getDate() + 90); // 3 months — whole blood donation cooldown
  return d.toISOString().split('T')[0];
}

function computeProfileCompletion(user, donor) {
  if (!user) return 0;
  const checks = [
    !!user.name,
    !!user.email,
    !!user.phone,
    !!donor?.blood_group,
    !!donor?.date_of_birth,
    !!donor?.city,
    !!donor?.state,
    !!donor?.address,
    donor?.consent_to_contact === true,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

// ─── Profile ────────────────────────────────────────────────────────────────

export async function getMyProfile(userId) {
  const row = await meRepo.findUserWithDonorProfile(userId);
  if (!row) return null;

  const donor = Array.isArray(row.donor_profiles)
    ? row.donor_profiles[0]
    : row.donor_profiles;

  const nextEligible = computeNextEligibleDate(donor?.last_donation_date);

  return {
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      status: row.status,
      created_at: row.created_at,
      last_login_at: row.last_login_at,
    },
    donor: donor
      ? {
          id: donor.id,
          blood_group: donor.blood_group,
          age: computeAge(donor.date_of_birth),
          date_of_birth: donor.date_of_birth,
          gender: donor.gender,
          city: donor.city,
          state: donor.state,
          address: donor.address,
          availability_status: donor.availability_status,
          last_donation_date: donor.last_donation_date,
          next_eligible_date: nextEligible,
          consent_to_contact: donor.consent_to_contact,

          // Approval workflow
          approval_status: donor.approval_status ?? 'pending',
          rejection_reason: donor.rejection_reason ?? null,
          reviewed_at: donor.reviewed_at ?? null,

          // Health Information
          weight_kg: donor.weight_kg,
          medical_conditions: donor.medical_conditions,
          on_medication: donor.on_medication ?? false,
          allergies: donor.allergies,

          // Emergency Contact
          emergency_contact_name: donor.emergency_contact_name,
          emergency_contact_phone: donor.emergency_contact_phone,
          emergency_contact_relationship:
            donor.emergency_contact_relationship,

          // Preferences
          preferred_language: donor.preferred_language ?? 'English',
          default_search_radius_km: donor.default_search_radius_km ?? 25,
          preferred_blood_groups: donor.preferred_blood_groups ?? [],

          // Documents
          id_document_url: donor.id_document_url,
          medical_certificate_url: donor.medical_certificate_url,
          documents_uploaded_at: donor.documents_uploaded_at,
        }
      : null,
    profile_completion: computeProfileCompletion(row, donor),
  };
}

// ─── Stats ──────────────────────────────────────────────────────────────────

export async function getMyStats(userId) {
  const profile = await getMyProfile(userId);
  if (!profile) return null;

  const [donations, upcoming, notifications] = await Promise.all([
    meRepo.listDonationsByUserId(userId),
    meRepo.countUpcomingCampsForUser(userId),
    meRepo.listRecentNotifications(userId, 5),
  ]);

  const totalDonations = donations.length;
  const livesSaved = totalDonations * 3;

  return {
    blood_group: profile.donor?.blood_group ?? null,
    total_donations: totalDonations,
    lives_saved: livesSaved,
    upcoming_camps: upcoming,
    next_eligible_date: profile.donor?.next_eligible_date ?? null,
    profile_completion: profile.profile_completion,
    approval_status: profile.donor?.approval_status ?? null,
    recent_notifications: notifications,
  };
}

// ─── Donations & Camps ──────────────────────────────────────────────────────

export async function getMyDonations(userId) {
  return meRepo.listDonationsByUserId(userId);
}

export async function getMyUpcomingCamps(userId) {
  return meRepo.listUpcomingCampRegistrations(userId);
}

// ─── Notifications ──────────────────────────────────────────────────────────

export async function getMyNotifications(userId, { filter } = {}) {
  const rows = await meRepo.listNotificationsForUser(userId, { filter });
  const unreadCount = rows.filter((n) => !n.is_read).length;

  return {
    notifications: rows,
    unread_count: unreadCount,
    total: rows.length,
  };
}

export async function markOneRead(userId, notificationId) {
  const row = await meRepo.markNotificationRead(userId, notificationId);
  if (!row) {
    const { ApiError } = await import('../utils/ApiError.js');
    throw ApiError.notFound('Notification not found.');
  }
  return row;
}

export async function markAllRead(userId) {
  await meRepo.markAllNotificationsRead(userId);
  return { success: true };
}

// ─── Updates ────────────────────────────────────────────────────────────────

export async function updateMyUser(userId, body) {
  const patch = {};
  if (typeof body.name === 'string' && body.name.trim())
    patch.name = body.name.trim();
  if (typeof body.phone === 'string') patch.phone = body.phone.trim() || null;

  if (Object.keys(patch).length === 0) return getMyProfile(userId);
  await meRepo.updateUser(userId, patch);
  return getMyProfile(userId);
}

export async function updateMyDonor(userId, body) {
  const patch = {};

  // Simple string fields
  const stringFields = [
    'blood_group',
    'date_of_birth',
    'gender',
    'city',
    'state',
    'address',
    'availability_status',
    'last_donation_date',
    'medical_conditions',
    'allergies',
    'emergency_contact_name',
    'emergency_contact_phone',
    'emergency_contact_relationship',
    'preferred_language',
    'id_document_url',
    'medical_certificate_url',
  ];
  for (const key of stringFields) {
    if (typeof body[key] === 'string') {
      patch[key] = body[key].trim() || null;
    }
  }

  // Boolean fields
  if (typeof body.consent_to_contact === 'boolean') {
    patch.consent_to_contact = body.consent_to_contact;
  }
  if (typeof body.on_medication === 'boolean') {
    patch.on_medication = body.on_medication;
  }

  // Numeric fields
  if (body.weight_kg !== undefined) {
    const w = Number(body.weight_kg);
    patch.weight_kg = Number.isFinite(w) && w > 0 ? w : null;
  }
  if (body.default_search_radius_km !== undefined) {
    const r = Number(body.default_search_radius_km);
    patch.default_search_radius_km =
      Number.isFinite(r) && r > 0 ? r : null;
  }

  // Array field
  if (Array.isArray(body.preferred_blood_groups)) {
    patch.preferred_blood_groups = body.preferred_blood_groups;
  }

  if (Object.keys(patch).length === 0) return getMyProfile(userId);

  // Upsert: create profile if it doesn't exist yet, else update.
  const existing = await meRepo.findUserWithDonorProfile(userId);
  const hasDonorProfile = Boolean(existing?.donor_profiles);

  if (!hasDonorProfile) {
    // New donor profile → starts as "pending"
    await meRepo.createDonorProfile(userId, patch);
  } else {
    await meRepo.updateDonorProfile(userId, patch);
  }

  return getMyProfile(userId);
}