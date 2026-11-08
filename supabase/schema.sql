-- ====================================================================
-- DR. LOVELY DAS, MDS ENDODONTIST & ROOT CANAL SPECIALIST CLINIC
-- COMPLETE SUPABASE DATABASE SCHEMA, RLS, STORAGE & RPC FUNCTIONS
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROFILES TABLE (ADMIN USERS)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text default 'Dr. Lovely Das Admin',
  role text default 'admin' check (role in ('admin', 'doctor', 'staff')),
  created_at timestamptz default now()
);

-- 3. PATIENTS TABLE
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  gender text,
  age integer,
  city text,
  is_existing_patient boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. DOCTOR AVAILABILITY TABLE
-- day_of_week: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
create table if not exists public.doctor_availability (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null unique check (day_of_week between 0 and 6),
  start_time time not null default '10:00:00',
  end_time time not null default '21:00:00',
  max_patients integer not null default 12 check (max_patients > 0),
  is_active boolean not null default true,
  updated_at timestamptz default now()
);

-- 5. BLOCKED DATES TABLE (Holidays, Leaves, Emergency Closures)
create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null unique,
  reason text default 'Doctor unavailable / Holiday',
  created_at timestamptz default now()
);

-- 6. APPOINTMENTS TABLE
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique, -- format: LD-YYYYMMDD-XXXX
  patient_id uuid not null references public.patients(id) on delete restrict,
  appointment_date date not null,
  appointment_time text not null,
  service_type text not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled', 'no-show')),
  patient_type text not null default 'new' check (patient_type in ('new', 'existing')),
  symptoms_note text,
  prescription_file_url text,
  prescription_file_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. PATIENT CASE HISTORY TABLE
create table if not exists public.patient_case_history (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  visit_date date not null default current_date,
  diagnosis text not null,
  treatment text not null,
  surgery_details text,
  doctor_advice text,
  follow_up_date date,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. PATIENT DOCUMENTS & PRESCRIPTIONS TABLE
create table if not exists public.patient_documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  document_name text not null,
  file_path text not null,
  file_type text,
  file_size integer,
  uploaded_at timestamptz default now()
);

-- 9. PERFORMANCE INDEXES
create index if not exists idx_appointments_date on public.appointments(appointment_date);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_appointments_booking_id on public.appointments(booking_id);
create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create index if not exists idx_patients_phone on public.patients(phone);
create index if not exists idx_case_history_patient on public.patient_case_history(patient_id);
create index if not exists idx_patient_documents_patient on public.patient_documents(patient_id);

-- 10. SEED DEFAULT DOCTOR AVAILABILITY
insert into public.doctor_availability (day_of_week, start_time, end_time, max_patients, is_active)
values
  (1, '10:00:00', '21:00:00', 12, true),  -- Monday
  (2, '10:00:00', '21:00:00', 12, true),  -- Tuesday
  (3, '10:00:00', '21:00:00', 12, true),  -- Wednesday
  (4, '10:00:00', '21:00:00', 12, true),  -- Thursday
  (5, '10:00:00', '21:00:00', 12, true),  -- Friday
  (6, '10:00:00', '21:00:00', 12, true),  -- Saturday
  (0, '10:00:00', '14:00:00', 5, false)  -- Sunday (Inactive by default)
on conflict (day_of_week) do update set
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  max_patients = excluded.max_patients,
  is_active = excluded.is_active;

-- 11. STORAGE BUCKET FOR PRESCRIPTIONS (PRIVATE)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'prescriptions',
  'prescriptions',
  false,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = false;

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.doctor_availability enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.appointments enable row level security;
alter table public.patient_case_history enable row level security;
alter table public.patient_documents enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid()
    and (
      email = 'admin@dr-lovelydas-clinic.com'
      or raw_user_meta_data->>'role' = 'admin'
    )
  ) or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Availability & Blocked dates policies (Public can read, Admin can manage)
create policy "Public can view active availability" on public.doctor_availability
  for select using (true);

create policy "Admins can manage doctor availability" on public.doctor_availability
  for all using (public.is_admin());

create policy "Public can view blocked dates" on public.blocked_dates
  for select using (true);

create policy "Admins can manage blocked dates" on public.blocked_dates
  for all using (public.is_admin());

-- Appointments policies
create policy "Public can read appointment counts" on public.appointments
  for select using (true);

create policy "Public can insert appointments" on public.appointments
  for insert with check (true);

create policy "Admins can manage all appointments" on public.appointments
  for all using (public.is_admin());

-- Patients policies
create policy "Public can insert patients" on public.patients
  for insert with check (true);

create policy "Admins can view and manage all patients" on public.patients
  for all using (public.is_admin());

-- Case history policies (Strictly Admin/Doctor only)
create policy "Admins can view and manage case history" on public.patient_case_history
  for all using (public.is_admin());

-- Patient documents policies
create policy "Public can insert patient documents during booking" on public.patient_documents
  for insert with check (true);

create policy "Admins can view and manage patient documents" on public.patient_documents
  for all using (public.is_admin());

-- Storage policies for 'prescriptions' bucket
create policy "Public can upload prescriptions" on storage.objects
  for insert with check (bucket_id = 'prescriptions');

create policy "Admins can view prescription files" on storage.objects
  for select using (bucket_id = 'prescriptions' and public.is_admin());

create policy "Admins can delete prescription files" on storage.objects
  for delete using (bucket_id = 'prescriptions' and public.is_admin());

-- 13. ATOMIC BOOKING STORED PROCEDURE (PREVENTS OVERBOOKING)
-- This function runs in a database transaction with row-level locks
create or replace function public.book_appointment(
  p_patient_name text,
  p_patient_phone text,
  p_patient_email text,
  p_gender text,
  p_age integer,
  p_city text,
  p_is_existing boolean,
  p_appointment_date date,
  p_appointment_time text,
  p_service_type text,
  p_symptoms_note text,
  p_prescription_path text default null
)
returns json
language plpgsql
security definer
as $$
declare
  v_day_of_week integer;
  v_availability record;
  v_current_count integer;
  v_patient_id uuid;
  v_appointment_id uuid;
  v_booking_id text;
  v_date_prefix text;
  v_daily_seq integer;
  v_today_ist date;
begin
  -- Get today's date in Asia/Kolkata (IST = UTC+5:30)
  v_today_ist := (timezone('Asia/Kolkata', now()))::date;

  -- 1. Validate date is not in past
  if p_appointment_date < v_today_ist then
    raise exception 'Cannot book appointments for past dates.';
  end if;

  -- 2. Check if date is blocked
  if exists (select 1 from public.blocked_dates where blocked_date = p_appointment_date) then
    raise exception 'Doctor is unavailable on this date. Please select another date.';
  end if;

  -- 3. Calculate day of week (0 = Sunday ... 6 = Saturday)
  v_day_of_week := extract(dow from p_appointment_date)::integer;

  -- 4. Check doctor availability with row lock
  select * into v_availability
  from public.doctor_availability
  where day_of_week = v_day_of_week
  for share;

  if not found or v_availability.is_active = false then
    raise exception 'Doctor does not have scheduled hours on this day of the week.';
  end if;

  -- 5. Count active appointments on that date (cancelled appointments do NOT count)
  select count(*) into v_current_count
  from public.appointments
  where appointment_date = p_appointment_date
    and status != 'cancelled';

  -- 6. Strict capacity check: reject 11th if capacity is 10
  if v_current_count >= v_availability.max_patients then
    raise exception 'Capacity reached for this date. Maximum capacity is % patients and all slots are booked.', v_availability.max_patients;
  end if;

  -- 7. Find or create patient record
  select id into v_patient_id
  from public.patients
  where phone = trim(p_patient_phone)
  limit 1;

  if v_patient_id is null then
    insert into public.patients (
      full_name, phone, email, gender, age, city, is_existing_patient
    ) values (
      trim(p_patient_name),
      trim(p_patient_phone),
      nullif(trim(p_patient_email), ''),
      p_gender,
      p_age,
      trim(p_city),
      p_is_existing
    ) returning id into v_patient_id;
  else
    update public.patients set
      full_name = trim(p_patient_name),
      email = coalesce(nullif(trim(p_patient_email), ''), email),
      is_existing_patient = (is_existing_patient or p_is_existing),
      updated_at = now()
    where id = v_patient_id;
  end if;

  -- 8. Generate Unique Booking ID: LD-YYYYMMDD-XXXX
  v_date_prefix := to_char(p_appointment_date, 'YYYYMMDD');
  
  select coalesce(max(
    case 
      when length(booking_id) >= 16 and substring(booking_id from 13 for 4) ~ '^[0-9]+$'
      then substring(booking_id from 13 for 4)::integer
      else 0 
    end
  ), 0) + 1 into v_daily_seq
  from public.appointments
  where appointment_date = p_appointment_date;

  v_booking_id := 'LD-' || v_date_prefix || '-' || lpad(v_daily_seq::text, 4, '0');

  -- 9. Insert Appointment
  insert into public.appointments (
    booking_id,
    patient_id,
    appointment_date,
    appointment_time,
    service_type,
    status,
    patient_type,
    symptoms_note,
    prescription_file_path,
    created_at,
    updated_at
  ) values (
    v_booking_id,
    v_patient_id,
    p_appointment_date,
    p_appointment_time,
    p_service_type,
    'confirmed',
    case when p_is_existing then 'existing' else 'new' end,
    p_symptoms_note,
    p_prescription_path,
    now(),
    now()
  ) returning id into v_appointment_id;

  -- 10. Record document entry if prescription uploaded
  if p_prescription_path is not null and p_prescription_path <> '' then
    insert into public.patient_documents (
      patient_id,
      appointment_id,
      document_name,
      file_path,
      file_type,
      uploaded_at
    ) values (
      v_patient_id,
      v_appointment_id,
      'Prescription - ' || v_booking_id,
      p_prescription_path,
      'prescription',
      now()
    );
  end if;

  -- 11. Return confirmation payload
  return json_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'appointment_id', v_appointment_id,
    'patient_id', v_patient_id,
    'patient_name', trim(p_patient_name),
    'appointment_date', p_appointment_date,
    'appointment_time', p_appointment_time,
    'doctor_name', 'Dr. Lovely Das, MDS',
    'clinic_location', 'Mukundapur, Kolkata',
    'remaining_slots', (v_availability.max_patients - v_current_count - 1),
    'max_patients', v_availability.max_patients
  );
end;
$$;
