-- Run this entire script in Supabase Dashboard > SQL Editor > New query.
create table if not exists public.portal_records (
  id text primary key default gen_random_uuid()::text,
  collection text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portal_records_collection_idx on public.portal_records(collection);
alter table public.portal_records enable row level security;

-- Visitors may read tournament information.
drop policy if exists "Public can read tournament records" on public.portal_records;
create policy "Public can read tournament records"
  on public.portal_records for select to anon, authenticated using (true);

-- Visitors may submit team registrations only. All other changes require an authenticated admin.
drop policy if exists "Public can submit registrations" on public.portal_records;
create policy "Public can submit registrations"
  on public.portal_records for insert to anon
  with check (collection = 'registrations');

drop policy if exists "Authenticated admins can insert records" on public.portal_records;
create policy "Authenticated admins can insert records"
  on public.portal_records for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update records" on public.portal_records;
create policy "Authenticated admins can update records"
  on public.portal_records for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete records" on public.portal_records;
create policy "Authenticated admins can delete records"
  on public.portal_records for delete to authenticated using (true);

grant select on public.portal_records to anon, authenticated;
grant insert on public.portal_records to anon, authenticated;
grant update, delete on public.portal_records to authenticated;
