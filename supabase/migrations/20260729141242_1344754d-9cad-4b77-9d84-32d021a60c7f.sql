-- Slice 6: recertification, send-path integrity, retention reporting.

-- 1. Prompt register --------------------------------------------------------
create table if not exists public.recertification_prompts (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  statement_id uuid not null references public.investor_statements(id) on delete cascade,
  prompt_kind text not null check (prompt_kind in ('due','expired')),
  channel text not null default 'email',
  sent_at timestamptz not null default now(),
  delivered boolean not null default false,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists recertification_prompts_once_uidx
  on public.recertification_prompts (statement_id, prompt_kind);

grant all on public.recertification_prompts to service_role;
alter table public.recertification_prompts enable row level security;
-- No anon/authenticated policies: server-side access only.

-- 2. Dispatch tracking on the promotion log ---------------------------------
alter table public.promotion_communications
  add column if not exists dispatched_at timestamptz,
  add column if not exists dispatch_ref text;

-- 3. Who is due for recertification ----------------------------------------
create or replace function public.fn_recertification_due(
  p_window_days integer default 30,
  p_at timestamptz default now()
)
returns table(
  contact_id uuid,
  statement_id uuid,
  email text,
  full_name text,
  expires_at timestamptz,
  days_remaining integer
)
language sql
stable
security definer
set search_path = public
as $$
  select c.id, s.id, c.email, c.full_name, s.expires_at,
         greatest(0, floor(extract(epoch from (s.expires_at - p_at)) / 86400)::int)
  from public.investor_statements s
  join public.contacts c on c.id = s.contact_id
  where s.revoked_at is null
    and s.expires_at > p_at
    and s.expires_at <= p_at + make_interval(days => p_window_days)
    -- not already prompted for this statement
    and not exists (
      select 1 from public.recertification_prompts p
      where p.statement_id = s.id and p.prompt_kind = 'due'
    )
    -- and no newer, still-valid statement already replaces it
    and not exists (
      select 1 from public.investor_statements n
      where n.contact_id = s.contact_id
        and n.revoked_at is null
        and n.signed_at > s.signed_at
        and n.expires_at > p_at + make_interval(days => p_window_days)
    );
$$;

-- 4. Send-path integrity: promotions logged but never dispatched ------------
create or replace function public.fn_promotion_orphans(
  p_grace_minutes integer default 5,
  p_at timestamptz default now()
)
returns table(
  communication_id uuid,
  contact_id uuid,
  statement_id uuid,
  channel text,
  sent_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select pc.id, pc.contact_id, pc.statement_id, pc.channel, pc.sent_at
  from public.promotion_communications pc
  where pc.dispatched_at is null
    and pc.sent_at < p_at - make_interval(mins => p_grace_minutes);
$$;

-- 5. Retention reporting: 6 years after the last promotion -------------------
create or replace function public.fn_retention_candidates(
  p_at timestamptz default now(),
  p_years integer default 6
)
returns table(
  statement_id uuid,
  contact_id uuid,
  last_promotion_at timestamptz,
  cutoff_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select s.id,
         s.contact_id,
         max(pc.sent_at),
         coalesce(max(pc.sent_at), s.expires_at) + make_interval(years => p_years)
  from public.investor_statements s
  left join public.promotion_communications pc on pc.statement_id = s.id
  group by s.id, s.contact_id, s.expires_at
  having coalesce(max(pc.sent_at), s.expires_at) + make_interval(years => p_years) <= p_at;
$$;

-- 6. Switches, both off ------------------------------------------------------
insert into public.feature_flags (key, enabled, description)
values
  ('recertification_prompts', false,
   'Sends the neutral recertification prompt as a statement nears its 12-month expiry.'),
  ('retention_purge', false,
   'Allows the retention sweep to delete. Off = dry-run report only.')
on conflict (key) do nothing;