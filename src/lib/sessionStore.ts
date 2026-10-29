import { supabase } from '@/integrations/supabase/client';
import type { SessionPlan, TeamInput } from './sessionGenerator';

export const DRAFT_ID = 'draft';
const DRAFT_KEY = 'coachassist:draft-session';

export interface StoredSession {
  id: string;
  userId?: string;
  teamId?: string | null;
  isPublic: boolean;
  teamData: TeamInput;
  plan: SessionPlan;
}

export function saveDraft(teamData: TeamInput, plan: SessionPlan) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ teamData, plan }));
}

export function loadDraft(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const { teamData, plan } = JSON.parse(raw);
    return { id: DRAFT_ID, isPublic: false, teamData, plan };
  } catch {
    return null;
  }
}

export async function loadSession(id: string): Promise<StoredSession | null> {
  if (id === DRAFT_ID) return loadDraft();
  const { data, error } = await supabase.from('training_sessions').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    teamId: data.team_id,
    isPublic: data.is_public,
    teamData: data.team_data as TeamInput,
    plan: data.plan as unknown as SessionPlan,
  };
}

export async function createSession(userId: string, teamId: string | null, teamData: TeamInput, plan: SessionPlan) {
  const { data, error } = await supabase
    .from('training_sessions')
    .insert({ user_id: userId, team_id: teamId, title: plan.title, team_data: teamData as any, plan: plan as any })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateSessionPlan(id: string, plan: SessionPlan) {
  const { data, error } = await supabase.from('training_sessions').update({ plan: plan as any, title: plan.title }).eq('id', id).select('id').single();
  if (error) throw error;
  if (!data) throw new Error('Session not saved');
}

export async function listSessions(userId: string) {
  const { data, error } = await supabase.from('training_sessions').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteSession(id: string) {
  const { data, error } = await supabase.from('training_sessions').delete().eq('id', id).select('id').single();
  if (error) throw error;
  if (!data) throw new Error('Session not deleted');
}

export async function setSessionPublic(id: string, isPublic: boolean) {
  const { error } = await supabase.from('training_sessions').update({ is_public: isPublic }).eq('id', id);
  if (error) throw error;
}
