import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

export const reflectionSchema = z.object({
  deliveredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose the date you ran the session.'),
  rating: z.number().int().min(1, 'Pick a rating from 1 to 5.').max(5, 'Pick a rating from 1 to 5.'),
  wentWell: z.string().max(2000, 'Keep each note under 2,000 characters.'),
  toChange: z.string().max(2000, 'Keep each note under 2,000 characters.'),
  playerNotes: z.string().max(2000, 'Keep each note under 2,000 characters.'),
}).refine(r => [r.wentWell, r.toChange, r.playerNotes].some(t => t.trim().length > 0), { message: 'Add at least one note about how it went.', path: ['wentWell'] });

export type ReflectionInput = z.infer<typeof reflectionSchema>;
export interface Reflection extends ReflectionInput { id: string; sessionId: string; sessionTitle?: string }

export const todayIso = () => new Date().toISOString().slice(0, 10);
export const EMPTY_REFLECTION = (): ReflectionInput => ({ deliveredOn: todayIso(), rating: 0, wentWell: '', toChange: '', playerNotes: '' });

/** Count of sessions reflected on in the last 7 days (inclusive of today). */
export function reflectionsThisWeek(dates: string[], today = todayIso()) {
  const end = new Date(today + 'T00:00:00Z').getTime();
  const start = end - 6 * 86400000;
  return dates.filter(d => { const t = new Date(d + 'T00:00:00Z').getTime(); return t >= start && t <= end; }).length;
}

type Row = { id: string; session_id: string; delivered_on: string; rating: number; went_well: string; to_change: string; player_notes: string; training_sessions?: { title: string } | null };
const fromRow = (r: Row): Reflection => ({ id: r.id, sessionId: r.session_id, deliveredOn: r.delivered_on, rating: r.rating, wentWell: r.went_well, toChange: r.to_change, playerNotes: r.player_notes, sessionTitle: r.training_sessions?.title });

export async function loadReflection(sessionId: string) {
  const { data, error } = await supabase.from('session_reflections').select('*').eq('session_id', sessionId).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as Row) : null;
}

export async function saveReflection(userId: string, sessionId: string, input: ReflectionInput) {
  const { data, error } = await supabase.from('session_reflections').upsert({
    user_id: userId, session_id: sessionId, delivered_on: input.deliveredOn, rating: input.rating,
    went_well: input.wentWell, to_change: input.toChange, player_notes: input.playerNotes,
  }, { onConflict: 'session_id,user_id' }).select('*').single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function listReflections(userId: string) {
  const { data, error } = await supabase.from('session_reflections').select('*, training_sessions(title)').eq('user_id', userId).order('delivered_on', { ascending: false });
  if (error) throw error;
  return (data as unknown as Row[]).map(fromRow);
}

export async function deleteReflection(id: string) {
  const { error } = await supabase.from('session_reflections').delete().eq('id', id);
  if (error) throw error;
}
