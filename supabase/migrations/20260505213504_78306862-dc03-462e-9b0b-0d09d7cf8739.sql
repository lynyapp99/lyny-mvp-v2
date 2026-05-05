
CREATE POLICY "Timeline owner views all memories"
ON public.memories FOR SELECT
USING (public.is_timeline_owner(timeline_id, auth.uid()));

CREATE POLICY "Timeline owner views all media"
ON public.memory_media FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.memories m
  WHERE m.id = memory_media.memory_id
    AND public.is_timeline_owner(m.timeline_id, auth.uid())
));
