import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminOrganization.repository.js';

const URL_REGEX = /^https?:\/\/.+/i;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export async function getOrganization(organizationId) {
  const org = await repo.findById(organizationId);
  if (!org) throw ApiError.notFound('Organization not found.');

  const stats = await repo.getStats(organizationId);

  return { organization: org, stats };
}

export async function updateOrganization({ organizationId, body, role }) {
  // Only owner/admin can update
  if (!['owner', 'admin'].includes(role)) {
    throw ApiError.forbidden(
      'Only organization admins can update the profile.',
    );
  }

  const patch = {};
  const details = {};

  // Simple text fields
  const textFields = [
    'name',
    'type',
    'description',
    'tagline',
    'phone',
    'city',
    'state',
    'address',
  ];
  for (const f of textFields) {
    if (body[f] !== undefined) {
      const v = String(body[f]).trim();
      if (f === 'name' && !v) details.name = 'Required.';
      if (f === 'city' && !v) details.city = 'Required.';
      if (f === 'state' && !v) details.state = 'Required.';
      if (f === 'type' && !v) details.type = 'Required.';
      patch[f] = v || null;
    }
  }

  // Email
  if (body.email !== undefined) {
    const email = String(body.email).trim();
    if (!email) details.email = 'Required.';
    else if (!EMAIL_REGEX.test(email)) details.email = 'Invalid email.';
    patch.email = email;
  }

  // URLs
  const urlFields = ['website', 'logo_url', 'banner_url'];
  for (const f of urlFields) {
    if (body[f] !== undefined) {
      const url = String(body[f]).trim();
      if (url && !URL_REGEX.test(url)) {
        details[f] = 'Must start with http:// or https://';
      }
      patch[f] = url || null;
    }
  }

  if (Object.keys(details).length > 0) {
    throw ApiError.validation('Invalid organization data.', details);
  }

  if (Object.keys(patch).length === 0) {
    throw ApiError.validation('Nothing to update.');
  }

  const updated = await repo.update(organizationId, patch);
  const stats = await repo.getStats(organizationId);
  return { organization: updated, stats };
}