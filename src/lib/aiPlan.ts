import { splitMinutes, type Activity, type Phase, type SessionPlan, type TeamInput } from './sessionGenerator';

const YOUNG = ['u7', 'u9', 'u11'];
const HEADING = /\bhead(er|ers|ing|ed)?\b/i;

const strs = (v: unknown, max = 6): string[] =>
  Array.isArray(v) ? v.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim()).slice(0, max) : [];
const str = (v: unknown, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim() : fallback);
const pos = (v: unknown) => Math.max(1, Number(v) || 1);

/**
 * Turn raw AI output into a safe SessionPlan: exact timing (phases sum to the
 * session length, activities sum to their phase) and no heading for U11 and below.
 * Returns null if the output is unusable so the caller can fall back to templates.
 */
export function normalizeAiPlan(raw: any, t: TeamInput): SessionPlan | null {
  const total = Number(t.sessionDuration) || 60;
  const young = YOUNG.includes(t.ageGroup || '');
  const rawPhases: any[] = Array.isArray(raw?.phases) ? raw.phases : [];
  const usable = rawPhases
    .map((p) => ({ ...p, activities: (Array.isArray(p?.activities) ? p.activities : []).filter((a: any) => str(a?.name)) }))
    .filter((p) => str(p?.name) && p.activities.length);
  if (usable.length < 3) return null;

  const phaseMins = splitMinutes(total, usable.map((p) => pos(p.duration)));
  const phases: Phase[] = usable.map((p, i) => {
    const mins = splitMinutes(phaseMins[i], p.activities.map((a: any) => pos(a.duration)));
    const activities: Activity[] = p.activities.map((a: any, j: number) => {
      const clean = (list: string[]) => (young ? list.filter((s) => !HEADING.test(s)) : list);
      return {
        name: str(a.name),
        duration: mins[j],
        description: str(a.description),
        setup: str(a.setup),
        equipment: str(a.equipment),
        coachingPoints: clean(strs(a.coachingPoints)),
        progressions: clean(strs(a.progressions)),
        regressions: clean(strs(a.regressions)),
      };
    });
    return { name: str(p.name), duration: phaseMins[i], activities };
  });

  return {
    title: str(raw?.title, `${(t.teamName || 'Team').trim()} Training Session`),
    duration: total,
    objectives: strs(raw?.objectives),
    phases,
    ageGroup: t.ageGroup,
    skillLevel: t.skillLevel,
    playerCount: Number(t.playerCount) || undefined,
    generator: 'ai',
  };
}
