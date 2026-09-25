-- Lifeline Blood Donor Network — initial schema
-- Source of truth: docs/database.md. Keep this file and database.md in sync.
-- Run in the Supabase SQL editor (or via `supabase db push` / a migration tool)
-- against a fresh Supabase Postgres project.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ── users ────────────────────────────────────────────────────────────────
-- Note: authentication itself is handled by Clerk. This table stores
-- application-level profile/role data keyed to the Clerk user, not passwords.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  name text not null,
  email text unique not null,
  phone text,
  role text not null default 'donor',
  status text not null default 'active',
  email_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists donor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users(id) on delete cascade,
  blood_group text not null,
  date_of_birth date,
  gender text,
  city text not null,
  state text not null,
  address text,
  availability_status text not null default 'unavailable',
  last_donation_date date,
  consent_to_contact boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists donor_approvals (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references donor_profiles(id) on delete cascade,
  status text not null default 'pending',
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  description text,
  tagline text,
  website text,
  email text not null,
  phone text,
  city text not null,
  state text not null,
  address text,
  logo_url text,
  banner_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists blood_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references users(id),
  patient_name text not null,
  blood_group text not null,
  units_required integer not null check (units_required > 0),
  hospital_name text not null,
  city text not null,
  state text not null,
  urgency text not null default 'normal',
  required_at timestamptz,
  status text not null default 'pending',
  contact_phone text not null,
  description text,
  verified_by uuid references users(id),
  verified_at timestamptz,
  fulfilled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists camps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  description text,
  venue text not null,
  city text not null,
  state text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  status text not null default 'draft',
  contact_phone text,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists camp_registrations (
  id uuid primary key default gen_random_uuid(),
  camp_id uuid not null references camps(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  status text not null default 'registered',
  attendance_status text not null default 'pending',
  registered_at timestamptz not null default now(),
  attended_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (camp_id, user_id)
);

create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  skills text,
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists camp_volunteers (
  id uuid primary key default gen_random_uuid(),
  camp_id uuid not null references camps(id) on delete cascade,
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  assignment text,
  status text not null default 'assigned',
  unique (camp_id, volunteer_id)
);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references donor_profiles(id),
  camp_id uuid references camps(id),
  donation_date date not null,
  blood_group text not null,
  units integer not null check (units > 0),
  status text not null default 'recorded',
  notes text,
  recorded_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inventory_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  state text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blood_inventory (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references inventory_locations(id) on delete cascade,
  blood_group text not null,
  units_available integer not null default 0 check (units_available >= 0),
  expiry_date date,
  status text not null default 'active',
  updated_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid not null references blood_inventory(id) on delete cascade,
  transaction_type text not null,
  units integer not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  reference_type text,
  reference_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversation_members (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references users(id),
  body text not null,
  sent_at timestamptz not null default now(),
  read_at timestamptz,
  deleted_at timestamptz
);

create table if not exists camp_feedback (
  id uuid primary key default gen_random_uuid(),
  camp_id uuid not null references camps(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists verification_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references users(id),
  request_type text not null,
  status text not null default 'pending',
  document_reference text,
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  rejection_reason text,
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  actor_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ── indexes (docs/database.md §4) ──────────────────────────────────────────
create index if not exists idx_users_email on users(email);
create index if not exists idx_users_phone on users(phone);

create index if not exists idx_donor_profiles_search
  on donor_profiles(blood_group, city, availability_status);
create index if not exists idx_donor_profiles_user on donor_profiles(user_id);

create index if not exists idx_blood_requests_search
  on blood_requests(blood_group, city, status, urgency);
create index if not exists idx_blood_requests_created on blood_requests(created_at);

create index if not exists idx_camps_search on camps(status, start_at, city);
create index if not exists idx_camp_registrations_camp on camp_registrations(camp_id, status);
create index if not exists idx_camp_registrations_user on camp_registrations(user_id);

create index if not exists idx_donations_donor on donations(donor_id, donation_date);
create index if not exists idx_blood_inventory_search
  on blood_inventory(blood_group, location_id, status);
create index if not exists idx_inventory_transactions_inv
  on inventory_transactions(inventory_id, created_at);

create index if not exists idx_notifications_user on notifications(user_id, is_read, created_at);
create index if not exists idx_messages_conversation on messages(conversation_id, sent_at);

create index if not exists idx_audit_logs_entity on audit_logs(organization_id, entity_type, entity_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Enabled here; specific policies are written per-table in later phases
-- (Phase 3+) once roles/auth context are wired up. Enabling RLS with no
-- policies yet means these tables are inaccessible to anon/authenticated
-- roles until explicit policies are added — the backend's service-role key
-- bypasses RLS, which is what the Express API should use for now.
alter table users enable row level security;
alter table donor_profiles enable row level security;
alter table donor_approvals enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table blood_requests enable row level security;
alter table camps enable row level security;
alter table camp_registrations enable row level security;
alter table volunteers enable row level security;
alter table camp_volunteers enable row level security;
alter table donations enable row level security;
alter table inventory_locations enable row level security;
alter table blood_inventory enable row level security;
alter table inventory_transactions enable row level security;
alter table notifications enable row level security;
alter table conversations enable row level security;
alter table conversation_members enable row level security;
alter table messages enable row level security;
alter table camp_feedback enable row level security;
alter table verification_requests enable row level security;
alter table audit_logs enable row level security;
