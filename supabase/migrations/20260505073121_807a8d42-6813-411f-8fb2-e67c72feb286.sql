-- Helper to check if a user is a member of a timeline (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_timeline_member(_timeline_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.timeline_members
    WHERE timeline_id = _timeline_id AND user_id = _user_id
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_timeline_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_timeline_member(uuid, uuid) TO authenticated;

-- Members can view shared timelines
CREATE POLICY "Members view shared timelines"
  ON public.timelines
  FOR SELECT
  USING (public.is_timeline_member(id, auth.uid()));

-- Members can view memories in shared timelines
CREATE POLICY "Members view memories in shared timelines"
  ON public.memories
  FOR SELECT
  USING (public.is_timeline_member(timeline_id, auth.uid()));

-- Members can view media in shared timelines
CREATE POLICY "Members view media in shared timelines"
  ON public.memory_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memories m
      WHERE m.id = memory_media.memory_id
        AND public.is_timeline_member(m.timeline_id, auth.uid())
    )
  );