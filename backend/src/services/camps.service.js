import { ApiError } from '../utils/ApiError.js';
import * as registrationsRepo from '../repositories/registrations.repository.js';
import * as campsRepo from '../repositories/camps.repository.js';
import supabase from '../config/supabaseClient.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const OPEN_STATUSES = ['published', 'upcoming', 'open', 'registration_open'];

// ─── Public list ────────────────────────────────────────────────────────────
export async function listCamps(filters = {}) {
  const rows = await campsRepo.listPublicCamps({
    city: filters.city,
    status: filters.status,
  });

  const ids = rows.map((r) => r.id);
  const counts = await campsRepo.countByCampIds(ids);

  return rows.map((row) => ({
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
    organizer: row.organizations?.name ?? 'Lifeline',
    registered: counts[row.id] ?? 0,
  }));
}

// ─── Public detail ──────────────────────────────────────────────────────────
export async function getCampDetail(campId) {
  if (!UUID_RE.test(campId)) throw ApiError.notFound('Camp not found.');

  const row = await campsRepo.findPublicCampById(campId);
  if (!row) throw ApiError.notFound('Camp not found.');

  const counts = await campsRepo.countByCampIds([campId]);

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
    organizer: row.organizations?.name ?? 'Lifeline',
    contact_phone: row.contact_phone,
    registered: counts[row.id] ?? 0,
  };
}

// ─── Internal: fetch a camp for the registration flow ──────────────────────
async function getCampForRegistration(campId) {
  if (!supabase) throw ApiError.internal('Database not configured.');
  if (!UUID_RE.test(campId)) throw ApiError.notFound('Camp not found.');

  const { data, error } = await supabase
    .from('camps')
    .select('id, title, venue, capacity, status, start_at, end_at')
    .eq('id', campId)
    .maybeSingle();

  if (error) {
    console.error('[camps.getCampForRegistration]', error);
    throw ApiError.internal('Failed to fetch camp.');
  }
  if (!data) throw ApiError.notFound('Camp not found.');
  return data;
}

// ─── Register for a camp ────────────────────────────────────────────────────
export async function registerForCamp({ campId, userId, body }) {
  const camp = await getCampForRegistration(campId);

  if (!OPEN_STATUSES.includes(camp.status)) {
    throw ApiError.conflict('Registration for this camp is closed.');
  }

  const existing = await registrationsRepo.findExisting(campId, userId);
  if (existing) {
    throw ApiError.conflict('You are already registered for this camp.');
  }

  const registered = await registrationsRepo.countForCamp(campId);
  if (camp.capacity && registered >= camp.capacity) {
    throw ApiError.conflict('This camp is at full capacity.');
  }

  return registrationsRepo.create({
    campId,
    userId,
    notes: body?.notes ?? null,
  });
}