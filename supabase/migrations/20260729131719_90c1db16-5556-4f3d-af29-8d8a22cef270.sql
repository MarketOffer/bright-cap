create table if not exists public.access_attempts (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null,
  reason_code text not null,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz not null default now(),
  constraint access_attempts_kind_valid check (kind in ('token_lookup', 'reissue_request'))
);

create index if not exists access_attempts_ip_idx
  on public.access_attempts (ip_address, created_at desc);

grant select, insert on public.access_attempts to service_role;
alter table public.access_attempts enable row level security;