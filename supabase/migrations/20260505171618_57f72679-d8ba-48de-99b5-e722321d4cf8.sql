CREATE POLICY "members can view timeline"
ON public.timelines FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.timeline_members
    WHERE timeline_members.timeline_id = timelines.id
    AND timeline_members.user_id = auth.uid()
  )
);