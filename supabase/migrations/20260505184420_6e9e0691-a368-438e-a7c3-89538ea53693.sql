ALTER TABLE public.timelines ADD COLUMN IF NOT EXISTS invite_role text NOT NULL DEFAULT 'contributor';

DROP FUNCTION IF EXISTS public.get_invite_info(text);

CREATE FUNCTION public.get_invite_info(_token text)
RETURNS TABLE(
  timeline_id uuid,
  timeline_title text,
  timeline_subtitle text,
  cover_url text,
  owner_id uuid,
  owner_name text,
  invite_role text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT
    t.id,
    t.title,
    t.subtitle,
    t.cover_url,
    t.user_id,
    COALESCE(p.display_name, p.username, 'Alguém') AS owner_name,
    COALESCE(t.invite_role, 'contributor') AS invite_role
  FROM public.timelines t
  LEFT JOIN public.profiles p ON p.id = t.user_id
  WHERE t.invite_token = _token
  LIMIT 1
$$;