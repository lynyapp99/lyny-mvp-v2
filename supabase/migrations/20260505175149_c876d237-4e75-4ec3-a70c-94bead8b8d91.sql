
DROP POLICY IF EXISTS "Users delete own memories" ON public.memories;
CREATE POLICY "Users or timeline owner delete memories"
ON public.memories FOR DELETE
USING (auth.uid() = user_id OR public.is_timeline_owner(timeline_id, auth.uid()));

DROP POLICY IF EXISTS "Users delete own media" ON public.memory_media;
CREATE POLICY "Users or timeline owner delete media"
ON public.memory_media FOR DELETE
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.memories m
    WHERE m.id = memory_media.memory_id
      AND public.is_timeline_owner(m.timeline_id, auth.uid())
  )
);
