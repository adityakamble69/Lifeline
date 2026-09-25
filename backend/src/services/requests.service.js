import { ApiError } from '../utils/ApiError.js';
import * as requestsRepo from '../repositories/requests.repository.js';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const URGENCIES = ['critical', 'high', 'moderate'];
const URGENCY_RANK = { critical: 1, high: 2, moderate: 3, normal: 4 };

// ─── Validation for creating a request ──────────────────────────────────────
function validate(body) {
  const details = {};

  if (!body.patient_name?.trim()) details.patient_name = 'Required.';
  if (!body.hospital_name?.trim()) details.hospital_name = 'Required.';
  if (!body.city?.trim()) details.city = 'Required.';
  if (!body.state?.trim()) details.state = 'Required.';
  if (!body.contact_phone?.trim()) details.contact_phone = 'Required.';

  if (!BLOOD_GROUPS.includes(body.blood_group))
    details.blood_group = 'Invalid blood group.';

  if (!URGENCIES.includes(body.urgency))
    details.urgency = 'Invalid urgency.';

  const units = Number(body.units_required);
  if (!Number.isInteger(units) || units < 1 || units > 20)
    details.units_required = 'Must be between 1 and 20.';

  if (Object.keys(details).length > 0) {
    throw ApiError.validation('Invalid request data.', details);
  }
}

// ─── Create a blood request ─────────────────────────────────────────────────
export async function createRequest({ requesterId, body }) {
  validate(body);

  const payload = {
    requester_id: requesterId,
    patient_name: body.patient_name.trim(),
    blood_group: body.blood_group,
    units_required: Number(body.units_required),
    hospital_name: body.hospital_name.trim(),
    city: body.city.trim(),
    state: body.state.trim(),
    urgency: body.urgency,
    required_at: body.required_at || null,
    status: 'pending',
    contact_phone: body.contact_phone.trim(),
    description: body.description?.trim() || null,
  };

  return requestsRepo.createBloodRequest(payload);
}

// ─── List public requests (for the donor dashboard) ─────────────────────────
function computeHoursLeft(requiredAt) {
  if (!requiredAt) return null;
  const now = Date.now();
  const target = new Date(requiredAt).getTime();
  const diff = target - now;
  return Math.max(0, Math.round(diff / (1000 * 60 * 60)));
}

export async function listRequests({ bloodGroup, city, urgency } = {}) {
  const rows = await requestsRepo.listPublicRequests({
    bloodGroup,
    city,
    urgency,
  });

  return rows
    .sort((a, b) => {
      const ra = URGENCY_RANK[a.urgency] ?? 99;
      const rb = URGENCY_RANK[b.urgency] ?? 99;
      if (ra !== rb) return ra - rb;
      return (
        new Date(a.required_at ?? a.created_at).getTime() -
        new Date(b.required_at ?? b.created_at).getTime()
      );
    })
    .map((row) => ({
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
      description: row.description,
      created_at: row.created_at,
      requester_name: row.requester?.name ?? 'Anonymous', // ← यह line बदली
    }));
}