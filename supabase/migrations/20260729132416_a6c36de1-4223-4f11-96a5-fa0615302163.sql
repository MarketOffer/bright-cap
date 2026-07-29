-- Postgres grants EXECUTE to PUBLIC by default. These are server-side
-- authorisation primitives; nothing in a browser may call them.
revoke all on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

revoke all on function public.fn_can_promote(uuid, timestamptz) from public, anon, authenticated;
grant execute on function public.fn_can_promote(uuid, timestamptz) to service_role;