-- Slice 5 hardening: strip the broad default grants that were inherited on the
-- staff tables. RLS already denies these paths, but the grants should not exist
-- at all: the audit log is server-only, and role rows must never be writable
-- from a browser session (privilege escalation).

revoke all on public.admin_access_log from anon, authenticated;
grant all on public.admin_access_log to service_role;

revoke all on public.user_roles from anon, authenticated;
-- authenticated may read only its own rows, enforced by the existing policy.
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;