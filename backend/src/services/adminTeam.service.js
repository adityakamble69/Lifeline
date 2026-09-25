import { ApiError } from '../utils/ApiError.js';
import * as repo from '../repositories/adminTeam.repository.js';

const VALID_ROLES = ['owner', 'admin', 'core_team', 'volunteer'];
const VALID_STATUSES = ['active', 'inactive', 'pending'];

const ROLE_LABELS = {
  owner: 'Owner',
  admin: 'Admin',
  core_team: 'Core Team',
  volunteer: 'Volunteer',
};

function shapeMember(row) {
  const user = Array.isArray(row.users) ? row.users[0] : row.users;
  return {
    id: row.id,
    user_id: row.user_id,
    name: user?.name ?? 'Unknown',
    email: user?.email ?? null,
    phone: user?.phone ?? null,
    user_role: user?.role ?? null,
    role: row.role,
    role_label: ROLE_LABELS[row.role] ?? row.role,
    status: row.status,
    joined_at: row.joined_at,
    updated_at: row.updated_at ?? null,
  };
}

export async function listMembers({
  organizationId,
  search,
  role,
  status,
}) {
  const rows = await repo.listMembers({ organizationId, search, role, status });

  const members = rows.map(shapeMember);

  const counts = {
    total: members.length,
    owner: 0,
    admin: 0,
    core_team: 0,
    volunteer: 0,
    active: 0,
  };
  for (const m of members) {
    if (counts[m.role] !== undefined) counts[m.role] += 1;
    if (m.status === 'active') counts.active += 1;
  }

  return { members, counts };
}

export async function addMember({ organizationId, email, role, requesterRole }) {
  // Only owner/admin can add members
  if (!['owner', 'admin'].includes(requesterRole)) {
    throw ApiError.forbidden('Only owners and admins can add members.');
  }

  if (!email || !email.trim()) {
    throw ApiError.validation('Email is required.', { email: 'Required.' });
  }
  if (!VALID_ROLES.includes(role)) {
    throw ApiError.validation('Invalid role.', { role: 'Invalid.' });
  }
  if (role === 'owner' && requesterRole !== 'owner') {
    throw ApiError.forbidden('Only owners can add another owner.');
  }

  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw ApiError.notFound(
      'No user found with this email. Ask them to sign up first.',
    );
  }

  const existing = await repo.findMembership(organizationId, user.id);
  if (existing) {
    throw ApiError.conflict('User is already a member of this organization.');
  }

  const row = await repo.addMember({
    organizationId,
    userId: user.id,
    role,
  });

  return shapeMember({ ...row, users: user });
}

export async function updateMember({
  memberId,
  organizationId,
  patch,
  requesterRole,
}) {
  if (!['owner', 'admin'].includes(requesterRole)) {
    throw ApiError.forbidden('Only owners and admins can update members.');
  }

  const existing = await repo.findMemberById(memberId, organizationId);
  if (!existing) throw ApiError.notFound('Member not found.');

  const update = {};

  if (patch.role !== undefined) {
    if (!VALID_ROLES.includes(patch.role)) {
      throw ApiError.validation('Invalid role.', { role: 'Invalid.' });
    }
    // Only owner can create another owner OR change owner's role
    if (
      (patch.role === 'owner' || existing.role === 'owner') &&
      requesterRole !== 'owner'
    ) {
      throw ApiError.forbidden('Only owners can manage owner roles.');
    }
    update.role = patch.role;
  }

  if (patch.status !== undefined) {
    if (!VALID_STATUSES.includes(patch.status)) {
      throw ApiError.validation('Invalid status.', { status: 'Invalid.' });
    }
    update.status = patch.status;
  }

  if (Object.keys(update).length === 0) {
    throw ApiError.validation('Nothing to update.');
  }

  const row = await repo.updateMember(memberId, update);
  return shapeMember({ ...row, users: existing.users });
}

export async function removeMember({
  memberId,
  organizationId,
  requesterRole,
  requesterUserId,
}) {
  if (!['owner', 'admin'].includes(requesterRole)) {
    throw ApiError.forbidden('Only owners and admins can remove members.');
  }

  const existing = await repo.findMemberById(memberId, organizationId);
  if (!existing) throw ApiError.notFound('Member not found.');

  // Can't remove yourself
  if (existing.user_id === requesterUserId) {
    throw ApiError.forbidden('You cannot remove yourself.');
  }

  // Only owner can remove another owner
  if (existing.role === 'owner' && requesterRole !== 'owner') {
    throw ApiError.forbidden('Only owners can remove other owners.');
  }

  // Ensure at least one owner remains
  if (existing.role === 'owner') {
    const ownerCount = await repo.countOwners(organizationId);
    if (ownerCount <= 1) {
      throw ApiError.conflict(
        'Cannot remove the last owner. Transfer ownership first.',
      );
    }
  }

  await repo.removeMember(memberId);
  return { success: true };
}