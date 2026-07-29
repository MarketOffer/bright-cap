delete from public.certification_attempts
where reason_codes && array['token_invalid', 'reissue_request'];