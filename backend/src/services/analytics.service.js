import * as repo from '../repositories/analytics.repository.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function lastNMonths(n) {
  const now = new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: MONTHS[d.getMonth()],
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    });
  }
  return out;
}

function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function computeKpis({ donors, donations, requests, camps, volunteers }) {
  const approvedDonors = donors.filter((d) => d.approval_status === 'approved');
  return {
    total_donors: donors.length,
    approved_donors: approvedDonors.length,
    total_donations: donations.length,
    total_requests: requests.length,
    total_camps: camps.length,
    active_volunteers: volunteers.filter((v) => v.status === 'active').length,
    lives_saved: donations.length * 3,
  };
}

function computeMonthlyTrend(rows, dateField) {
  const months = lastNMonths(9);
  const byKey = {};
  for (const m of months) byKey[m.key] = 0;

  for (const row of rows) {
    const iso = row[dateField];
    if (!iso) continue;
    const key = monthKey(iso);
    if (byKey[key] !== undefined) byKey[key] += 1;
  }

  return months.map((m) => ({ label: m.label, value: byKey[m.key] }));
}

function computeCumulativeDonorGrowth(donors) {
  const months = lastNMonths(9);
  return months.map((m) => {
    const endOfMonth = new Date(m.year, m.month + 1, 0, 23, 59, 59);
    const count = donors.filter(
      (d) => d.created_at && new Date(d.created_at) <= endOfMonth,
    ).length;
    return { label: m.label, value: count };
  });
}

function computeBloodGroupDistribution(donors) {
  const counts = {};
  for (const d of donors) {
    const g = d.blood_group ?? 'Unknown';
    counts[g] = (counts[g] ?? 0) + 1;
  }
  const order = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  return order
    .filter((g) => counts[g] !== undefined)
    .map((g) => ({ label: g, value: counts[g] }));
}

function computeRequestStatusDistribution(requests) {
  const counts = {};
  for (const r of requests) {
    const s = r.status ?? 'unknown';
    counts[s] = (counts[s] ?? 0) + 1;
  }
  const labels = {
    pending: 'Pending',
    verified: 'Verified',
    in_progress: 'In Progress',
    fulfilled: 'Fulfilled',
    rejected: 'Rejected',
    expired: 'Expired',
  };
  return Object.entries(counts).map(([key, value]) => ({
    label: labels[key] ?? key,
    value,
  }));
}

function computeTopCities(donors, donations) {
  const cityMap = {};

  for (const d of donors) {
    const city = d.city ?? 'Unknown';
    if (!cityMap[city]) cityMap[city] = { city, donors: 0, donations: 0 };
    cityMap[city].donors += 1;
  }

  const donorCityById = {};
  for (const d of donors) donorCityById[d.id] = d.city ?? 'Unknown';

  for (const don of donations) {
    const city = donorCityById[don.donor_id] ?? 'Unknown';
    if (!cityMap[city]) cityMap[city] = { city, donors: 0, donations: 0 };
    cityMap[city].donations += 1;
  }

  return Object.values(cityMap)
    .sort((a, b) => b.donors - a.donors || b.donations - a.donations)
    .slice(0, 6);
}

function computeImpact({ donations, requests, camps, volunteers }) {
  const fulfilled = requests.filter((r) => r.status === 'fulfilled').length;
  const fulfillmentRate = requests.length
    ? Math.round((fulfilled / requests.length) * 100)
    : 0;

  return {
    lives_impacted: donations.length * 3,
    camps_organized: camps.length,
    request_fulfillment_rate: fulfillmentRate,
    active_volunteers: volunteers.filter((v) => v.status === 'active').length,
  };
}

export async function getAnalytics(organizationId) {
  const data = await repo.fetchRawData(organizationId);

  return {
    kpis: computeKpis(data),
    donation_trends: computeMonthlyTrend(data.donations, 'donation_date'),
    request_trends: computeMonthlyTrend(data.requests, 'created_at'),
    donor_growth: computeCumulativeDonorGrowth(data.donors),
    blood_group_distribution: computeBloodGroupDistribution(data.donors),
    request_status_distribution: computeRequestStatusDistribution(data.requests),
    camps_overview: computeMonthlyTrend(data.camps, 'start_at'),
    top_cities: computeTopCities(data.donors, data.donations),
    impact: computeImpact(data),
  };
}