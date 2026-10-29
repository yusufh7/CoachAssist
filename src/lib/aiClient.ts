import { supabase } from '@/integrations/supabase/client';
import { normalizeAiPlan } from './aiPlan';
import type { SessionPlan, TeamInput } from './sessionGenerator';
import type { Activity } from './sessionGenerator';
import type { Adjustment } from './delivery';
import { z } from 'zod';

const adjustedActivity = z.object({ name: z.string().min(1), duration: z.number(), description: z.string().min(1), setup: z.string().min(1), equipment: z.string(), coachingPoints: z.array(z.string()), progressions: z.array(z.string()), regressions: z.array(z.string()) });
export async function adjustAiActivity(team: TeamInput, activity: Activity, adjustment: Adjustment, players: number): Promise<Activity> {
  const { data, error } = await supabase.functions.invoke('generate-session', { body: { ...team, action: 'adjust', activity, adjustment, playerCount: players } });
  if (error) {
    const response = (error as { context?: Response }).context;
    const detail = response ? await response.json().catch(() => null) : null;
    throw new Error(detail?.error || 'Could not adjust this practice. Your original is unchanged.');
  }
  const parsed = adjustedActivity.safeParse(data?.activity);
  if (!parsed.success) throw new Error('The adjusted practice was incomplete. Your original is unchanged.');
  return { ...parsed.data, duration: activity.duration };
}

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
