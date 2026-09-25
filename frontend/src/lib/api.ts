const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });
    return (await res.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Could not reach the server." },
    };
  }
}

// ─── Health ────────────────────────────────────────────────────────────────
export type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
  database: "configured" | "not_configured";
};

export async function getHealth(): Promise<HealthResponse | null> {
  const res = await apiFetch<HealthResponse>("/health");
  return res.success ? res.data : null;
}

// ─── Camps ─────────────────────────────────────────────────────────────────
export interface CampListItem {
  id: string;
  title: string;
  description: string | null;
  venue: string;
  city: string;
  state: string;
  start_at: string;
  end_at: string;
  capacity: number;
  status: string;
  organizer: string;
  registered: number;
}

export interface CampDetailResponse extends CampListItem {
  contact_phone: string | null;
}

export async function getCamps(params?: {
  city?: string;
  status?: string;
}): Promise<ApiResponse<{ camps: CampListItem[] }>> {
  const qs = new URLSearchParams();
  if (params?.city) qs.set("city", params.city);
  if (params?.status) qs.set("status", params.status);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<{ camps: CampListItem[] }>(`/camps${query}`);
}

export async function getCampById(
  id: string,
): Promise<ApiResponse<{ camp: CampDetailResponse }>> {
  return apiFetch<{ camp: CampDetailResponse }>(`/camps/${id}`);
}

// ─── Donors ────────────────────────────────────────────────────────────────
export interface DonorListItem {
  id: string;
  name: string;
  age: number | null;
  blood_group: string;
  city: string;
  state: string;
  availability: "available" | "busy" | "cooldown";
  last_donation: string | null;
  verified: boolean;
  consent_to_contact: boolean;
}

export async function searchDonors(params?: {
  bloodGroup?: string;
  city?: string;
  availability?: string;
}): Promise<ApiResponse<{ donors: DonorListItem[] }>> {
  const qs = new URLSearchParams();
  if (params?.bloodGroup && params.bloodGroup !== "Any")
    qs.set("blood_group", params.bloodGroup);
  if (params?.city) qs.set("city", params.city);
  if (params?.availability) qs.set("availability", params.availability);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<{ donors: DonorListItem[] }>(`/donors${query}`);
}

// ─── Me (donor dashboard) ──────────────────────────────────────────────────
export interface MeProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: string;
    created_at: string;
    last_login_at: string | null;
  };
  donor: {
    id: string;
    blood_group: string;
    age: number | null;
    date_of_birth: string | null;
    gender: string | null;
    city: string;
    state: string;
    address: string | null;
    availability_status: string;
    last_donation_date: string | null;
    next_eligible_date: string | null;
    consent_to_contact: boolean;

    // Approval workflow
    approval_status: "pending" | "approved" | "rejected";
    rejection_reason: string | null;
    reviewed_at: string | null;

    // Health Information
    weight_kg: number | null;
    medical_conditions: string | null;
    on_medication: boolean;
    allergies: string | null;

    // Emergency Contact
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    emergency_contact_relationship: string | null;

    // Preferences
    preferred_language: string;
    default_search_radius_km: number;
    preferred_blood_groups: string[];

    // Documents
    id_document_url: string | null;
    medical_certificate_url: string | null;
    documents_uploaded_at: string | null;
  } | null;
  profile_completion: number;
}

export interface MeNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MeStats {
  blood_group: string | null;
  total_donations: number;
  lives_saved: number;
  upcoming_camps: number;
  next_eligible_date: string | null;
  profile_completion: number;
  approval_status: "pending" | "approved" | "rejected" | null;
  recent_notifications: MeNotification[];
}

export interface MeDonation {
  id: string;
  donation_date: string;
  blood_group: string;
  units: number;
  status: string;
  notes: string | null;
  created_at: string;
  camps: {
    id: string;
    title: string;
    venue: string;
    city: string;
  } | null;
}

export interface MeUpcomingCamp {
  id: string;
  status: string;
  registered_at: string;
  camps: {
    id: string;
    title: string;
    venue: string;
    city: string;
    start_at: string;
    end_at: string;
    status: string;
  } | null;
}

export async function getMyProfile(
  token: string,
): Promise<ApiResponse<MeProfile>> {
  return apiFetch<MeProfile>("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMyStats(
  token: string,
): Promise<ApiResponse<{ stats: MeStats }>> {
  return apiFetch<{ stats: MeStats }>("/me/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMyDonations(
  token: string,
): Promise<ApiResponse<{ donations: MeDonation[] }>> {
  return apiFetch<{ donations: MeDonation[] }>("/me/donations", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMyUpcomingCamps(
  token: string,
): Promise<ApiResponse<{ camps: MeUpcomingCamp[] }>> {
  return apiFetch<{ camps: MeUpcomingCamp[] }>("/me/camps", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateMyUser(
  token: string,
  body: { name?: string; phone?: string | null },
): Promise<ApiResponse<MeProfile>> {
  return apiFetch<MeProfile>("/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

export async function updateMyDonor(
  token: string,
  body: Partial<{
    blood_group: string;
    date_of_birth: string;
    gender: string;
    city: string;
    state: string;
    address: string;
    availability_status: string;
    last_donation_date: string;
    consent_to_contact: boolean;
    weight_kg: number;
    medical_conditions: string;
    on_medication: boolean;
    allergies: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
    preferred_language: string;
    default_search_radius_km: number;
    preferred_blood_groups: string[];
    id_document_url: string;
    medical_certificate_url: string;
  }>,
): Promise<ApiResponse<MeProfile>> {
  return apiFetch<MeProfile>("/me/donor", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

// ─── Notifications ─────────────────────────────────────────────────────────
export interface MeNotificationFull {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
  reference_type: string | null;
  reference_id: string | null;
}

export async function getMyNotifications(
  token: string,
  filter?: "unread" | "all",
): Promise<
  ApiResponse<{
    notifications: MeNotificationFull[];
    unread_count: number;
    total: number;
  }>
> {
  const qs = filter && filter !== "all" ? `?filter=${filter}` : "";
  return apiFetch(`/me/notifications${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function markNotificationRead(
  token: string,
  id: string,
): Promise<ApiResponse<{ notification: MeNotificationFull }>> {
  return apiFetch(`/me/notifications/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function markAllNotificationsRead(
  token: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return apiFetch(`/me/notifications/read-all`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Blood Requests (public) ──────────────────────────────────────────────
export interface BloodRequestListItem {
  id: string;
  patient_name: string;
  blood_group: string;
  units_required: number;
  hospital_name: string;
  city: string;
  state: string;
  urgency: "critical" | "high" | "moderate" | "normal";
  required_at: string | null;
  hours_left: number | null;
  status: string;
  description: string | null;
  created_at: string;
  requester_name: string;
}

export async function getBloodRequests(params?: {
  bloodGroup?: string;
  city?: string;
  urgency?: string;
}): Promise<ApiResponse<{ requests: BloodRequestListItem[] }>> {
  const qs = new URLSearchParams();
  if (params?.bloodGroup && params.bloodGroup !== "Any")
    qs.set("blood_group", params.bloodGroup);
  if (params?.city) qs.set("city", params.city);
  if (params?.urgency && params.urgency !== "all")
    qs.set("urgency", params.urgency);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<{ requests: BloodRequestListItem[] }>(`/requests${query}`);
}

// ─── Admin: Full Donors List ───────────────────────────────────────────────
export interface AdminDonorItem {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  user_status: string;
  registered_at: string;
  blood_group: string | null;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  weight_kg: number | null;
  availability_status: string | null;
  last_donation_date: string | null;
  consent_to_contact: boolean;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface AdminDonorsPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AdminDonorsResponse {
  donors: AdminDonorItem[];
  pagination: AdminDonorsPagination;
}

export async function getAdminDonors(
  token: string,
  params?: {
    search?: string;
    bloodGroup?: string;
    city?: string;
    approvalStatus?: "pending" | "approved" | "rejected" | "all";
    page?: number;
    pageSize?: number;
  },
): Promise<ApiResponse<AdminDonorsResponse>> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.bloodGroup && params.bloodGroup !== "Any")
    qs.set("blood_group", params.bloodGroup);
  if (params?.city) qs.set("city", params.city);
  if (params?.approvalStatus && params.approvalStatus !== "all")
    qs.set("approval_status", params.approvalStatus);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("page_size", String(params.pageSize));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminDonorsResponse>(`/admin/donors${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Admin: Donor Approvals ────────────────────────────────────────────────
export interface DonorApprovalItem {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  registered_at: string;
  blood_group: string | null;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  weight_kg: number | null;
  availability_status: string | null;
  last_donation_date: string | null;
  consent_to_contact: boolean;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface ApprovalCounts {
  pending: number;
  approved: number;
  rejected: number;
}

export async function getDonorApprovals(
  token: string,
  status: "pending" | "approved" | "rejected" = "pending",
): Promise<
  ApiResponse<{
    approvals: DonorApprovalItem[];
    counts: ApprovalCounts;
  }>
> {
  return apiFetch(`/admin/donor-approvals?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function approveDonor(
  token: string,
  donorProfileId: string,
): Promise<ApiResponse<{ success: boolean; status: string }>> {
  return apiFetch(`/admin/donor-approvals/${donorProfileId}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function rejectDonor(
  token: string,
  donorProfileId: string,
  reason: string,
): Promise<ApiResponse<{ success: boolean; status: string }>> {
  return apiFetch(`/admin/donor-approvals/${donorProfileId}/reject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
}

// ─── Admin: Dashboard ──────────────────────────────────────────────────────
export interface DashboardStats {
  donors: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  camps: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  requests: {
    total: number;
    pending: number;
    verified: number;
    fulfilled: number;
    critical: number;
  };
  registrations: { total: number };
}

export interface DashboardPendingApproval {
  id: string;
  name: string;
  email: string | null;
  blood_group: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

export interface DashboardUpcomingCamp {
  id: string;
  title: string;
  venue: string;
  city: string;
  start_at: string;
  end_at: string;
  capacity: number;
  status: string;
  organizer: string;
}

export interface DashboardRecentRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  units_required: number;
  hospital_name: string;
  city: string;
  urgency: string;
  status: string;
  created_at: string;
}

export interface DashboardRecentRegistration {
  id: string;
  status: string;
  registered_at: string;
  user_name: string;
  camp_title: string;
  camp_city: string;
}

export interface DashboardActivity {
  pending_approvals: DashboardPendingApproval[];
  upcoming_camps: DashboardUpcomingCamp[];
  recent_requests: DashboardRecentRequest[];
  recent_registrations: DashboardRecentRegistration[];
}

export async function getDashboardStats(
  token: string,
): Promise<ApiResponse<{ stats: DashboardStats }>> {
  return apiFetch<{ stats: DashboardStats }>("/admin/dashboard/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getDashboardActivity(
  token: string,
): Promise<ApiResponse<DashboardActivity>> {
  return apiFetch<DashboardActivity>("/admin/dashboard/activity", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Admin: Camps Management ──────────────────────────────────────────────
export interface AdminCampItem {
  id: string;
  title: string;
  description: string | null;
  venue: string;
  city: string;
  state: string;
  start_at: string;
  end_at: string;
  capacity: number;
  status: string;
  contact_phone: string | null;
  organization_id: string;
  organization_name: string;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
  registered: number;
  capacity_percent: number;
}

export interface AdminCampsPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AdminCampsResponse {
  camps: AdminCampItem[];
  pagination: AdminCampsPagination;
}

export async function getAdminCamps(
  token: string,
  params?: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<ApiResponse<AdminCampsResponse>> {
  const qs = new URLSearchParams();
  if (params?.status && params.status !== "all") qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("page_size", String(params.pageSize));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminCampsResponse>(`/admin/camps${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export interface CampFormPayload {
  title: string;
  description?: string;
  venue: string;
  city: string;
  state: string;
  start_at: string;
  end_at: string;
  capacity: number;
  status?: string;
  contact_phone?: string;
}

export async function createAdminCamp(
  token: string,
  payload: CampFormPayload,
): Promise<ApiResponse<{ camp: AdminCampItem }>> {
  return apiFetch<{ camp: AdminCampItem }>("/admin/camps", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCamp(
  token: string,
  campId: string,
  payload: Partial<CampFormPayload>,
): Promise<ApiResponse<{ camp: AdminCampItem }>> {
  return apiFetch<{ camp: AdminCampItem }>(`/admin/camps/${campId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function changeCampStatus(
  token: string,
  campId: string,
  status: string,
): Promise<ApiResponse<{ camp: AdminCampItem }>> {
  return apiFetch<{ camp: AdminCampItem }>(`/admin/camps/${campId}/status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}

// ─── Admin: Blood Requests ────────────────────────────────────────────────
export interface AdminRequestItem {
  id: string;
  patient_name: string;
  blood_group: string;
  units_required: number;
  hospital_name: string;
  city: string;
  state: string;
  urgency: "critical" | "high" | "moderate" | "normal";
  required_at: string | null;
  hours_left: number | null;
  status: string;
  contact_phone: string;
  description: string | null;
  verified_by: string | null;
  verified_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
  updated_at: string;
  requester: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface AdminRequestsCounts {
  total: number;
  pending: number;
  verified: number;
  in_progress: number;
  fulfilled: number;
  rejected: number;
  critical: number;
}

export interface AdminRequestsPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AdminRequestsResponse {
  requests: AdminRequestItem[];
  pagination: AdminRequestsPagination;
  counts: AdminRequestsCounts;
}

export async function getAdminRequests(
  token: string,
  params?: {
    status?: string;
    urgency?: string;
    bloodGroup?: string;
    city?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<ApiResponse<AdminRequestsResponse>> {
  const qs = new URLSearchParams();
  if (params?.status && params.status !== "all") qs.set("status", params.status);
  if (params?.urgency && params.urgency !== "all")
    qs.set("urgency", params.urgency);
  if (params?.bloodGroup && params.bloodGroup !== "Any")
    qs.set("blood_group", params.bloodGroup);
  if (params?.city) qs.set("city", params.city);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("page_size", String(params.pageSize));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminRequestsResponse>(`/admin/requests${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function verifyAdminRequest(
  token: string,
  requestId: string,
): Promise<ApiResponse<{ request: AdminRequestItem }>> {
  return apiFetch(`/admin/requests/${requestId}/verify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function rejectAdminRequest(
  token: string,
  requestId: string,
  reason: string,
): Promise<ApiResponse<{ request: AdminRequestItem }>> {
  return apiFetch(`/admin/requests/${requestId}/reject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
}

export async function fulfillAdminRequest(
  token: string,
  requestId: string,
): Promise<ApiResponse<{ request: AdminRequestItem }>> {
  return apiFetch(`/admin/requests/${requestId}/fulfill`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function setRequestInProgress(
  token: string,
  requestId: string,
): Promise<ApiResponse<{ request: AdminRequestItem }>> {
  return apiFetch(`/admin/requests/${requestId}/in-progress`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Utilities ─────────────────────────────────────────────────────────────
export function formatCampDateParts(startAt: string) {
  const d = new Date(startAt);
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return { day, month, year, dateLabel: `${day} ${month} ${year}` };
}

export function formatCampTimeRange(startAt: string, endAt: string) {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };
  return `${fmt(startAt)} – ${fmt(endAt)}`;
}

export function formatDonationDate(dateStr: string | null) {
  if (!dateStr) return "Not yet donated";
  const d = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDonationDate(iso);
}

export function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocal(value: string): string {
  return new Date(value).toISOString();
}

// ─── Admin: Camp Registrations ────────────────────────────────────────────
export interface AdminRegistrationItem {
  id: string;
  camp_id: string;
  user_id: string;
  status: string;
  attendance_status: string;
  registered_at: string;
  attended_at: string | null;
  updated_at: string;
  camp: {
    id: string;
    title: string;
    venue: string;
    city: string;
    start_at: string;
    end_at: string;
  } | null;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface AdminRegistrationsCounts {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  attended: number;
}

export interface AdminRegistrationsPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AdminCampOption {
  id: string;
  title: string;
  city: string;
  start_at: string;
  status: string;
}

export interface AdminRegistrationsResponse {
  registrations: AdminRegistrationItem[];
  pagination: AdminRegistrationsPagination;
  counts: AdminRegistrationsCounts;
  camp_options: AdminCampOption[];
}

export async function getAdminRegistrations(
  token: string,
  params?: {
    campId?: string;
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<ApiResponse<AdminRegistrationsResponse>> {
  const qs = new URLSearchParams();
  if (params?.campId) qs.set("camp_id", params.campId);
  if (params?.status && params.status !== "all") qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("page_size", String(params.pageSize));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminRegistrationsResponse>(
    `/admin/camps/registrations${query}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

export async function changeRegistrationStatus(
  token: string,
  registrationId: string,
  body: { status?: string; attendance_status?: string },
): Promise<ApiResponse<{ registration: AdminRegistrationItem }>> {
  return apiFetch(`/admin/camps/registrations/${registrationId}/status`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// ─── Admin: Volunteers ────────────────────────────────────────────────────
export interface AdminVolunteerItem {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  skills: string | null;
  role: string | null;
  availability: string;
  city: string | null;
  state: string | null;
  status: string;
  joined_at: string;
  updated_at: string;
}

export interface AdminVolunteersStats {
  total: number;
  active: number;
  inactive: number;
  roles: Record<string, number>;
  role_options: string[];
}

export interface AdminVolunteersPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AdminVolunteersResponse {
  volunteers: AdminVolunteerItem[];
  pagination: AdminVolunteersPagination;
  stats: AdminVolunteersStats;
}

export async function getAdminVolunteers(
  token: string,
  params?: {
    search?: string;
    role?: string;
    status?: string;
    city?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<ApiResponse<AdminVolunteersResponse>> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.role && params.role !== "all") qs.set("role", params.role);
  if (params?.status && params.status !== "all")
    qs.set("status", params.status);
  if (params?.city) qs.set("city", params.city);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("page_size", String(params.pageSize));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminVolunteersResponse>(
    `/admin/camps/volunteers${query}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

export async function updateAdminVolunteer(
  token: string,
  volunteerId: string,
  body: Partial<{
    role: string;
    availability: string;
    skills: string;
    city: string;
    state: string;
    status: string;
  }>,
): Promise<ApiResponse<{ volunteer: AdminVolunteerItem }>> {
  return apiFetch(`/admin/camps/volunteers/${volunteerId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// ─── Admin: Camp Feedback ─────────────────────────────────────────────────
export interface AdminFeedbackItem {
  id: string;
  camp_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  camp: {
    id: string;
    title: string;
    venue: string;
    city: string;
    start_at: string;
  } | null;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface AdminFeedbackStats {
  total: number;
  average: number;
  distribution: Record<string, number>;
  camp_options: Array<{
    id: string;
    title: string;
    city: string;
    start_at: string;
  }>;
}

export interface AdminFeedbackPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AdminFeedbackResponse {
  feedback: AdminFeedbackItem[];
  pagination: AdminFeedbackPagination;
  stats: AdminFeedbackStats;
}

export async function getAdminFeedback(
  token: string,
  params?: {
    campId?: string;
    rating?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<ApiResponse<AdminFeedbackResponse>> {
  const qs = new URLSearchParams();
  if (params?.campId) qs.set("camp_id", params.campId);
  if (params?.rating && params.rating !== "all")
    qs.set("rating", params.rating);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("page_size", String(params.pageSize));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminFeedbackResponse>(`/admin/camps/feedback${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Admin: Organization Profile ──────────────────────────────────────────
export interface AdminOrganization {
  id: string;
  name: string;
  type: string;
  description: string | null;
  tagline: string | null;
  website: string | null;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  address: string | null;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrganizationStats {
  total_camps: number;
  total_registrations: number;
  total_members: number;
}

export interface AdminOrganizationResponse {
  organization: AdminOrganization;
  stats: AdminOrganizationStats;
}

export async function getAdminOrganization(
  token: string,
): Promise<ApiResponse<AdminOrganizationResponse>> {
  return apiFetch<AdminOrganizationResponse>("/admin/organization", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateAdminOrganization(
  token: string,
  body: Partial<{
    name: string;
    type: string;
    description: string;
    tagline: string;
    website: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    address: string;
    logo_url: string;
    banner_url: string;
  }>,
): Promise<ApiResponse<AdminOrganizationResponse>> {
  return apiFetch<AdminOrganizationResponse>("/admin/organization", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}


// ─── Admin: Team Members ──────────────────────────────────────────────────
export type TeamRole = "owner" | "admin" | "core_team" | "volunteer";

export interface AdminTeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  user_role: string | null;
  role: TeamRole;
  role_label: string;
  status: "active" | "inactive" | "pending";
  joined_at: string;
  updated_at: string | null;
}

export interface AdminTeamCounts {
  total: number;
  owner: number;
  admin: number;
  core_team: number;
  volunteer: number;
  active: number;
}

export interface AdminTeamResponse {
  members: AdminTeamMember[];
  counts: AdminTeamCounts;
}

export async function getAdminTeam(
  token: string,
  params?: {
    search?: string;
    role?: string;
    status?: string;
  },
): Promise<ApiResponse<AdminTeamResponse>> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.role && params.role !== "all") qs.set("role", params.role);
  if (params?.status && params.status !== "all")
    qs.set("status", params.status);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminTeamResponse>(`/admin/team${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function addAdminTeamMember(
  token: string,
  body: { email: string; role: TeamRole },
): Promise<ApiResponse<{ member: AdminTeamMember }>> {
  return apiFetch("/admin/team", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function updateAdminTeamMember(
  token: string,
  memberId: string,
  body: { role?: TeamRole; status?: string },
): Promise<ApiResponse<{ member: AdminTeamMember }>> {
  return apiFetch(`/admin/team/${memberId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function removeAdminTeamMember(
  token: string,
  memberId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return apiFetch(`/admin/team/${memberId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Admin: Analytics ─────────────────────────────────────────────────────
export interface AnalyticsKpis {
  total_donors: number;
  approved_donors: number;
  total_donations: number;
  total_requests: number;
  total_camps: number;
  active_volunteers: number;
  lives_saved: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface TopCityRow {
  city: string;
  donors: number;
  donations: number;
}

export interface AnalyticsImpact {
  lives_impacted: number;
  camps_organized: number;
  request_fulfillment_rate: number;
  active_volunteers: number;
}

export interface AnalyticsResponse {
  kpis: AnalyticsKpis;
  donation_trends: ChartPoint[];
  request_trends: ChartPoint[];
  donor_growth: ChartPoint[];
  blood_group_distribution: ChartPoint[];
  request_status_distribution: ChartPoint[];
  camps_overview: ChartPoint[];
  top_cities: TopCityRow[];
  impact: AnalyticsImpact;
}

export async function getAdminAnalytics(
  token: string,
): Promise<ApiResponse<AnalyticsResponse>> {
  return apiFetch<AnalyticsResponse>("/admin/analytics", {
    headers: { Authorization: `Bearer ${token}` },
  });
}


// ─── Admin: Export ────────────────────────────────────────────────────────
export type ExportDataType =
  | "donors"
  | "camps"
  | "requests"
  | "registrations"
  | "volunteers"
  | "feedback"
  | "donations";

export type ExportFormat = "csv" | "json";

export interface ExportHistoryItem {
  id: string;
  data_type: string;
  format: string;
  file_name: string;
  row_count: number;
  filters: Record<string, unknown> | null;
  created_at: string;
  exported_by_name: string;
}

export interface ExportRecentResponse {
  exports: ExportHistoryItem[];
}

export interface ExportResult {
  file_name: string;
  content: string;
  row_count: number;
  format: string;
  data_type: string;
}

export async function getRecentExports(
  token: string,
): Promise<ApiResponse<ExportRecentResponse>> {
  return apiFetch<ExportRecentResponse>("/admin/export/recent", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function exportAdminData(
  token: string,
  body: {
    data_type: ExportDataType;
    format: ExportFormat;
    filters?: { fromDate?: string; toDate?: string };
  },
): Promise<ApiResponse<ExportResult>> {
  return apiFetch<ExportResult>("/admin/export", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// ─── Admin: Blood Inventory ───────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  location_id: string;
  location_name: string;
  location_city: string;
  location_state: string;
  blood_group: string;
  units_available: number;
  expiry_date: string | null;
  status: string;
  updated_at: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  status: string;
}

export interface InventoryStats {
  total_units: number;
  total_groups: number;
  low_stock: number;
  expiring_soon: number;
  by_group: Record<string, number>;
}

export interface InventoryOverview {
  items: InventoryItem[];
  locations: InventoryLocation[];
  stats: InventoryStats;
}

export interface InventoryTransaction {
  id: string;
  transaction_type: string;
  units: number;
  blood_group: string | null;
  location_name: string | null;
  notes: string | null;
  reference_type: string | null;
  created_by_name: string | null;
  created_at: string;
}

export async function getAdminInventory(
  token: string,
  params?: {
    locationId?: string;
    bloodGroup?: string;
    search?: string;
  },
): Promise<ApiResponse<InventoryOverview>> {
  const qs = new URLSearchParams();
  if (params?.locationId && params.locationId !== "all")
    qs.set("location_id", params.locationId);
  if (params?.bloodGroup && params.bloodGroup !== "Any")
    qs.set("blood_group", params.bloodGroup);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<InventoryOverview>(`/admin/inventory${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getInventoryTransactions(
  token: string,
  limit = 30,
): Promise<ApiResponse<{ transactions: InventoryTransaction[] }>> {
  return apiFetch<{ transactions: InventoryTransaction[] }>(
    `/admin/inventory/transactions?limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function recordInventoryTransaction(
  token: string,
  inventoryId: string,
  body: {
    type: "add" | "usage" | "transfer" | "adjustment";
    units: number;
    notes?: string;
  },
): Promise<ApiResponse<{ item: InventoryItem }>> {
  return apiFetch(`/admin/inventory/${inventoryId}/transaction`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// ─── Admin: Messages ──────────────────────────────────────────────────────
export interface MessageContact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface ConversationListItem {
  id: string;
  updated_at: string;
  other_user: MessageContact | null;
  last_message: {
    body: string;
    sent_at: string;
    sender_id: string;
    is_mine: boolean;
  } | null;
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  body: string;
  sent_at: string;
  read_at: string | null;
  sender_id: string;
  is_mine: boolean;
}

export interface ConversationDetail {
  conversation_id: string;
  messages: ChatMessage[];
}

export interface ContactDetails extends MessageContact {
  role: string;
  created_at: string;
}

export async function getAdminConversations(
  token: string,
): Promise<ApiResponse<{ conversations: ConversationListItem[] }>> {
  return apiFetch<{ conversations: ConversationListItem[] }>(
    "/admin/messages/conversations",
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function getAdminConversation(
  token: string,
  conversationId: string,
): Promise<ApiResponse<ConversationDetail>> {
  return apiFetch<ConversationDetail>(
    `/admin/messages/conversations/${conversationId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function sendAdminMessage(
  token: string,
  conversationId: string,
  body: string,
): Promise<ApiResponse<{ message: ChatMessage }>> {
  return apiFetch(`/admin/messages/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
}

export async function markConversationRead(
  token: string,
  conversationId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return apiFetch(`/admin/messages/conversations/${conversationId}/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMessageContact(
  token: string,
  contactUserId: string,
): Promise<ApiResponse<{ contact: ContactDetails }>> {
  return apiFetch<{ contact: ContactDetails }>(
    `/admin/messages/contact/${contactUserId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

// ─── Admin: Notifications ─────────────────────────────────────────────────
export interface AdminNotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
  reference_type: string | null;
  reference_id: string | null;
}

export interface AdminNotificationsCounts {
  total: number;
  unread: number;
  by_type: Record<string, number>;
  by_type_labeled: Array<{ type: string; label: string; count: number }>;
}

export interface AdminNotificationsPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AdminNotificationsResponse {
  notifications: AdminNotificationItem[];
  pagination: AdminNotificationsPagination;
  counts: AdminNotificationsCounts;
}

export async function getAdminNotifications(
  token: string,
  params?: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<ApiResponse<AdminNotificationsResponse>> {
  const qs = new URLSearchParams();
  if (params?.type && params.type !== "all") qs.set("type", params.type);
  if (params?.status && params.status !== "all")
    qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("page_size", String(params.pageSize));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<AdminNotificationsResponse>(
    `/admin/notifications${query}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function markAdminNotificationRead(
  token: string,
  id: string,
): Promise<ApiResponse<{ notification: AdminNotificationItem }>> {
  return apiFetch(`/admin/notifications/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function markAllAdminNotificationsRead(
  token: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return apiFetch(`/admin/notifications/read-all`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteAdminNotification(
  token: string,
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return apiFetch(`/admin/notifications/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function clearAllReadNotifications(
  token: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return apiFetch(`/admin/notifications/clear-read`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}