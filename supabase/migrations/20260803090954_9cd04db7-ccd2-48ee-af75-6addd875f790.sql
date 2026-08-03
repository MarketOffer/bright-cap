-- Explicit deny-all-but-service-role on the private investor-documents bucket.
-- RLS on storage.objects is already enabled by Supabase. Today there are no
-- policies at all, which is already a deny-all for anon/authenticated; these
-- policies make that intent explicit and durable.
--
-- Investor access is unaffected: the edge functions use the service role
-- (bypasses RLS) and issue time-limited signed URLs (validated by signature,
-- not by RLS).

DROP POLICY IF EXISTS "investor_documents_service_role_all" ON storage.objects;

CREATE POLICY "investor_documents_service_role_all"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'investor-documents')
WITH CHECK (bucket_id = 'investor-documents');

-- Restrictive policy: even if a permissive policy is ever added later, no
-- anon/authenticated request can touch this bucket's objects directly.
DROP POLICY IF EXISTS "investor_documents_no_direct_client_access" ON storage.objects;

CREATE POLICY "investor_documents_no_direct_client_access"
ON storage.objects
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (bucket_id <> 'investor-documents')
WITH CHECK (bucket_id <> 'investor-documents');