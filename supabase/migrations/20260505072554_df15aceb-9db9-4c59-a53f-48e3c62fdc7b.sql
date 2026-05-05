-- 1. Add invite_token to timelines
ALTER TABLE public.timelines
  ADD COLUMN invite_token text UNIQUE;

-- 2. Create timeline_members table
CREATE TABLE public.timeline_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id uuid NOT NULL REFERENCES public.timelines(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'contributor', 'viewer')),
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (timeline_id, user_id)
);

-- 3. Enable RLS
ALTER TABLE public.timeline_members ENABLE ROW LEVEL SECURITY;

-- Helper: security definer function to check timeline ownership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_timeline_owner(_timeline_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.timelines
    WHERE id = _timeline_id AND user_id = _user_id
  )
$$;

-- 4. Policies
CREATE POLICY "Users view own membership rows"
  ON public.timeline_members
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Timeline owner can add members"
  ON public.timeline_members
  FOR INSERT
  WITH CHECK (public.is_timeline_owner(timeline_id, auth.uid()));

CREATE POLICY "Timeline owner can update members"
  ON public.timeline_members
  FOR UPDATE
  USING (public.is_timeline_owner(timeline_id, auth.uid()));

CREATE POLICY "Timeline owner can remove members"
  ON public.timeline_members
  FOR DELETE
  USING (public.is_timeline_owner(timeline_id, auth.uid()));

CREATE INDEX idx_timeline_members_timeline ON public.timeline_members(timeline_id);
CREATE INDEX idx_timeline_members_user ON public.timeline_members(user_id);