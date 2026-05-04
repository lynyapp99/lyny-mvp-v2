-- Allow anonymous (logged out) visitors to read public timelines
DROP POLICY IF EXISTS "Public can view public timelines" ON public.timelines;
CREATE POLICY "Public can view public timelines"
ON public.timelines FOR SELECT
TO anon
USING (privacy = 'public');

DROP POLICY IF EXISTS "Public can view memories in public timelines" ON public.memories;
CREATE POLICY "Public can view memories in public timelines"
ON public.memories FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.timelines t
  WHERE t.id = memories.timeline_id AND t.privacy = 'public'
));

DROP POLICY IF EXISTS "Public can view media in public timelines" ON public.memory_media;
CREATE POLICY "Public can view media in public timelines"
ON public.memory_media FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.memories m
  JOIN public.timelines t ON t.id = m.timeline_id
  WHERE m.id = memory_media.memory_id AND t.privacy = 'public'
));

-- Profiles already viewable by everyone (no change needed)

-- Storage: memories bucket is already public, but ensure read policy exists
DROP POLICY IF EXISTS "Public read access to memories bucket" ON storage.objects;
CREATE POLICY "Public read access to memories bucket"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'memories');