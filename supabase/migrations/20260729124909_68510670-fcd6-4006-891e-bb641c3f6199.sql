revoke all on function public.fn_can_promote(uuid, timestamptz) from public;
revoke all on function public.fn_can_promote(uuid, timestamptz) from anon, authenticated;
grant execute on function public.fn_can_promote(uuid, timestamptz) to service_role;