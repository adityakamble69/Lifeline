import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminRegistrations.repository.js';

const VALID_STATUSES = ['registered', 'confirmed', 'pending', 'cancelled', 'waitlist'];
const VALID_ATTENDANCE = ['pending', 'attended', 'no_show', 'cancelled'];

function shapeRegistration(row) {
  const camp = Array.isArray(row.camps) ? row.camps[0] : row.camps;
  const user = Array.isArray(row.users) ? row.users[0] : row.users;

  return {
    id: row.id,
    camp_id: row.camp_id,
    user_id: row.user_id,
    status: row.status,
    attendance_status: row.attendance_status,
    registered_at: row.registered_at,
    attended_at: row.attended_at,
    updated_at: row.updated_at,
    camp: camp
      ? {
          id: camp.id,
          title: camp.title,
          venue: camp.venue,
          city: camp.city,
          start_at: camp.start_at,
          end_at: camp.end_at,
        }
      : null,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        }
      : null,
  };
}

export async function listRegistrations({
  campId,
  status,
  search,
  page = 1,
  pageSize = 20,
}) {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * limit;

  const { rows, total } = await repo.listRegistrations({
    campId,
    status,
    search,
    limit,
    offset,
  });

  return {
    registrations: rows.map(shapeRegistration),
    pagination: {
      page: safePage,
      page_size: limit,
      total,
      total_pages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function getCounts() {
  return repo.getCounts();
}

export async function listCampOptions() {
  return repo.listCampOptions();
}

export async function changeStatus({
  registrationId,
  status,
  attendanceStatus,
}) {
  if (status && !VALID_STATUSES.includes(status)) {
    throw ApiError.validation('Invalid status.', { status: 'Invalid.' });
  }
  if (attendanceStatus && !VALID_ATTENDANCE.includes(attendanceStatus)) {
    throw ApiError.validation('Invalid attendance.', {
      attendance_status: 'Invalid.',
    });
  }
  if (!status && !attendanceStatus) {
    throw ApiError.validation('Nothing to update.');
  }

  const row = await repo.updateStatus({
    registrationId,
    status,
    attendanceStatus,
  });
  return shapeRegistration(row);
}