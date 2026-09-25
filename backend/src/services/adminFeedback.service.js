import * as repo from '../repositories/adminFeedback.repository.js';

function shapeFeedback(row) {
  const camp = Array.isArray(row.camps) ? row.camps[0] : row.camps;
  const user = Array.isArray(row.users) ? row.users[0] : row.users;

  return {
    id: row.id,
    camp_id: row.camp_id,
    user_id: row.user_id,
    rating: row.rating,
    comment: row.comment,
    created_at: row.created_at,
    updated_at: row.updated_at,
    camp: camp
      ? {
          id: camp.id,
          title: camp.title,
          venue: camp.venue,
          city: camp.city,
          start_at: camp.start_at,
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

export async function listFeedback({
  campId,
  rating,
  search,
  page = 1,
  pageSize = 20,
}) {
  const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * limit;

  const { rows, total } = await repo.listFeedback({
    campId,
    rating,
    search,
    limit,
    offset,
  });

  return {
    feedback: rows.map(shapeFeedback),
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
  const campOptions = await repo.listCampOptions();
  return { ...stats, camp_options: campOptions };
}