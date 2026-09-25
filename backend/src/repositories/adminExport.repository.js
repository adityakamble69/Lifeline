import supabase from '../config/supabaseClient.js';
import { ApiError } from '../utils/ApiError.js';

function assertDb() {
  if (!supabase) throw ApiError.internal('Database not configured.');
}

export async function fetchExportData({ dataType, organizationId, filters = {} }) {
  assertDb();

  const { fromDate, toDate } = filters;

  if (dataType === 'donors') {
    let q = supabase
      .from('donor_profiles')
      .select(`
        id, blood_group, date_of_birth, gender, city, state, address,
        availability_status, last_donation_date, approval_status,
        weight_kg, created_at,
        users!donor_profiles_user_id_fkey ( name, email, phone )
      `)
      .order('created_at', { ascending: false });
    if (fromDate) q = q.gte('created_at', fromDate);
    if (toDate) q = q.lte('created_at', toDate);
    const { data, error } = await q;
    if (error) throw ApiError.internal('Failed to fetch donors.');
    return (data ?? []).map((row) => {
      const u = Array.isArray(row.users) ? row.users[0] : row.users;
      return {
        name: u?.name ?? '',
        email: u?.email ?? '',
        phone: u?.phone ?? '',
        blood_group: row.blood_group ?? '',
        date_of_birth: row.date_of_birth ?? '',
        gender: row.gender ?? '',
        city: row.city ?? '',
        state: row.state ?? '',
        address: row.address ?? '',
        availability: row.availability_status ?? '',
        last_donation_date: row.last_donation_date ?? '',
        approval_status: row.approval_status ?? '',
        weight_kg: row.weight_kg ?? '',
        joined_at: row.created_at ?? '',
      };
    });
  }

  if (dataType === 'camps') {
    let q = supabase
      .from('camps')
      .select('id, title, venue, city, state, start_at, end_at, capacity, status, contact_phone, created_at')
      .eq('organization_id', organizationId)
      .order('start_at', { ascending: false });
    if (fromDate) q = q.gte('start_at', fromDate);
    if (toDate) q = q.lte('start_at', toDate);
    const { data, error } = await q;
    if (error) throw ApiError.internal('Failed to fetch camps.');
    return (data ?? []).map((r) => ({
      title: r.title ?? '',
      venue: r.venue ?? '',
      city: r.city ?? '',
      state: r.state ?? '',
      start_at: r.start_at ?? '',
      end_at: r.end_at ?? '',
      capacity: r.capacity ?? '',
      status: r.status ?? '',
      contact_phone: r.contact_phone ?? '',
      created_at: r.created_at ?? '',
    }));
  }

  if (dataType === 'requests') {
    let q = supabase
      .from('blood_requests')
      .select('patient_name, blood_group, units_required, hospital_name, city, state, urgency, status, contact_phone, required_at, created_at')
      .order('created_at', { ascending: false });
    if (fromDate) q = q.gte('created_at', fromDate);
    if (toDate) q = q.lte('created_at', toDate);
    const { data, error } = await q;
    if (error) throw ApiError.internal('Failed to fetch requests.');
    return data ?? [];
  }

  if (dataType === 'registrations') {
    let q = supabase
      .from('camp_registrations')
      .select(`
        status, attendance_status, registered_at, attended_at,
        users ( name, email, phone ),
        camps!inner ( title, city, organization_id )
      `)
      .eq('camps.organization_id', organizationId)
      .order('registered_at', { ascending: false });
    if (fromDate) q = q.gte('registered_at', fromDate);
    if (toDate) q = q.lte('registered_at', toDate);
    const { data, error } = await q;
    if (error) throw ApiError.internal('Failed to fetch registrations.');
    return (data ?? []).map((row) => {
      const u = Array.isArray(row.users) ? row.users[0] : row.users;
      const c = Array.isArray(row.camps) ? row.camps[0] : row.camps;
      return {
        donor_name: u?.name ?? '',
        donor_email: u?.email ?? '',
        donor_phone: u?.phone ?? '',
        camp_title: c?.title ?? '',
        camp_city: c?.city ?? '',
        status: row.status ?? '',
        attendance: row.attendance_status ?? '',
        registered_at: row.registered_at ?? '',
        attended_at: row.attended_at ?? '',
      };
    });
  }

  if (dataType === 'volunteers') {
    let q = supabase
      .from('volunteers')
      .select(`
        role, availability, skills, city, state, status, joined_at,
        users!volunteers_user_id_fkey ( name, email, phone )
      `)
      .order('joined_at', { ascending: false });
    if (fromDate) q = q.gte('joined_at', fromDate);
    if (toDate) q = q.lte('joined_at', toDate);
    const { data, error } = await q;
    if (error) throw ApiError.internal('Failed to fetch volunteers.');
    return (data ?? []).map((row) => {
      const u = Array.isArray(row.users) ? row.users[0] : row.users;
      return {
        name: u?.name ?? '',
        email: u?.email ?? '',
        phone: u?.phone ?? '',
        role: row.role ?? '',
        availability: row.availability ?? '',
        skills: row.skills ?? '',
        city: row.city ?? '',
        state: row.state ?? '',
        status: row.status ?? '',
        joined_at: row.joined_at ?? '',
      };
    });
  }

  if (dataType === 'feedback') {
    let q = supabase
      .from('camp_feedback')
      .select(`
        rating, comment, created_at,
        users ( name, email ),
        camps!inner ( title, city, organization_id )
      `)
      .eq('camps.organization_id', organizationId)
      .order('created_at', { ascending: false });
    if (fromDate) q = q.gte('created_at', fromDate);
    if (toDate) q = q.lte('created_at', toDate);
    const { data, error } = await q;
    if (error) throw ApiError.internal('Failed to fetch feedback.');
    return (data ?? []).map((row) => {
      const u = Array.isArray(row.users) ? row.users[0] : row.users;
      const c = Array.isArray(row.camps) ? row.camps[0] : row.camps;
      return {
        donor_name: u?.name ?? '',
        donor_email: u?.email ?? '',
        camp_title: c?.title ?? '',
        camp_city: c?.city ?? '',
        rating: row.rating ?? '',
        comment: row.comment ?? '',
        created_at: row.created_at ?? '',
      };
    });
  }

  if (dataType === 'donations') {
    let q = supabase
      .from('donations')
      .select('donation_date, blood_group, units, status, notes, created_at')
      .order('donation_date', { ascending: false });
    if (fromDate) q = q.gte('donation_date', fromDate);
    if (toDate) q = q.lte('donation_date', toDate);
    const { data, error } = await q;
    if (error) throw ApiError.internal('Failed to fetch donations.');
    return data ?? [];
  }

  throw ApiError.validation('Invalid data type.', { data_type: 'Unknown.' });
}

export async function createExportLog({
  organizationId,
  userId,
  dataType,
  format,
  fileName,
  rowCount,
  filters,
}) {
  assertDb();
  const { data, error } = await supabase
    .from('export_history')
    .insert({
      organization_id: organizationId,
      exported_by: userId,
      data_type: dataType,
      format,
      file_name: fileName,
      row_count: rowCount,
      filters,
    })
    .select()
    .single();

  if (error) {
    console.error('[adminExport.createLog]', error);
    return null;
  }
  return data;
}

export async function listExports({ organizationId, limit = 20 }) {
  assertDb();
  const { data, error } = await supabase
    .from('export_history')
    .select(`
      id, data_type, format, file_name, row_count, filters, created_at,
      users ( name )
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[adminExport.list]', error);
    return [];
  }
  return (data ?? []).map((row) => {
    const u = Array.isArray(row.users) ? row.users[0] : row.users;
    return {
      id: row.id,
      data_type: row.data_type,
      format: row.format,
      file_name: row.file_name,
      row_count: row.row_count,
      filters: row.filters,
      created_at: row.created_at,
      exported_by_name: u?.name ?? 'Unknown',
    };
  });
}