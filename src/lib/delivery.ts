import { type Activity, type SessionPlan, type TeamInput } from './sessionGenerator';

export const ADJUSTMENTS = ['Too easy', 'Too hard', 'Fewer players', 'More players', 'Players losing focus', 'Wet pitch / less space'] as const;
export type Adjustment = typeof ADJUSTMENTS[number];
export function canGenerateAnonymous(hasDraft: boolean) { return !hasDraft; }

export function replaceActivity(plan: SessionPlan, pi: number, ai: number, activity: Activity): SessionPlan {
  const previous = plan.phases[pi]?.activities[ai];
  if (!previous) throw new Error('Practice not found');
  return { ...plan, phases: plan.phases.map((phase, p) => p !== pi ? phase : {
    ...phase, activities: phase.activities.map((a, i) => i !== ai ? a : { ...activity, duration: previous.duration }),
  }) };
}

export function remainingSeconds(endAt: number, now: number): number {
  return Math.max(0, Math.ceil((endAt - now) / 1000));
}

export const BLOCK_STAGES = ['Explore the technique in pairs and small groups', 'Apply the technique in small-sided overloads', 'Make decisions in a conditioned game', 'Apply the theme in a realistic phase of play', 'Transfer the theme into a match with fewer conditions', 'Review and apply the theme independently in a match'];
export function blockInputs(team: TeamInput, theme: string, count: number): TeamInput[] {
  if (![4, 5, 6].includes(count)) throw new Error('Choose 4, 5 or 6 sessions');
  const stages = count === 4 ? [0, 1, 3, 5] : count === 5 ? [0, 1, 2, 3, 5] : [0, 1, 2, 3, 4, 5];
  return stages.map((stage, i) => ({ ...team, sessionGoals: theme,
    currentFocus: `Session ${i + 1} of ${count}: ${BLOCK_STAGES[stage]}. Keep the theme ${theme} throughout; adapt to the age and ability. ${team.currentFocus || ''}`,
  }));
}

export function coachingScript(a: Activity) {
  return { introduce: `${a.name}: ${a.description}`, correct: a.coachingPoints[0] || 'Pause briefly, show the action, then let them try again.',
    praise: `Well done — ${a.coachingPoints[1] || 'you made a good decision and supported your team-mate'}.` };
}