import { supabase } from '@/integrations/supabase/client';
import { normalizeAiPlan } from './aiPlan';
import type { SessionPlan, TeamInput } from './sessionGenerator';

export async function generateAiPlan(t: TeamInput): Promise<{ plan: SessionPlan | null; error?: string; limited?: boolean }> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-session', { body: t });
    if (error) {
      let msg: string | undefined;
      let limited = false;
      const res = (error as any).context as Response | undefined;
      if (res && typeof res.json === 'function') {
        const body = await res.json().catch(() => null);
        msg = body?.error;
        limited = res.status === 429 || res.status === 402;
      }
      return { plan: null, error: msg, limited };
    }
    return { plan: normalizeAiPlan(data?.plan, t) };
  } catch {
    return { plan: null };
  }
}
