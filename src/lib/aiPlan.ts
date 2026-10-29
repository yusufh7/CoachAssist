import { splitMinutes, type Activity, type Phase, type SessionPlan, type TeamInput } from './sessionGenerator';
import { hasDeliberateHeading } from './safety';
const object = (v: unknown): Record<string, unknown> => v && typeof v === 'object' ? v as Record<string, unknown> : {};
const list = (v: unknown): unknown[] => Array.isArray(v) ? v : [];
const strings = (v: unknown): string[] => list(v).filter((s): s is string => typeof s === 'string' && Boolean(s.trim())).slice(0, 8);
const string = (v: unknown, fallback = '') => typeof v === 'string' && v.trim() ? v.trim() : fallback;
const positive = (v: unknown) => Math.max(1, Number(v) || 1);

export function normalizeAiPlan(raw: unknown, t: TeamInput): SessionPlan | null {
  const data = object(raw);
  if (['u7', 'u9', 'u11'].includes(t.ageGroup || '') && hasDeliberateHeading(data)) return null;
  const total = Number(t.sessionDuration) || 60;
  const usable = list(data.phases).map(object).map(p => ({ ...p, activities: list(p.activities).map(object).filter(a => string(a.name)) })).filter(p => string(p.name) && p.activities.length);
  if (usable.length < 4 || usable.length > 6 || usable.reduce((sum, p) => sum + p.activities.length, 0) > total) return null;
  const durations = splitMinutes(total, usable.map(p => positive(p.duration)));
  const phases: Phase[] = usable.map((p, i) => {
    const mins = splitMinutes(durations[i], p.activities.map(a => positive(a.duration)));
    return { name: string(p.name), duration: durations[i], activities: p.activities.map((a, j): Activity => ({
      name: string(a.name), duration: mins[j], description: string(a.description), setup: string(a.setup), equipment: string(a.equipment),
      coachingPoints: strings(a.coachingPoints), progressions: strings(a.progressions), regressions: strings(a.regressions),
      format: string(a.format), rules: strings(a.rules), questions: strings(a.questions), commonErrors: strings(a.commonErrors),
      area: a.area as Activity['area'], allocation: a.allocation as Activity['allocation'], diagram: a.diagram as Activity['diagram'],
    })) };
  });
  if (phases.some(p => p.activities.some(a => a.duration < 1))) return null;
  const overview = object(data.overview);
  return { title: string(data.title, `${t.teamName || 'Team'} Training Session`), duration: total, objectives: strings(data.objectives), phases,
    overview: { theme: string(overview.theme, t.sessionGoals || ''), outcome: string(overview.outcome) },
    ageGroup: t.ageGroup, skillLevel: t.skillLevel, playerCount: Number(t.playerCount) || undefined, generator: 'ai' };
}