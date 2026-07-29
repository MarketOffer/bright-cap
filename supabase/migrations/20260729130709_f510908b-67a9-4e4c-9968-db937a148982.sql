-- Slice 4: documents, access tokens, feature flag

create table if not exists public.documents (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  title                   text not null,
  version                 text not null,
  storage_path            text not null,
  promoter_entity_name    text not null,
  promoter_company_number text not null,
  warning_block_version   text not null,
  is_active               boolean not null default true,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

grant select, insert, update on public.documents to service_role;
alter table public.documents enable row level security;

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at_column();

create table if not exists public.access_tokens (
  id            uuid primary key default gen_random_uuid(),
  contact_id    uuid not null references public.contacts(id) on delete restrict,
  statement_id  uuid not null references public.investor_statements(id) on delete restrict,
  document_id   uuid not null references public.documents(id) on delete restrict,
  token_hash    text not null unique,
  expires_at    timestamptz not null,
  first_used_at timestamptz,
  last_used_at  timestamptz,
  use_count     integer not null default 0,
  revoked_at    timestamptz,
  revoked_reason text,
  created_at    timestamptz not null default now()
);

create index if not exists access_tokens_contact_idx
  on public.access_tokens (contact_id, created_at desc);
create index if not exists access_tokens_document_idx
  on public.access_tokens (document_id, created_at desc);

grant select, insert, update on public.access_tokens to service_role;
alter table public.access_tokens enable row level security;

create table if not exists public.feature_flags (
  key         text primary key,
  enabled     boolean not null default false,
  description text,
  updated_at  timestamptz not null default now()
);

grant select, update on public.feature_flags to service_role;
alter table public.feature_flags enable row level security;

drop trigger if exists feature_flags_set_updated_at on public.feature_flags;
create trigger feature_flags_set_updated_at
  before update on public.feature_flags
  for each row execute function public.update_updated_at_column();

insert into public.feature_flags (key, enabled, description)
values (
  'gated_summary_delivery',
  false,
  'Slice 4 document delivery. Stays off until written confirmation that the SHA contains no further-funding, capital-call, guarantee or indemnity obligation (brief item 1).'
)
on conflict (key) do nothing;

-- promotion_communications: formalise the document FK, token FK and channel values
alter table public.promotion_communications
  drop constraint if exists promotion_communications_document_id_fkey;
alter table public.promotion_communications
  add constraint promotion_communications_document_id_fkey
  foreign key (document_id) references public.documents(id) on delete restrict;

alter table public.promotion_communications
  drop constraint if exists promotion_communications_token_id_fkey;
alter table public.promotion_communications
  add constraint promotion_communications_token_id_fkey
  foreign key (token_id) references public.access_tokens(id) on delete restrict;

alter table public.promotion_communications
  drop constraint if exists promotion_communications_channel_valid;
alter table public.promotion_communications
  add constraint promotion_communications_channel_valid
  check (channel in ('email', 'page_view', 'download'));