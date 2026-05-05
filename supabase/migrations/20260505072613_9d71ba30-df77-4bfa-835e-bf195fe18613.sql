REVOKE EXECUTE ON FUNCTION public.is_timeline_owner(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_timeline_owner(uuid, uuid) TO authenticated;