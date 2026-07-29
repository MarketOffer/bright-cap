-- 1. Enum
do $$ begin
  create type public.statement_kind as enum ('hnw','scsi');
exception when duplicate_object then null; end $$;

-- 2. investor_statements
create table if not exists public.investor_statements (
  id                  uuid primary key default gen_random_uuid(),
  contact_id          uuid not null references public.contacts(id) on delete restrict,
  statement_kind      public.statement_kind not null,
  instrument          text not null default 'FPO',
  statement_version   text not null,
  signed_at           timestamptz not null,
  expires_at          timestamptz not null
                        generated always as (
                          ((signed_at at time zone 'UTC') + interval '12 months') at time zone 'UTC'
                        ) stored,
  signature_typed     text not null,
  declared_full_name  text not null,
  answers             jsonb not null,
  qualifying_criteria text[] not null,
  declarations        jsonb not null,
  statement_snapshot  text not null,
  ip_address          inet,
  user_agent          text,
  revoked_at          timestamptz,
  revoked_reason      text,
  created_at          timestamptz not null default now(),
  constraint criteria_not_empty check (cardinality(qualifying_criteria) > 0),
  constraint criteria_valid_for_kind check (
    case statement_kind
      when 'hnw'  then qualifying_criteria <@ array['A','B']::text[]
      when 'scsi' then qualifying_criteria <@ array['A','B','C','D']::text[]
    end
  )
);

create index if not exists investor_statements_contact_idx
  on public.investor_statements (contact_id, signed_at desc);

grant select, insert, update on public.investor_statements to service_role;

alter table public.investor_statements enable row level security;

-- signed_at must not be in the future (trigger, not CHECK: now() is not immutable)
create or replace function public.investor_statements_signed_not_future()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.signed_at > now() then
    raise exception 'signed_at may not be in the future';
  end if;
  return new;
end $$;

drop trigger if exists investor_statements_signed_not_future on public.investor_statements;
create trigger investor_statements_signed_not_future
  before insert or update on public.investor_statements
  for each row execute function public.investor_statements_signed_not_future();

-- immutability except revocation
create or replace function public.investor_statements_immutable()
returns trigger language plpgsql set search_path = public as $$
begin
  if to_jsonb(new) - 'revoked_at' - 'revoked_reason'
     is distinct from to_jsonb(old) - 'revoked_at' - 'revoked_reason' then
    raise exception 'investor_statements rows are immutable except revocation';
  end if;
  return new;
end $$;

drop trigger if exists investor_statements_no_update on public.investor_statements;
create trigger investor_statements_no_update
  before update on public.investor_statements
  for each row execute function public.investor_statements_immutable();

create or replace rule investor_statements_no_delete as
  on delete to public.investor_statements do instead nothing;

-- 3. investor_statement_financials
create table if not exists public.investor_statement_financials (
  statement_id     uuid primary key references public.investor_statements(id) on delete restrict,
  income_band      integer,
  net_assets_band  integer,
  created_at       timestamptz not null default now(),
  constraint income_rounded  check (income_band is null or income_band % 10000 = 0),
  constraint assets_rounded  check (net_assets_band is null or net_assets_band % 100000 = 0),
  constraint at_least_one    check (coalesce(income_band, net_assets_band) is not null)
);

grant select, insert on public.investor_statement_financials to service_role;
alter table public.investor_statement_financials enable row level security;

-- 4. promotion_communications
create table if not exists public.promotion_communications (
  id                   uuid primary key default gen_random_uuid(),
  contact_id           uuid not null references public.contacts(id) on delete restrict,
  statement_id         uuid not null references public.investor_statements(id) on delete restrict,
  document_id          uuid,
  channel              text not null,
  exemption_relied_on  text not null,
  sent_at              timestamptz not null default now(),
  statement_signed_at  timestamptz not null,
  statement_expires_at timestamptz not null,
  token_id             uuid,
  ip_address           inet,
  user_agent           text,
  constraint within_validity_window check (
    sent_at >= statement_signed_at and sent_at < statement_expires_at
  )
);

create index if not exists promotion_communications_contact_idx
  on public.promotion_communications (contact_id, sent_at desc);

grant select, insert on public.promotion_communications to service_role;
alter table public.promotion_communications enable row level security;

-- 5. certification_attempts (rejections)
create table if not exists public.certification_attempts (
  id             uuid primary key default gen_random_uuid(),
  email          text,
  full_name      text,
  outcome        text not null default 'rejected',
  reason_codes   text[] not null default '{}',
  requested_kinds text[] not null default '{}',
  answers        jsonb,
  ip_address     inet,
  user_agent     text,
  created_at     timestamptz not null default now(),
  constraint certification_attempts_outcome_valid check (outcome in ('rejected','accepted'))
);

create index if not exists certification_attempts_created_idx
  on public.certification_attempts (created_at desc);

grant select, insert on public.certification_attempts to service_role;
alter table public.certification_attempts enable row level security;

-- 6. view
create or replace view public.v_contact_certification as
select
  c.id as contact_id,
  s.id as statement_id,
  s.statement_kind,
  s.signed_at,
  s.expires_at,
  (s.id is not null) as is_certified,
  greatest(0, date_part('day', s.expires_at - now())::int) as days_remaining,
  (s.expires_at - interval '1 month') <= now() as due_for_recertification
from public.contacts c
left join lateral (
  select * from public.investor_statements st
  where st.contact_id = c.id
    and st.revoked_at is null
    and now() >= st.signed_at
    and now() <  st.expires_at
  order by st.signed_at desc
  limit 1
) s on true;

revoke all on public.v_contact_certification from anon, authenticated;
grant select on public.v_contact_certification to service_role;

-- 7. gate function
create or replace function public.fn_can_promote(p_contact_id uuid, p_at timestamptz default now())
returns table (allowed boolean, statement_id uuid, reason text)
language sql stable security definer set search_path = public as $$
  select
    st.id is not null,
    st.id,
    case
      when st.id is not null then 'ok'
      when exists (select 1 from public.investor_statements x
                   where x.contact_id = p_contact_id and x.revoked_at is not null)
        then 'statement_revoked'
      when exists (select 1 from public.investor_statements x
                   where x.contact_id = p_contact_id)
        then 'statement_expired'
      else 'no_statement'
    end
  from (select 1) _
  left join public.investor_statements st
    on st.contact_id = p_contact_id
   and st.revoked_at is null
   and p_at >= st.signed_at
   and p_at <  st.expires_at
  order by st.signed_at desc
  limit 1;
$$;

revoke all on function public.fn_can_promote(uuid, timestamptz) from anon, authenticated;
grant execute on function public.fn_can_promote(uuid, timestamptz) to service_role;