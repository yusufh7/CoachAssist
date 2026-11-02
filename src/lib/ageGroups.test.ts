import { expect, it } from 'vitest';
import { AGE_GROUPS, maxSide, noHeadingAge } from './ageGroups';
it('offers every age group from U7 to U18 plus adult', () => {
  expect(AGE_GROUPS).toEqual(['u7','u8','u9','u10','u11','u12','u13','u14','u15','u16','u17','u18','adult']);
});
it('uses FA formats per age', () => {
  expect([maxSide('u8'), maxSide('u10'), maxSide('u12'), maxSide('u13')]).toEqual([5, 7, 9, 11]);
});
it('bans heading for U12 and below only', () => {
  expect(noHeadingAge('u12')).toBe(true);
  expect(noHeadingAge('u13')).toBe(false);
});
