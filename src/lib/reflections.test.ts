import { describe, it, expect } from 'vitest';
import { reflectionSchema, reflectionsThisWeek } from './reflections';

const base = { deliveredOn: '2026-11-16', rating: 4, wentWell: 'Great pressing', toChange: '', playerNotes: '' };
describe('reflections', () => {
  it('accepts a rated reflection with one note', () => expect(reflectionSchema.safeParse(base).success).toBe(true));
  it('requires a 1–5 rating', () => {
    expect(reflectionSchema.safeParse({ ...base, rating: 0 }).success).toBe(false);
    expect(reflectionSchema.safeParse({ ...base, rating: 6 }).success).toBe(false);
  });
  it('requires at least one note', () => expect(reflectionSchema.safeParse({ ...base, wentWell: '   ' }).success).toBe(false));
  it('counts only the last seven days', () => expect(reflectionsThisWeek(['2026-11-16', '2026-11-10', '2026-11-09', '2026-11-17'], '2026-11-16')).toBe(2));
});
