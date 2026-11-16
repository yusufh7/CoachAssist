import { describe, expect, it } from 'vitest';
import { matchesPractice, type PracticeFilters, type PracticeSummary } from './practiceFilters';
const filters: PracticeFilters = { query: '', players: '', minutes: 'all', difficulty: 'all', age: 'all' };
const practice: PracticeSummary = { id: 1, title: 'Passing', description: 'Receive under pressure', players: '8-12', duration: '15-20 mins', difficulty: 'Beginner' };
describe('Practice matching', () => {
  it('searches title and description case-insensitively', () => {
    expect(matchesPractice(practice, { ...filters, query: ' PRESSURE ' })).toBe(true);
    expect(matchesPractice(practice, { ...filters, query: 'goalkeeping' })).toBe(false);
  });
  it('matches both ends of a player range and rejects counts outside it', () => {
    expect(matchesPractice(practice, { ...filters, players: '8' })).toBe(true);
    expect(matchesPractice(practice, { ...filters, players: '12' })).toBe(true);
    expect(matchesPractice(practice, { ...filters, players: '13' })).toBe(false);
  });
  it('uses the maximum listed duration for available time', () => {
    expect(matchesPractice(practice, { ...filters, minutes: '20' })).toBe(true);
    expect(matchesPractice(practice, { ...filters, minutes: '15' })).toBe(false);
  });
  it('includes all-level entries with a chosen ability', () => {
    expect(matchesPractice(practice, { ...filters, difficulty: 'Advanced' })).toBe(false);
    expect(matchesPractice({ ...practice, difficulty: 'All Levels' }, { ...filters, difficulty: 'Advanced' })).toBe(true);
  });
  it('excludes heading themes for U12 and below but not U13', () => {
    const heading = { ...practice, title: 'Attacking Headers' };
    expect(matchesPractice(heading, { ...filters, age: 'u7' })).toBe(false);
    expect(matchesPractice(heading, { ...filters, age: 'u12' })).toBe(false);
    expect(matchesPractice(heading, { ...filters, age: 'u13' })).toBe(true);
  });
});