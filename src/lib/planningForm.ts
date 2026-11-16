import { z } from 'zod';
import type { TeamInput } from './sessionGenerator';

export const EMPTY_PLANNING_FORM = {
  pitchSize: '', coachCount: '1', units: 'metres', equipment: ['Balls', 'Cones', 'Bibs'],
  teamName: '', ageGroup: '', skillLevel: '', playingStyle: '',
  sessionGoals: '', sessionDuration: '', playerCount: '', currentFocus: '',
};
export type PlanningForm = typeof EMPTY_PLANNING_FORM;
export const planningFormKey = (userId?: string) => `coachassist:planning-form:${userId || 'guest'}`;

const savedForm = z.object({
  form: z.object({
    pitchSize: z.string(), coachCount: z.string(), units: z.string(), equipment: z.array(z.string()),
    teamName: z.string(), ageGroup: z.string(), skillLevel: z.string(), playingStyle: z.string(),
    sessionGoals: z.string(), sessionDuration: z.string(), playerCount: z.string(), currentFocus: z.string(),
  }),
  teamId: z.string(),
  sourceGoal: z.string().optional(),
});

export function restorePlanningForm(raw: string | null, goal = ''): { form: PlanningForm; teamId: string } {
  let saved: z.infer<typeof savedForm> | undefined;
  try { saved = savedForm.parse(JSON.parse(raw || 'null')); } catch { /* Start fresh when storage is invalid. */ }
  return {
    form: { ...EMPTY_PLANNING_FORM, ...saved?.form, ...(goal && saved?.sourceGoal !== goal ? { sessionGoals: goal.slice(0, 500) } : {}) },
    teamId: saved?.teamId || '__new__',
  };
}

export function formFromTeam(team: TeamInput, goal: string): PlanningForm {
  return {
    ...EMPTY_PLANNING_FORM,
    teamName: team.teamName || '', ageGroup: team.ageGroup || '', skillLevel: team.skillLevel || '',
    playingStyle: team.playingStyle || '', sessionGoals: goal,
    sessionDuration: team.sessionDuration ? String(team.sessionDuration) : '',
    playerCount: team.playerCount ? String(team.playerCount) : '', currentFocus: team.currentFocus || '',
  };
}