-- shared updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ privacy_notice_versions ============
CREATE TABLE IF NOT EXISTS public.privacy_notice_versions (
  version        text PRIMARY KEY,
  effective_from timestamptz NOT NULL DEFAULT now(),
  body_hash      text NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.privacy_notice_versions TO anon, authenticated;
GRANT ALL ON public.privacy_notice_versions TO service_role;

ALTER TABLE public.privacy_notice_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Privacy notice versions are public" ON public.privacy_notice_versions;
CREATE POLICY "Privacy notice versions are public"
  ON public.privacy_notice_versions
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP TRIGGER IF EXISTS update_privacy_notice_versions_updated_at ON public.privacy_notice_versions;
CREATE TRIGGER update_privacy_notice_versions_updated_at
  BEFORE UPDATE ON public.privacy_notice_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ contacts ============
CREATE TABLE IF NOT EXISTS public.contacts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name             text NOT NULL,
  email                 text NOT NULL,
  phone                 text,
  contact_type          text[] NOT NULL DEFAULT '{}',
  marketing_opt_in      boolean NOT NULL DEFAULT false,
  marketing_opt_in_at   timestamptz,
  privacy_notice_version text REFERENCES public.privacy_notice_versions(version),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts DROP CONSTRAINT IF EXISTS contacts_type_valid;
ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_type_valid CHECK (
    contact_type <@ ARRAY['landlord','investor','vendor','provider','other']::text[]
  );

CREATE INDEX IF NOT EXISTS contacts_type_idx ON public.contacts USING gin (contact_type);
CREATE UNIQUE INDEX IF NOT EXISTS contacts_email_uidx ON public.contacts (lower(email));

-- service_role only: all writes go through edge functions
GRANT ALL ON public.contacts TO service_role;

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
-- deliberately no anon/authenticated policies: table is closed to the Data API

DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();