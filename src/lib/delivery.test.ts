import { describe, it, expect } from 'vitest';
import { blockInputs, replaceActivity, remainingSeconds } from './delivery';
import { buildSessionPlan } from './sessionGenerator';

describe('Phase 3 delivery rules', () => {
  it('replaces only one practice and keeps session and practice time unchanged', () => {
    const plan = buildSessionPlan({ sessionDuration: 60, playerCount: 12 });
    const next = replaceActivity(plan, 1, 0, { ...plan.phases[1].activities[0], name: 'Adjusted', duration: 99 });
    expect(next.phases[1].activities[0].name).toBe('Adjusted');
    expect(next.phases[1].activities[0].duration).toBe(plan.phases[1].activities[0].duration);
    expect(next.duration).toBe(60);
    expect(next.phases[0]).toEqual(plan.phases[0]);
    expect(next.phases[2]).toEqual(plan.phases[2]);
  });
  it.each([4, 5, 6])('creates %i progressive sessions on the same theme', count => {
    const inputs = blockInputs({ ageGroup: 'u9' }, 'Playing out from the back', count);
    expect(inputs).toHaveLength(count);
    expect(inputs.every(i => i.sessionGoals === 'Playing out from the back')).toBe(true);
    expect(inputs[0].currentFocus).toContain('pairs');
    expect(inputs[count - 1].currentFocus).toContain('independently');
  });
  it('rejects blocks outside 4–6 sessions', () => expect(() => blockInputs({}, 'Pressing', 3)).toThrow());
  it('counts elapsed wall-clock time, including background time, and never goes negative', () => {
    expect(remainingSeconds(61000, 1000)).toBe(60);
    expect(remainingSeconds(61000, 31500)).toBe(30);
    expect(remainingSeconds(61000, 70000)).toBe(0);
  });
});