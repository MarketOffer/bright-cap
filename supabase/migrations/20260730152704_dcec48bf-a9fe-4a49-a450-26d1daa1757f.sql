ALTER TABLE public.access_tokens
  ADD COLUMN IF NOT EXISTS claim_hash text,
  ADD COLUMN IF NOT EXISTS claimed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS claimed_ip inet,
  ADD COLUMN IF NOT EXISTS claimed_user_agent text;