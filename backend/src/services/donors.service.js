import * as donorsRepo from '../repositories/donors.repository.js';

function computeAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function monthsSince(dateStr) {
  if (!dateStr) return null;
  const past = new Date(dateStr);
  const now = new Date();
  const months =
    (now.getFullYear() - past.getFullYear()) * 12 +
    (now.getMonth() - past.getMonth());
  return months;
}

export async function searchDonors({ bloodGroup, city, availability }) {
  const rows = await donorsRepo.searchDonors({ bloodGroup, city, availability });

  return rows.map((row) => {
    const months = monthsSince(row.last_donation_date);
    // Map DB values → frontend labels
    let availabilityState;
    if (row.availability_status === 'available') {
      availabilityState = 'available';
    } else if (months !== null && months < 3) {
      availabilityState = 'cooldown';
    } else {
      availabilityState = 'busy';
    }

    return {
      id: row.user?.id ?? row.id, // user.id is the identity used by UI
      name: row.user?.name ?? 'Anonymous Donor',
      age: computeAge(row.date_of_birth),
      blood_group: row.blood_group,
      city: row.city,
      state: row.state,
      availability: availabilityState,
      last_donation: row.last_donation_date,
      verified: true, // TODO: wire to donor_approvals when seeded
      consent_to_contact: row.consent_to_contact,
    };
  });
}

export async function listAllDonors({
  search,
  bloodGroup,
  city,
  approvalStatus,
  page = 1,
  pageSize = 20,
} = {}) {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * limit;

  const { rows, total } = await donorsRepo.listAllForAdmin({
    search,
    bloodGroup,
    city,
    approvalStatus,
    limit,
    offset,
  });

  const donors = rows.map((row) => {
    const user = Array.isArray(row.users) ? row.users[0] : row.users;
    return {
      id: row.id,
      user_id: user?.id ?? null,
      name: user?.name ?? 'Unknown',
      email: user?.email ?? null,
      phone: user?.phone ?? null,
      user_status: user?.status ?? 'active',
      registered_at: user?.created_at ?? row.created_at,
      blood_group: row.blood_group,
      age: computeAge(row.date_of_birth),
      date_of_birth: row.date_of_birth,
      gender: row.gender,
      city: row.city,
      state: row.state,
      address: row.address,
      weight_kg: row.weight_kg,
      availability_status: row.availability_status,
      last_donation_date: row.last_donation_date,
      consent_to_contact: row.consent_to_contact,
      approval_status: row.approval_status,
      rejection_reason: row.rejection_reason,
      reviewed_at: row.reviewed_at,
      created_at: row.created_at,
    };
  });

  return {
    donors,
    pagination: {
      page: safePage,
      page_size: limit,
      total,
      total_pages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}