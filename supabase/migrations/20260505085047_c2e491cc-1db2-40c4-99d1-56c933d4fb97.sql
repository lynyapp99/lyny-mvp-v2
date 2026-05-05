CREATE OR REPLACE FUNCTION public.get_invite_info(_token text)
RETURNS TABLE (
  timeline_id uuid,
  timeline_title text,
  timeline_subtitle text,
  cover_url text,
  owner_id uuid,
  owner_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.title,
    t.subtitle,
    t.cover_url,
    t.user_id,
    COALESCE(p.display_name, p.username, 'Alguém') AS owner_name
  FROM public.timelines t
  LEFT JOIN public.profiles p ON p.id = t.user_id
  WHERE t.invite_token = _token
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_invite_info(text) TO anon, authenticated;