import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminCamps.repository.js';

const VALID_STATUSES = [
  'draft',
  'published',
  'upcoming',
  'registration_open',
  'completed',
  'cancelled',
];

function validateCampPayload(body, { partial = false } = {}) {
  const details = {};

  if (!partial || body.title !== undefined) {
    if (!body.title?.trim()) details.title = 'Required.';
  }
  if (!partial || body.venue !== undefined) {
    if (!body.venue?.trim()) details.venue = 'Required.';
  }
  if (!partial || body.city !== undefined) {
    if (!body.city?.trim()) details.city = 'Required.';
  }
  if (!partial || body.state !== undefined) {
    if (!body.state?.trim()) details.state = 'Required.';
  }
  if (!partial || body.start_at !== undefined) {
    if (!body.start_at) details.start_at = 'Required.';
    else if (Number.isNaN(new Date(body.start_at).getTime()))
      details.start_at = 'Invalid datetime.';
  }
  if (!partial || body.end_at !== undefined) {
    if (!body.end_at) details.end_at = 'Required.';
    else if (Number.isNaN(new Date(body.end_at).getTime()))
      details.end_at = 'Invalid datetime.';
  }
  if (!partial || body.capacity !== undefined) {
    const c = Number(body.capacity);
    if (!Number.isInteger(c) || c < 1 || c > 100000)
      details.capacity = 'Must be between 1 and 100000.';
  }
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    details.status = 'Invalid status.';
  }
  if (body.start_at && body.end_at) {
    if (new Date(body.end_at).getTime() <= new Date(body.start_at).getTime()) {
      details.end_at = 'Must be after start time.';
    }
  }

  if (Object.keys(details).length > 0) {
    throw ApiError.validation('Invalid camp data.', details);
  }
}

function shapeCamp(row, registered = 0) {
  const org = Array.isArray(row.organizations)
    ? row.organizations[0]
    : row.organizations;
  const creator = Array.isArray(row.users)
    ? row.users[0]
    : row.users;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    venue: row.venue,
    city: row.city,
    state: row.state,
    start_at: row.start_at,
    end_at: row.end_at,
    capacity: row.capacity,
    status: row.status,
    contact_phone: row.contact_phone,
    organization_id: row.organization_id,
    organization_name: org?.name ?? 'Lifeline',
    created_by_name: creator?.name ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    registered: registered,
    capacity_percent: row.capacity
      ? Math.min(100, Math.round((registered / row.capacity) * 100))
      : 0,
  };
}

export async function listCamps({ organizationId, status, search, page = 1, pageSize = 20 }) {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * limit;

  const { rows, total } = await repo.listAdminCamps({
    organizationId,
    status,
    search,
    limit,
    offset,
  });

  const ids = rows.map((r) => r.id);
  const counts = await repo.countRegistrationsByCampIds(ids);

  const camps = rows.map((r) => shapeCamp(r, counts[r.id] ?? 0));

  return {
    camps,
    pagination: {
      page: safePage,
      page_size: limit,
      total,
      total_pages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function createCamp({ organizationId, userId, body }) {
  validateCampPayload(body);

  const payload = {
    organization_id: organizationId,
    created_by: userId,
    title: body.title.trim(),
    description: body.description?.trim() || null,
    venue: body.venue.trim(),
    city: body.city.trim(),
    state: body.state.trim(),
    start_at: body.start_at,
    end_at: body.end_at,
    capacity: Number(body.capacity),
    status: body.status ?? 'draft',
    contact_phone: body.contact_phone?.trim() || null,
  };

  const row = await repo.create(payload);
  return shapeCamp(row, 0);
}

export async function updateCamp({ campId, organizationId, body }) {
  const existing = await repo.findById(campId);
  if (!existing) throw ApiError.notFound('Camp not found.');

  if (existing.organization_id !== organizationId) {
    throw ApiError.forbidden(
      'You do not have permission to edit this camp.',
    );
  }

  validateCampPayload(body, { partial: true });

  const patch = {};
  const fields = ['title', 'description', 'venue', 'city', 'state', 'contact_phone'];
  for (const f of fields) {
    if (body[f] !== undefined) patch[f] = body[f]?.trim() || null;
  }
  if (body.start_at !== undefined) patch.start_at = body.start_at;
  if (body.end_at !== undefined) patch.end_at = body.end_at;
  if (body.capacity !== undefined) patch.capacity = Number(body.capacity);
  if (body.status !== undefined) patch.status = body.status;

  const row = await repo.update(campId, patch);
  const registered = await repo.countRegistrations(campId);
  return shapeCamp(row, registered);
}

export async function changeStatus({ campId, organizationId, status }) {
  if (!VALID_STATUSES.includes(status)) {
    throw ApiError.validation('Invalid status.', { status: 'Invalid.' });
  }
  return updateCamp({ campId, organizationId, body: { status } });
}