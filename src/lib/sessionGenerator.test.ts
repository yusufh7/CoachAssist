import { describe, it, expect } from 'vitest';
import { generateSessionPhases, splitMinutes, buildSessionPlan, gameFormat, ageGameFormat, detectThemes } from './sessionGenerator';
import { teamSetupSchema } from './validation';

describe('session timing', () => {
  for (const duration of [45, 60, 75, 90, 120]) {
    it(`phases sum exactly to ${duration} minutes and activities sum to each phase`, () => {
      for (const players of [6, 13, 16]) {
        const phases = generateSessionPhases({ sessionDuration: duration, playerCount: players, sessionGoals: 'passing and finishing' });
        expect(phases.reduce((a, p) => a + p.duration, 0)).toBe(duration);
        for (const p of phases) {
          expect(p.activities.reduce((a, x) => a + x.duration, 0)).toBe(p.duration);
        }
      }
    });
  }

  it('splitMinutes distributes remainders', () => {
    expect(splitMinutes(45, [15, 35, 35, 15]).reduce((a, b) => a + b, 0)).toBe(45);
  });
});

describe('content varies with inputs', () => {
  it('different goals give different main practices', () => {
    const a = buildSessionPlan({ sessionGoals: 'finishing', playerCount: 12, sessionDuration: 60 });
    const b = buildSessionPlan({ sessionGoals: 'defensive shape', playerCount: 12, sessionDuration: 60 });
    expect(a.phases[1].activities[0].name).not.toBe(b.phases[1].activities[0].name);
  });
  it('player count changes game format', () => {
    expect(gameFormat(16)).toBe('8v8');
    expect(gameFormat(13)).toBe('6v6 + 1 floater');
  });
  it('U9 squads larger than fourteen split into smaller games', () => {
    expect(ageGameFormat(28, 'u9')).toBe('2 pitches: 7v7');
  });
  it('passing under pressure stays a passing theme, not defending', () => {
    expect(detectThemes('Passing under pressure')).toEqual(['passing']);
  });
});

describe('team setup validation', () => {
  const base = { ageGroup: 'u11', skillLevel: 'beginner', playerCount: '12', sessionDuration: '60', sessionGoals: 'Improve passing and finishing' };
  it('accepts punctuation and keeps spaces', () => {
    const r = teamSetupSchema.parse({ ...base, teamName: "St. Mary's U12 & Co" });
    expect(r.teamName).toBe("St. Mary's U12 & Co");
    expect(r.sessionGoals).toBe('Improve passing and finishing');
  });
  it('allows blank playing style', () => {
    expect(teamSetupSchema.safeParse({ ...base, teamName: 'Eagles', playingStyle: '' }).success).toBe(true);
  });
  it('accepts fifty players but rejects fifty-one', () => {
    expect(teamSetupSchema.safeParse({ ...base, teamName: 'Eagles', playerCount: 50 }).success).toBe(true);
    expect(teamSetupSchema.safeParse({ ...base, teamName: 'Eagles', playerCount: 51 }).success).toBe(false);
  });
});
