UPDATE public.access_tokens
SET claim_hash = NULL, claimed_at = NULL, claimed_ip = NULL, claimed_user_agent = NULL
WHERE claim_hash IS NOT NULL;