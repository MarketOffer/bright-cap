alter table public.investor_statements disable rule investor_statements_no_delete;

delete from public.investor_statement_financials f
  using public.investor_statements s
  join public.contacts c on c.id = s.contact_id
  where f.statement_id = s.id
    and (c.email like 's3-%@example.test' or c.email like 'gate3%@example.com');

delete from public.promotion_communications pc
  using public.contacts c
  where pc.contact_id = c.id
    and (c.email like 's3-%@example.test' or c.email like 'gate3%@example.com');

delete from public.investor_statements
  where contact_id in (
    select id from public.contacts
    where email like 's3-%@example.test' or email like 'gate3%@example.com'
  );

alter table public.investor_statements enable rule investor_statements_no_delete;

delete from public.certification_attempts
  where email like 's3-%@example.test' or email like 'gate3%@example.com';

delete from public.contacts
  where email like 's3-%@example.test' or email like 'gate3%@example.com';