import { describe, it, expect } from 'vitest';
import { normalizeAiPlan } from './aiPlan';

const act = (name: string, duration: number, extra: Partial<Record<string, string[]>> = {}) => ({
  name, duration, description: 'd', setup: 's', equipment: 'e',
  coachingPoints: ['Scan early', ...(extra.cp ?? [])], progressions: ['p'], regressions: ['r'],
});
const raw = {
  title: 'Passing', objectives: ['Pass'],
  phases: [
    { name: 'Warm-Up', duration: 7, activities: [act('A', 4), act('B', 4)] },
    { name: 'Technical Practice', duration: 22, activities: [act('C', 20, { cp: ['Practise heading the ball'] })] },
    { name: 'Tactical Practice', duration: 20, activities: [act('D', 20)] },
    { name: 'Cool-Down', duration: 5, activities: [act('E', 5)] },
  ],
};

describe('normalizeAiPlan', () => {
  for (const d of [45, 60, 75, 90, 120]) {
    it(`phases and activities sum exactly to ${d} minutes`, () => {
      const p = normalizeAiPlan(raw, { sessionDuration: d, ageGroup: 'u13' })!;
      expect(p.phases.reduce((a, b) => a + b.duration, 0)).toBe(d);
      for (const ph of p.phases) expect(ph.activities.reduce((a, b) => a + b.duration, 0)).toBe(ph.duration);
    });
  }
  it('removes heading for U11 and below', () => {
    const p = normalizeAiPlan(raw, { sessionDuration: 60, ageGroup: 'u9' })!;
    expect(JSON.stringify(p)).not.toMatch(/heading/i);
  });
  it('keeps heading points for older players', () => {
    const p = normalizeAiPlan(raw, { sessionDuration: 60, ageGroup: 'u15' })!;
    expect(JSON.stringify(p)).toMatch(/heading/i);
  });
  it('returns null for unusable output', () => {
    expect(normalizeAiPlan({ phases: [] }, { sessionDuration: 60 })).toBeNull();
  });
});
