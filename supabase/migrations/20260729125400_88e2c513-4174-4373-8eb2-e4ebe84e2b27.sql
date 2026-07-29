create or replace function public.investor_statements_immutable()
returns trigger language plpgsql set search_path = public as $$
begin
  -- expires_at is a STORED generated column: NEW.expires_at is null inside a BEFORE
  -- trigger, so it must be excluded from the comparison.
  if to_jsonb(new) - 'revoked_at' - 'revoked_reason' - 'expires_at'
     is distinct from to_jsonb(old) - 'revoked_at' - 'revoked_reason' - 'expires_at' then
    raise exception 'investor_statements rows are immutable except revocation';
  end if;
  return new;
end $$;