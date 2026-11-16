CREATE TABLE public.session_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid NOT NULL REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  delivered_on date NOT NULL DEFAULT current_date,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  went_well text NOT NULL DEFAULT '',
  to_change text NOT NULL DEFAULT '',
  player_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);
CREATE INDEX session_reflections_user_idx ON public.session_reflections(user_id, delivered_on DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_reflections TO authenticated;
GRANT ALL ON public.session_reflections TO service_role;
ALTER TABLE public.session_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner read" ON public.session_reflections FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owner insert" ON public.session_reflections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.training_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "Owner update" ON public.session_reflections FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner delete" ON public.session_reflections FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER session_reflections_touch BEFORE UPDATE ON public.session_reflections FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();