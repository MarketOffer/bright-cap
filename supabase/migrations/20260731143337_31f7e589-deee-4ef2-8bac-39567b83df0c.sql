DROP RULE investor_statements_no_delete ON public.investor_statements;

DELETE FROM public.promotion_communications WHERE statement_id IN (SELECT id FROM public.investor_statements WHERE contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor'))) OR contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor'));
DELETE FROM public.access_tokens WHERE statement_id IN (SELECT id FROM public.investor_statements WHERE contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor'))) OR contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor'));
DELETE FROM public.recertification_prompts WHERE statement_id IN (SELECT id FROM public.investor_statements WHERE contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor'))) OR contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor'));
DELETE FROM public.investor_statement_financials WHERE statement_id IN (SELECT id FROM public.investor_statements WHERE contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor')));
DELETE FROM public.investor_statements WHERE contact_id IN (SELECT id FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor'));
DELETE FROM public.contacts WHERE full_name IN ('Gate Three Tester','Test Investor');

CREATE RULE investor_statements_no_delete AS ON DELETE TO public.investor_statements DO INSTEAD NOTHING;