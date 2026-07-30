ALTER TABLE public.investor_statements DISABLE RULE investor_statements_no_delete;
DELETE FROM public.investor_statements;
DELETE FROM public.contacts;
ALTER TABLE public.investor_statements ENABLE RULE investor_statements_no_delete;