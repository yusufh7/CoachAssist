CREATE OR REPLACE FUNCTION public.reserve_ai_usage(p_user_id uuid, p_ip_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE used integer; allowed integer;
BEGIN
  IF p_ip_hash IS NULL OR length(p_ip_hash) <> 64 THEN RAISE EXCEPTION 'Invalid usage identity'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(coalesce(p_user_id::text, p_ip_hash), 0));
  allowed := CASE WHEN p_user_id IS NULL THEN 1 ELSE 20 END;
  SELECT count(*) INTO used FROM public.ai_generation_log WHERE created_at >= now() - interval '24 hours' AND ((p_user_id IS NOT NULL AND user_id = p_user_id) OR (p_user_id IS NULL AND user_id IS NULL AND ip_hash = p_ip_hash));
  IF used >= allowed THEN RETURN false; END IF;
  INSERT INTO public.ai_generation_log(user_id, ip_hash) VALUES(p_user_id, p_ip_hash);
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_ai_usage(uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_usage(uuid,text) TO service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
CREATE INDEX IF NOT EXISTS ai_generation_log_user_created_idx ON public.ai_generation_log(user_id, created_at);
CREATE INDEX IF NOT EXISTS ai_generation_log_ip_created_idx ON public.ai_generation_log(ip_hash, created_at);
COMMENT ON FUNCTION public.reserve_ai_usage(uuid,text) IS 'Service-only atomic rolling-day reservation: one anonymous generation, twenty signed-in AI attempts, including adjustments. Failed upstream attempts consume a reservation.';