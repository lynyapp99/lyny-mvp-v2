-- Allow anyone (including anon) to view timelines, memories, media, and storage files by link
DROP POLICY IF EXISTS "Users view own or public timelines" ON public.timelines;
CREATE POLICY "Anyone can view timelines" ON public.timelines FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own memories or in public timelines" ON public.memories;
CREATE POLICY "Anyone can view memories" ON public.memories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own media or in public timelines" ON public.memory_media;
CREATE POLICY "Anyone can view memory media" ON public.memory_media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own timeline files or public" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files of public timelines" ON storage.objects;
CREATE POLICY "Anyone can view memory files" ON storage.objects FOR SELECT USING (bucket_id = 'memories');
