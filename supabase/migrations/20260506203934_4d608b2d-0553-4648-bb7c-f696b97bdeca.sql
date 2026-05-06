CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  timeline_id uuid REFERENCES public.timelines(id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_notifications_user_unread
  ON public.notifications (user_id, read, created_at DESC);

CREATE OR REPLACE FUNCTION public.notify_timeline_members()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor text;
  v_title text;
BEGIN
  SELECT COALESCE(display_name, username, 'Alguém') INTO v_actor
    FROM public.profiles WHERE id = NEW.user_id;
  SELECT title INTO v_title FROM public.timelines WHERE id = NEW.timeline_id;

  INSERT INTO public.notifications (user_id, type, message, timeline_id)
  SELECT tm.user_id, 'new_memory',
         v_actor || ' adicionou uma memória em ' || COALESCE(v_title, 'uma timeline'),
         NEW.timeline_id
  FROM public.timeline_members tm
  WHERE tm.timeline_id = NEW.timeline_id
    AND tm.user_id <> NEW.user_id;

  INSERT INTO public.notifications (user_id, type, message, timeline_id)
  SELECT t.user_id, 'new_memory',
         v_actor || ' adicionou uma memória em ' || COALESCE(v_title, 'uma timeline'),
         NEW.timeline_id
  FROM public.timelines t
  WHERE t.id = NEW.timeline_id
    AND t.user_id <> NEW.user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.timeline_members tm
      WHERE tm.timeline_id = t.id AND tm.user_id = t.user_id
    );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_memory_inserted
  AFTER INSERT ON public.memories
  FOR EACH ROW EXECUTE FUNCTION public.notify_timeline_members();

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;