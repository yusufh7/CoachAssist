CREATE TABLE public.ai_generation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.ai_generation_log TO service_role;
ALTER TABLE public.ai_generation_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX ai_generation_log_user_idx ON public.ai_generation_log (user_id, created_at);
CREATE INDEX ai_generation_log_ip_idx ON public.ai_generation_log (ip_hash, created_at);