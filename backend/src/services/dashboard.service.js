import * as dashRepo from '../repositories/dashboard.repository.js';

function computeAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export async function getDashboardStats() {
  const [donors, camps, requests, registrations] = await Promise.all([
    dashRepo.getDonorCounts(),
    dashRepo.getCampCounts(),
    dashRepo.getRequestCounts(),
    dashRepo.getRegistrationCounts(),
  ]);

  return {
    donors,
    camps,
    requests,
    registrations,
  };
}

export async function getDashboardActivity() {
  const [pendingApprovals, upcomingCamps, recentRequests, recentRegs] =
    await Promise.all([
      dashRepo.getPendingApprovals(5),
      dashRepo.getUpcomingCamps(5),
      dashRepo.getRecentRequests(5),
      dashRepo.getRecentRegistrations(5),
    ]);

  return {
    pending_approvals: pendingApprovals.map((row) => {
      const user = Array.isArray(row.users) ? row.users[0] : row.users;
      return {
        id: row.id,
        name: user?.name ?? 'Unknown',
        email: user?.email ?? null,
        blood_group: row.blood_group,
        city: row.city,
        state: row.state,
        created_at: row.created_at,
      };
    }),
    upcoming_camps: upcomingCamps.map((row) => {
      const org = Array.isArray(row.organizations)
        ? row.organizations[0]
        : row.organizations;
      return {
        id: row.id,
        title: row.title,
        venue: row.venue,
        city: row.city,
        start_at: row.start_at,
        end_at: row.end_at,
        capacity: row.capacity,
        status: row.status,
        organizer: org?.name ?? 'Lifeline',
      };
    }),
    recent_requests: recentRequests,
    recent_registrations: recentRegs.map((row) => {
      const user = Array.isArray(row.users) ? row.users[0] : row.users;
      const camp = Array.isArray(row.camps) ? row.camps[0] : row.camps;
      return {
        id: row.id,
        status: row.status,
        registered_at: row.registered_at,
        user_name: user?.name ?? 'Unknown',
        camp_title: camp?.title ?? 'Camp',
        camp_city: camp?.city ?? '',
      };
    }),
  };
}