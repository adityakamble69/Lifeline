import { ApiError } from '../utils/ApiError.js';
import * as approvalsRepo from '../repositories/donorApprovals.repository.js';

function computeAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function shapeRow(row) {
  const user = Array.isArray(row.users) ? row.users[0] : row.users;
  return {
    id: row.id,
    user_id: user?.id ?? null,
    name: user?.name ?? 'Unknown',
    email: user?.email ?? null,
    phone: user?.phone ?? null,
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
}

export async function listApprovals({ status = 'pending' } = {}) {
  const rows = await approvalsRepo.listByStatus({ status });
  return rows.map(shapeRow);
}

export async function getApprovalCounts() {
  return approvalsRepo.countByStatus();
}

export async function approveDonor({ donorProfileId, reviewerId }) {
  const existing = await approvalsRepo.findByDonorProfileId(donorProfileId);
  if (!existing) throw ApiError.notFound('Donor profile not found.');

  if (existing.approval_status === 'approved') {
    throw ApiError.conflict('Donor is already approved.');
  }

  await approvalsRepo.updateApprovalStatus({
    donorProfileId,
    status: 'approved',
    reviewerId,
  });

  return { success: true, status: 'approved' };
}

export async function rejectDonor({ donorProfileId, reviewerId, reason }) {
  if (!reason || !reason.trim()) {
    throw ApiError.validation('Rejection reason is required.', {
      reason: 'Required.',
    });
  }

  const existing = await approvalsRepo.findByDonorProfileId(donorProfileId);
  if (!existing) throw ApiError.notFound('Donor profile not found.');

  await approvalsRepo.updateApprovalStatus({
    donorProfileId,
    status: 'rejected',
    reviewerId,
    rejectionReason: reason.trim(),
  });

  return { success: true, status: 'rejected' };
}