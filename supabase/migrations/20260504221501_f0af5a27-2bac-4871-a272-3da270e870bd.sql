
CREATE TYPE public.memory_kind AS ENUM ('note', 'media');

ALTER TABLE public.memories
  ADD COLUMN kind public.memory_kind NOT NULL DEFAULT 'media';

-- Storage policies for 'memories' bucket
CREATE POLICY "Users upload to own timeline folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'memories'
  AND EXISTS (
    SELECT 1 FROM public.timelines t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND t.user_id = auth.uid()
  )
);

CREATE POLICY "Users view own timeline files or public"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'memories'
  AND EXISTS (
    SELECT 1 FROM public.timelines t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND (t.user_id = auth.uid() OR t.privacy = 'public')
  )
);

CREATE POLICY "Public can view files of public timelines"
ON storage.objects FOR SELECT TO anon
USING (
  bucket_id = 'memories'
  AND EXISTS (
    SELECT 1 FROM public.timelines t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND t.privacy = 'public'
  )
);

CREATE POLICY "Users delete own timeline files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'memories'
  AND EXISTS (
    SELECT 1 FROM public.timelines t
    WHERE t.id::text = (storage.foldername(name))[1]
      AND t.user_id = auth.uid()
  )
);
