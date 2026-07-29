-- 1. Roles. Never stored on a profile row.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'compliance');
  end if;
end $$;

create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- A signed-in user may see which roles they hold, nothing more. Every
-- authorisation decision is still taken server-side via has_role().
create policy "Users can read their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

-- 2. Admin access log. Reads are logged, not just writes.
create table if not exists public.admin_access_log (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  actor_email   text,
  action        text not null,
  subject_type  text,
  subject_id    uuid,
  detail        jsonb not null default '{}'::jsonb,
  ip_address    inet,
  user_agent    text,
  created_at    timestamptz not null default now(),
  constraint admin_access_log_action_valid check (
    action in (
      'list_view',
      'statement_view',
      'financials_reveal',
      'financials_denied',
      'statement_revoke',
      'access_denied'
    )
  )
);

create index if not exists admin_access_log_created_idx
  on public.admin_access_log (created_at desc);
create index if not exists admin_access_log_actor_idx
  on public.admin_access_log (actor_user_id, created_at desc);

grant select, insert on public.admin_access_log to service_role;
alter table public.admin_access_log enable row level security;