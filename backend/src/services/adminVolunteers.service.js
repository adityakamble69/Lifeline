import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminVolunteers.repository.js';

const VALID_STATUSES = ['active', 'inactive', 'pending'];

function shapeVolunteer(row) {
  const user = Array.isArray(row.users) ? row.users[0] : row.users;
  return {
    id: row.id,
    user_id: row.user_id,
    name: user?.name ?? 'Unknown',
    email: user?.email ?? null,
    phone: user?.phone ?? null,
    skills: row.skills,
    role: row.role,
    availability: row.availability ?? 'Flexible',
    city: row.city,
    state: row.state,
    status: row.status,
    joined_at: row.joined_at,
    updated_at: row.updated_at,
  };
}

export async function listVolunteers({
  search,
  role,
  status,
  city,
  page = 1,
  pageSize = 20,
}) {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * limit;

  const { rows, total } = await repo.listVolunteers({
    search,
    role,
    status,
    city,
    limit,
    offset,
  });

  return {
    volunteers: rows.map(shapeVolunteer),
    pagination: {
      page: safePage,
      page_size: limit,
      total,
      total_pages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function getStats() {
  const stats = await repo.getStats();
  const roleOptions = await repo.listRoleOptions();
  return { ...stats, role_options: roleOptions };
}

export async function updateVolunteer({ volunteerId, body }) {
  const patch = {};

  if (typeof body.role === 'string') patch.role = body.role.trim() || null;
  if (typeof body.availability === 'string')
    patch.availability = body.availability.trim() || null;
  if (typeof body.skills === 'string') patch.skills = body.skills.trim() || null;
  if (typeof body.city === 'string') patch.city = body.city.trim() || null;
  if (typeof body.state === 'string') patch.state = body.state.trim() || null;
  if (typeof body.status === 'string') {
    if (!VALID_STATUSES.includes(body.status)) {
      throw ApiError.validation('Invalid status.', { status: 'Invalid.' });
    }
    patch.status = body.status;
  }

  if (Object.keys(patch).length === 0) {
    throw ApiError.validation('Nothing to update.');
  }

  const row = await repo.updateVolunteer(volunteerId, patch);
  return shapeVolunteer(row);
}