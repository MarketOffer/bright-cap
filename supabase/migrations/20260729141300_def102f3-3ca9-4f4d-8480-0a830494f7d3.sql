revoke all on function public.fn_recertification_due(integer, timestamptz) from public, anon, authenticated;
revoke all on function public.fn_promotion_orphans(integer, timestamptz) from public, anon, authenticated;
revoke all on function public.fn_retention_candidates(timestamptz, integer) from public, anon, authenticated;
grant execute on function public.fn_recertification_due(integer, timestamptz) to service_role;
grant execute on function public.fn_promotion_orphans(integer, timestamptz) to service_role;
grant execute on function public.fn_retention_candidates(timestamptz, integer) to service_role;