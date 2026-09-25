import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function listFeedback({
  campId,
  rating,
  search,
  limit = 50,
  offset = 0,
}) {
  assertDb();

  let query = supabase
    .from('camp_feedback')
    .select(
      `
      id, camp_id, user_id, rating, comment, created_at, updated_at,
      camps ( id, title, venue, city, start_at ),
      users!camp_feedback_user_id_fkey ( id, name, email, phone )
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false });

  if (campId) query = query.eq('camp_id', campId);
  if (rating && rating !== 'all') query = query.eq('rating', Number(rating));
  if (search) {
    query = query.ilike('comment', `%${search}%`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error('[adminFeedback.list]', error);
    throw ApiError.internal('Failed to fetch feedback.');
  }
  return { rows: data ?? [], total: count ?? 0 };
}

export async function getStats() {
  assertDb();
  const { data, error } = await supabase
    .from('camp_feedback')
    .select('rating');

  if (error) return { total: 0, average: 0, distribution: {} };

  const list = data ?? [];
  const total = list.length;
  const sum = list.reduce((s, r) => s + (r.rating ?? 0), 0);
  const average = total ? Number((sum / total).toFixed(1)) : 0;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of list) {
    if (distribution[row.rating] !== undefined) {
      distribution[row.rating] += 1;
    }
  }

  return { total, average, distribution };
}

export async function listCampOptions() {
  assertDb();
  const { data, error } = await supabase
    .from('camp_feedback')
    .select(`
      camp_id,
      camps ( id, title, city, start_at )
    `);

  if (error) return [];

  const seen = new Map();
  for (const row of data ?? []) {
    const camp = Array.isArray(row.camps) ? row.camps[0] : row.camps;
    if (camp && !seen.has(camp.id)) {
      seen.set(camp.id, camp);
    }
  }
  return [...seen.values()].sort(
    (a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
  );
}