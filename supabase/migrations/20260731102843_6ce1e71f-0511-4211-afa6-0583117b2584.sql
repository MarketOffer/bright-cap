DROP RULE investor_statements_no_delete ON public.investor_statements;

DELETE FROM public.investor_statements;
DELETE FROM public.contacts;
DELETE FROM public.certification_attempts;
DELETE FROM public.access_attempts;
DELETE FROM public.admin_access_log;

CREATE RULE investor_statements_no_delete AS
  ON DELETE TO public.investor_statements DO INSTEAD NOTHING;