import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminRequests.repository.js';

const VALID_STATUSES = [
  'pending',
  'verified',
  'in_progress',
  'fulfilled',
  'rejected',
  'expired',
];

function computeHoursLeft(requiredAt) {
  if (!requiredAt) return null;
  const diff = new Date(requiredAt).getTime() - Date.now();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60)));
}

function shapeRequest(row) {
  const requester = Array.isArray(row.requester) ? row.requester[0] : row.requester;
  return {
    id: row.id,
    patient_name: row.patient_name,
    blood_group: row.blood_group,
    units_required: row.units_required,
    hospital_name: row.hospital_name,
    city: row.city,
    state: row.state,
    urgency: row.urgency,
    required_at: row.required_at,
    hours_left: computeHoursLeft(row.required_at),
    status: row.status,
    contact_phone: row.contact_phone,
    description: row.description,
    verified_by: row.verified_by,
    verified_at: row.verified_at,
    fulfilled_at: row.fulfilled_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    requester: requester
      ? {
          id: requester.id,
          name: requester.name,
          email: requester.email,
          phone: requester.phone,
        }
      : null,
  };
}

export async function listRequests({
  status,
  urgency,
  bloodGroup,
  city,
  search,
  page = 1,
  pageSize = 20,
}) {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * limit;

  const { rows, total } = await repo.listRequests({
    status,
    urgency,
    bloodGroup,
    city,
    search,
    limit,
    offset,
  });

  return {
    requests: rows.map(shapeRequest),
    pagination: {
      page: safePage,
      page_size: limit,
      total,
      total_pages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function getCounts() {
  return repo.getStatusCounts();
}

export async function verifyRequest({ requestId, reviewerId }) {
  const existing = await repo.findById(requestId);
  if (!existing) throw ApiError.notFound('Request not found.');

  if (existing.status === 'verified') {
    throw ApiError.conflict('Request is already verified.');
  }
  if (['fulfilled', 'rejected'].includes(existing.status)) {
    throw ApiError.conflict(`Cannot verify a ${existing.status} request.`);
  }

  const row = await repo.updateStatus({
    requestId,
    status: 'verified',
    reviewerId,
    patch: {
      verified_by: reviewerId,
      verified_at: new Date().toISOString(),
    },
  });
  return shapeRequest(row);
}

export async function rejectRequest({ requestId, reviewerId, reason }) {
  if (!reason || !reason.trim()) {
    throw ApiError.validation('Rejection reason is required.', {
      reason: 'Required.',
    });
  }

  const existing = await repo.findById(requestId);
  if (!existing) throw ApiError.notFound('Request not found.');

  if (['fulfilled', 'rejected'].includes(existing.status)) {
    throw ApiError.conflict(`Cannot reject a ${existing.status} request.`);
  }

  const row = await repo.updateStatus({
    requestId,
    status: 'rejected',
    reviewerId,
    patch: {
      verified_by: reviewerId,
      verified_at: new Date().toISOString(),
      description: `${existing.description ?? ''}\n\n[Rejected: ${reason.trim()}]`.trim(),
    },
  });
  return shapeRequest(row);
}

export async function markFulfilled({ requestId, reviewerId }) {
  const existing = await repo.findById(requestId);
  if (!existing) throw ApiError.notFound('Request not found.');

  if (existing.status === 'fulfilled') {
    throw ApiError.conflict('Request is already fulfilled.');
  }
  if (existing.status === 'rejected') {
    throw ApiError.conflict('Cannot fulfill a rejected request.');
  }

  const row = await repo.updateStatus({
    requestId,
    status: 'fulfilled',
    reviewerId,
    patch: {
      fulfilled_at: new Date().toISOString(),
    },
  });
  return shapeRequest(row);
}

export async function setInProgress({ requestId, reviewerId }) {
  const existing = await repo.findById(requestId);
  if (!existing) throw ApiError.notFound('Request not found.');

  if (existing.status === 'pending') {
    throw ApiError.conflict('Verify the request first.');
  }
  if (['fulfilled', 'rejected'].includes(existing.status)) {
    throw ApiError.conflict(`Cannot update a ${existing.status} request.`);
  }

  const row = await repo.updateStatus({
    requestId,
    status: 'in_progress',
    reviewerId,
  });
  return shapeRequest(row);
}