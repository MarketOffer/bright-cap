-- Patch v2.1: single-statement route selection with a recorded decline trail.

alter table public.certification_attempts
  add column if not exists attempt_group_id uuid,
  add column if not exists declined_kind public.statement_kind;

alter table public.certification_attempts
  drop constraint if exists certification_attempts_outcome_valid;

alter table public.certification_attempts
  add constraint certification_attempts_outcome_valid
  check (outcome in ('rejected', 'accepted', 'route_declined'));

create index if not exists certification_attempts_group_idx
  on public.certification_attempts (attempt_group_id);

alter table public.investor_statements
  add column if not exists attempt_group_id uuid;

create index if not exists investor_statements_attempt_group_idx
  on public.investor_statements (attempt_group_id);
