import React, { useState, useEffect } from "react";
import { supabase, SUPABASE_URL } from "../../lib/supabase";
import {
  Database,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Code2,
} from "lucide-react";

export const AdminDatabaseSetup: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({
    doctor_availability: false,
    blocked_dates: false,
    patients: false,
    appointments: false,
    patient_case_history: false,
    patient_documents: false,
  });

  const checkTables = async () => {
    setChecking(true);
    const results: Record<string, boolean> = {};

    const tables = [
      "doctor_availability",
      "blocked_dates",
      "patients",
      "appointments",
      "patient_case_history",
      "patient_documents",
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("*").limit(1);
        results[table] = !error;
      } catch {
        results[table] = false;
      }
    }

    setTableStatus(results);
    setChecking(false);
  };

  useEffect(() => {
    checkTables();
  }, []);

  const fullSqlScript = `-- ====================================================================
-- DR. LOVELY DAS, MDS ENDODONTIST & ROOT CANAL SPECIALIST CLINIC
-- COMPLETE SUPABASE DATABASE SCHEMA, RLS, STORAGE & RPC FUNCTIONS
-- ====================================================================

create extension if not exists "uuid-ossp";

-- PROFILES (ADMIN USERS)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text default 'Dr. Lovely Das Admin',
  role text default 'admin' check (role in ('admin', 'doctor', 'staff')),
  created_at timestamptz default now()
);

-- PATIENTS
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

-- DOCTOR AVAILABILITY (0=Sun ... 6=Sat)
create table if not exists public.doctor_availability (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null unique check (day_of_week between 0 and 6),
  start_time time not null default '10:00:00',
  end_time time not null default '21:00:00',
  max_patients integer not null default 12 check (max_patients > 0),
  is_active boolean not null default true,
  updated_at timestamptz default now()
);

-- BLOCKED DATES (Holidays, Leaves)
create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null unique,
  reason text default 'Doctor unavailable / Holiday',
  created_at timestamptz default now()
);

-- APPOINTMENTS
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique,
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

-- CASE HISTORY
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

-- PATIENT DOCUMENTS
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

-- INDEXES
create index if not exists idx_appointments_date on public.appointments(appointment_date);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_appointments_booking_id on public.appointments(booking_id);
create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create index if not exists idx_patients_phone on public.patients(phone);

-- SEED AVAILABILITY
insert into public.doctor_availability (day_of_week, start_time, end_time, max_patients, is_active)
values
  (1, '10:00:00', '21:00:00', 12, true),
  (2, '10:00:00', '21:00:00', 12, true),
  (3, '10:00:00', '21:00:00', 12, true),
  (4, '10:00:00', '21:00:00', 12, true),
  (5, '10:00:00', '21:00:00', 12, true),
  (6, '10:00:00', '21:00:00', 12, true),
  (0, '10:00:00', '14:00:00', 5, false)
on conflict (day_of_week) do update set
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  max_patients = excluded.max_patients,
  is_active = excluded.is_active;

-- STORAGE BUCKET FOR PRESCRIPTIONS (PRIVATE)
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', false)
on conflict (id) do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.doctor_availability enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.appointments enable row level security;
alter table public.patient_case_history enable row level security;
alter table public.patient_documents enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid()
    and (email = 'admin@dr-lovelydas-clinic.com' or raw_user_meta_data->>'role' = 'admin')
  ) or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Public view availability" on public.doctor_availability for select using (true);
create policy "Admin manage availability" on public.doctor_availability for all using (public.is_admin());
create policy "Public view blocked dates" on public.blocked_dates for select using (true);
create policy "Admin manage blocked dates" on public.blocked_dates for all using (public.is_admin());
create policy "Public read appointments" on public.appointments for select using (true);
create policy "Public insert appointments" on public.appointments for insert with check (true);
create policy "Admin manage appointments" on public.appointments for all using (public.is_admin());
create policy "Public insert patients" on public.patients for insert with check (true);
create policy "Admin manage patients" on public.patients for all using (public.is_admin());
create policy "Admin manage case history" on public.patient_case_history for all using (public.is_admin());
create policy "Public insert documents" on public.patient_documents for insert with check (true);
create policy "Admin manage documents" on public.patient_documents for all using (public.is_admin());

-- STORAGE POLICIES
create policy "Public upload prescriptions" on storage.objects for insert with check (bucket_id = 'prescriptions');
create policy "Admin view prescriptions" on storage.objects for select using (bucket_id = 'prescriptions' and public.is_admin());

-- ATOMIC STORED PROCEDURE: PREVENT OVERBOOKING
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
returns json language plpgsql security definer as $$
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
  v_today_ist := (timezone('Asia/Kolkata', now()))::date;
  if p_appointment_date < v_today_ist then
    raise exception 'Cannot book appointments for past dates.';
  end if;

  if exists (select 1 from public.blocked_dates where blocked_date = p_appointment_date) then
    raise exception 'Doctor is unavailable on this date.';
  end if;

  v_day_of_week := extract(dow from p_appointment_date)::integer;
  select * into v_availability from public.doctor_availability where day_of_week = v_day_of_week for share;
  if not found or v_availability.is_active = false then
    raise exception 'Doctor does not have scheduled hours on this day.';
  end if;

  select count(*) into v_current_count from public.appointments
  where appointment_date = p_appointment_date and status != 'cancelled';

  if v_current_count >= v_availability.max_patients then
    raise exception 'Capacity reached for this date. Maximum capacity is % patients.', v_availability.max_patients;
  end if;

  select id into v_patient_id from public.patients where phone = trim(p_patient_phone) limit 1;
  if v_patient_id is null then
    insert into public.patients (full_name, phone, email, gender, age, city, is_existing_patient)
    values (trim(p_patient_name), trim(p_patient_phone), nullif(trim(p_patient_email), ''), p_gender, p_age, trim(p_city), p_is_existing)
    returning id into v_patient_id;
  else
    update public.patients set full_name = trim(p_patient_name), is_existing_patient = (is_existing_patient or p_is_existing), updated_at = now()
    where id = v_patient_id;
  end if;

  v_date_prefix := to_char(p_appointment_date, 'YYYYMMDD');
  select coalesce(max(
    case when length(booking_id) >= 16 and substring(booking_id from 13 for 4) ~ '^[0-9]+$'
    then substring(booking_id from 13 for 4)::integer else 0 end
  ), 0) + 1 into v_daily_seq from public.appointments where appointment_date = p_appointment_date;

  v_booking_id := 'LD-' || v_date_prefix || '-' || lpad(v_daily_seq::text, 4, '0');

  insert into public.appointments (
    booking_id, patient_id, appointment_date, appointment_time, service_type,
    status, patient_type, symptoms_note, prescription_file_path, created_at, updated_at
  ) values (
    v_booking_id, v_patient_id, p_appointment_date, p_appointment_time, p_service_type,
    'confirmed', case when p_is_existing then 'existing' else 'new' end, p_symptoms_note, p_prescription_path, now(), now()
  ) returning id into v_appointment_id;

  if p_prescription_path is not null and p_prescription_path <> '' then
    insert into public.patient_documents (patient_id, appointment_id, document_name, file_path, file_type, uploaded_at)
    values (v_patient_id, v_appointment_id, 'Prescription - ' || v_booking_id, p_prescription_path, 'prescription', now());
  end if;

  return json_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'appointment_id', v_appointment_id,
    'patient_id', v_patient_id,
    'patient_name', trim(p_patient_name),
    'appointment_date', p_appointment_date,
    'appointment_time', p_appointment_time,
    'remaining_slots', (v_availability.max_patients - v_current_count - 1),
    'max_patients', v_availability.max_patients
  );
end;
$$;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" />
              <h3 className="text-xl font-bold font-serif text-white">
                Supabase Database & Table Health Check
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Project ID: <span className="font-mono text-teal-300">qjwoucimkeizxgogszvv</span> · {SUPABASE_URL}
            </p>
          </div>

          <button
            type="button"
            onClick={checkTables}
            disabled={checking}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {checking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Re-check Tables</span>
          </button>
        </div>

        {/* Live Status of Required Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {Object.entries(tableStatus).map(([table, exists]) => (
            <div
              key={table}
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                exists
                  ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-300"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white">
                  public.{table}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold">
                {exists ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ready</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-400">Needs Setup</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 1-Click Instructions and SQL Script */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-teal-400" />
                <span>Complete SQL Migration & Stored Procedure</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste and execute this in your Supabase SQL Editor to initialize all tables, RLS policies, storage bucket and overbooking prevention function.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied to Clipboard!" : "Copy SQL Script"}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/qjwoucimkeizxgogszvv/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Open SQL Editor</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <pre className="max-h-60 overflow-y-auto p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 select-all">
            {fullSqlScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
